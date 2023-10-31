
// routes/employees.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/created/:date', employeeController.getEmployeesByDate);
router.post('/employees', employeeController.createEmployee);
// Define routes for check-in, check-out, and duration calculation

module.exports = router;