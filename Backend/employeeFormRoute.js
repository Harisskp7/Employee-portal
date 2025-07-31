const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();

// 🔐 SAP SOAP RFC Endpoint
const SAP_URL = 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zep_form_sd?sap-client=100';
const SAP_AUTH = {
  username: 'K901577',
  password: 'Haris@0713'
};

// 🔁 SOAP POST Utility
async function sapPost(xmlBody) {
  try {
    const { data } = await axios.post(SAP_URL, xmlBody, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions'
      },
      auth: SAP_AUTH
    });
    return data;
  } catch (error) {
    throw new Error(`SAP Post Failed: ${error.message}`);
  }
}

// 📄 GET route to fetch payslip
router.post('/', async (req, res) => {
  const { employeeId, month, year } = req.body;

  if (!employeeId || !month || !year) {
    return res.status(400).json({ success: false, message: 'Missing query parameters: employeeId, month, year' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZEP_FORM577_FM>
          <MONTH>${month}</MONTH>
          <PERNR>${employeeId}</PERNR>
          <YEAR>${year}</YEAR>
        </urn:ZEP_FORM577_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await sapPost(soapBody);

    xml2js.parseString(response, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'XML Parsing Error', error: err });

      try {
        const body = result['soapenv:Envelope']?.['soapenv:Body'] || result['soap-env:Envelope']?.['soap-env:Body'];
        const payslipResponse = body?.['n0:ZEP_FORM577_FMResponse'] || Object.values(body)[0];

        const pdfBase64 = payslipResponse?.PAYSLIP_PDF || payslipResponse?.PAYSLIP_PDF;

        if (!pdfBase64) {
          return res.status(404).json({ success: false, message: 'Payslip PDF not found in response' });
        }

        res.json({
          success: true,
          pdf_base64: pdfBase64,
          filename: `Payslip_${month}_${year}.pdf`
        });
      } catch (e) {
        res.status(500).json({ message: 'Unexpected SAP response structure', error: e.message });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'SAP Request Failed', error: err.message });
  }
});

module.exports = router;
