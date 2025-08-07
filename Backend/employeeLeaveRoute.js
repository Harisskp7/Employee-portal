const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();

// SAP SOAP Configuration
const SAP_URL = 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zep_leave_sd?sap-client=100';
const SAP_AUTH = {
  username: 'K901577',
  password: 'Harish@0701'
};

// Helper to post SOAP request
async function sapPost(xmlBody) {
  try {
    const { data } = await axios.post(SAP_URL, xmlBody, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZEP_LEAVE577_FM'
      },
      auth: SAP_AUTH
    });
    return data;
  } catch (error) {
    throw new Error(`SAP Post Failed: ${error.message}`);
  }
}

// Route for fetching leave data
router.post('/', async (req, res) => {
  const { EMPLOYEE_ID } = req.body;

  if (!EMPLOYEE_ID) {
    return res.status(400).json({ success: false, message: 'Missing EMPLOYEE_ID' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZEP_LEAVE577_FM>
          <IV_EMP_ID>${EMPLOYEE_ID}</IV_EMP_ID>
        </urn:ZEP_LEAVE577_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await sapPost(soapBody);

    xml2js.parseString(response, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'XML Parsing Error', error: err });

      try {
        const body = result['soapenv:Envelope']?.['soapenv:Body'] ||
                     result['soap-env:Envelope']?.['soap-env:Body'];

        const leaveRes = Object.values(body)[0]; // <n0:ZEP_LEAVE577_FMResponse>
        const absences = leaveRes?.ET_ABSENCES?.item || [];
        const quotas = leaveRes?.ET_QUOTAS?.item || [];

        const formatList = (data) => Array.isArray(data) ? data : [data];

        res.json({
          success: true,
          data: {
            EV_TOTAL_QUOTA: leaveRes.EV_TOTAL_QUOTA,
            EV_LEAVE_TAKEN: leaveRes.EV_LEAVE_TAKEN,
            EV_HOURS: leaveRes.EV_HOURS,
            EV_DAYS: leaveRes.EV_DAYS,
            ET_ABSENCES: formatList(absences),
            ET_QUOTAS: formatList(quotas)
          }
        });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Unexpected SAP response', error: e.message });
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Leave request failed', error: err.message });
  }
});

module.exports = router;
