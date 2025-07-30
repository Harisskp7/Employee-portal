const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();

// Update with Employee Profile endpoint
const SAP_URL = 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zep_profile_sd?sap-client=100';
const SAP_AUTH = {
  username: 'K901577',
  password: 'Haris@0713'
};

// SOAP POST Helper
async function sapPost(xmlBody) {
  try {
    const { data } = await axios.post(SAP_URL, xmlBody, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZEP_PROFILE577_FM'
      },
      auth: SAP_AUTH
    });
    return data;
  } catch (error) {
    throw new Error(`SAP Post Failed: ${error.message}`);
  }
}

// Employee profile fetch route
router.post('/', async (req, res) => {
  const { EMPLOYEE_ID } = req.body;

  if (!EMPLOYEE_ID) {
    return res.status(400).json({ success: false, message: 'Missing EMPLOYEE_ID' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZEP_PROFILE577_FM>
          <IV_PERNR>${EMPLOYEE_ID}</IV_PERNR>
        </urn:ZEP_PROFILE577_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await sapPost(soapBody);

    xml2js.parseString(response, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ message: 'XML Parsing Error', error: err });

      try {
        const body = result['soapenv:Envelope']?.['soapenv:Body'] ||
                     result['soap-env:Envelope']?.['soap-env:Body'];

        const profileRes = Object.values(body)[0]; // n0:ZEP_PROFILE577_FMResponse
        const profile = profileRes?.ES_PROFILE;

        if (profile && profile.PERSNO) {
          res.json({
            success: true,
            data: {
              PERSNO: profile.PERSNO,
              FIRST_NAME: profile.FIRST_NAME,
              LAST_NAME: profile.LAST_NAME,
              EMAIL: profile.EMAIL,
              GENDER: profile.GENDER_TEXT,
              DOB: profile.DOB,
              JOIN_DATE: profile.JOIN_DATE,
              COMPANY: profile.COMPANY,
              COM_NAME: profile.COM_NAME,
              COM_STREET: profile.COM_STREET,
              COM_CITY: profile.COM_CITY,
              COMP_PIN: profile.COMP_PIN,
              COM_COUNTRY: profile.COM_COUNTRY,
              COM_COUNTRY_TXT: profile.COM_COUNTRY_TXT,
              CITY: profile.CITY,
              PIN_CODE: profile.PIN_CODE,
              COUNTRY: profile.COUNTRY,
              COUNTRY_TXT: profile.COUNTRY_TXT,
              NATIONALITY: profile.NATIONALITY,
              NATIONALITY_TXT: profile.NATIONALITY_TXT,
              EMP_GROUP: profile.EMP_GROUP_TXT,
              EMP_SUBGROUP: profile.EMP_SUB_TXT,
              PERS_AREA: profile.PERS_AREA_TEXT,
              PERS_SUBAREA: profile.PERS_SUBAREA_TEXT,
            }
          });
        } else {
          res.status(404).json({ success: false, message: 'Employee not found' });
        }
      } catch (e) {
        res.status(500).json({ message: 'Unexpected SAP response structure', error: e.message });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Profile request failed', error: err.message });
  }
});

module.exports = router;
