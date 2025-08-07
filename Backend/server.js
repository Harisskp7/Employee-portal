// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const xml2js = require('xml2js');
const https = require('https');

// Import route files
const employeeLoginRoute = require('./empLoginRoute');
const employeeProfileRoute = require('./employeeProfileRoute');
const employeeLeaveRoute = require('./employeeLeaveRoute');
const employeePayslipRoute = require('./employeePayslipRoute');
const employeeFormRoute = require('./employeeFormRoute');
// const customerOverallsalesRoute = require('./customerOversalesRoute');
// const customerInvoiceRoute = require('./customerInvoiceRoute');
// const customerMemoRoute = require('./customerMemoRoute');
// const customerPayRoute = require('./customerAgingRoute');
// const customerFormRoute = require('./customerFormRoute');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for credentials support
app.use(cors({

}));

app.use(bodyParser.json());

// Route mounting
app.use('/api/employee/login',employeeLoginRoute );  // if you move login to route file
app.use('/api/employee/profile', employeeProfileRoute);
app.use('/api/employee/leave', employeeLeaveRoute);
app.use('/api/employee/payslip', employeePayslipRoute);
app.use('/api/employee/payslip/pdf', employeeFormRoute);
// app.use('/api/customer/overallsales', customerOverallsalesRoute);
// app.use('/api/customer/inv', customerInvoiceRoute);
// app.use('/api/customer/memo', customerMemoRoute);
// app.use('/api/customer/pay', customerPayRoute);
// app.use('/api/customer/form', customerFormRoute);


// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
