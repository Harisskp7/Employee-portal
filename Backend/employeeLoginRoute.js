const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();

const SAP_URL = 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zep_login_sd?sap-client=100';
const SAP_AUTH = {
  username: 'K901577',
  password: 'Haris@0713'
};

async function sapPost(xmlBody) {
  try {
    const { data } = await axios.post(SAP_URL, xmlBody, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions'
      },
      auth: {
        username: SAP_AUTH.username,
        password: SAP_AUTH.password
      }
    });
    return data;
  } catch (error) {
    throw new Error(`SAP Post Failed: ${error.message}`);
  }
}

router.post('/', async (req, res) => {
  const { EMPLOYEE_ID, PASSWORD } = req.body;

  if (!EMPLOYEE_ID || !PASSWORD) {
    return res.status(400).json({ success: false, message: 'Missing EmployeeId or password' });
  }

  const soapBody = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZEMP_LOGIN577_FM>
          <IV_EMPLOYEE_ID>${EMPLOYEE_ID}</IV_EMPLOYEE_ID>
          <IV_PASSWORD>${PASSWORD}</IV_PASSWORD>
        </urn:ZEMP_LOGIN577_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await sapPost(soapBody);

    xml2js.parseString(response, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ message: 'XML Parsing Error', error: err });

      try {
        // Debug: print entire SOAP body
        console.log(JSON.stringify(result, null, 2));

        const body = result['soapenv:Envelope']?.['soapenv:Body'] || 
                     result['soap-env:Envelope']?.['soap-env:Body'];

        const loginRes = Object.values(body)[0]; // Get the first response child node

        const flag = loginRes?.EV_FLAG;
        const message = loginRes?.EV_MESSAGE;

        if (flag === 'X') {
          res.cookie('pernr', EMPLOYEE_ID, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax'
          });
          res.json({ success: true, message });
        } else {
          res.status(401).json({ success: false, message });
        }
      } catch (e) {
        res.status(500).json({ message: 'Unexpected SAP response', error: e.message });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login request failed', error: err.message });
  }
});

module.exports = router;
