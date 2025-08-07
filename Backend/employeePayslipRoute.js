const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();

const SAP_URL = 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zep_payslip_sd?sap-client=100';
const SAP_AUTH = {
  username: 'K901577',
  password: 'Harish@0701'
};

// SOAP POST Helper
async function sapPost(xmlBody) {
  try {
    const { data } = await axios.post(SAP_URL, xmlBody, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZEP_PAYSLIP577_FM'
      },
      auth: SAP_AUTH
    });
    return data;
  } catch (error) {
    throw new Error(`SAP Post Failed: ${error.message}`);
  }
}

// Payslip route
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
        <urn:ZEP_PAYSLIP577_FM>
          <IV_PERNR>${EMPLOYEE_ID}</IV_PERNR>
        </urn:ZEP_PAYSLIP577_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await sapPost(soapBody);

    xml2js.parseString(response, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'XML Parsing Error', error: err });

      try {
        const body = result['soapenv:Envelope']?.['soapenv:Body'] ||
                     result['soap-env:Envelope']?.['soap-env:Body'];

        const payslipRes = Object.values(body)[0];
        const payroll = payslipRes?.ES_PAYROLL;

        if (payroll && payroll.PERNR) {
          res.json({
            success: true,
            data: {
              PERNR: payroll.PERNR,
              COSTCENTER: payroll.COSTCENTER,
              PAYTYPE: payroll.PAYTYPE,
              PAYAREA: payroll.PAYAREA,
              PAYGROUP: payroll.PAYGROUP,
              PAYLEVEL: payroll.PAYLEVEL,
              WAGETYPE: payroll.WAGETYPE,
              CURR: payroll.CURR,
              SALARY: payroll.SALARY,
              ANNUAL: payroll.ANNUAL,
              CAPACITY: payroll.CAPACITY,
              WORKHRS: payroll.WORKHRS,
              BANK_NAME: payroll.BANK_NAME,
              BANK_KEY: payroll.BANK_KEY,
              ACC_NO: payroll.ACC_NO,
              BEGDA: payroll.BEGDA,
              ENDDA: payroll.ENDDA
            }
          });
        } else {
          res.status(404).json({ success: false, message: 'No payroll data found' });
        }
      } catch (e) {
        res.status(500).json({ success: false, message: 'Unexpected SAP response', error: e.message });
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Payslip request failed', error: err.message });
  }
});

module.exports = router;
