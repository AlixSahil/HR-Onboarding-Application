const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const documentController = require('../controllers/documentController');

// Get all employees
router.get('/', employeeController.getAllEmployees);

// Get employee by personal email
router.get('/:personal_email', employeeController.getEmployeeByPoornataId);

// Create new employee
router.post('/', employeeController.createEmployee);

// Update employee
router.put('/:personal_email', employeeController.updateEmployee);

// Delete employee
router.delete('/:personal_email', employeeController.deleteEmployee);

// Generate POSH document
router.get('/:personal_email/generate-posh', documentController.generatePOSHDocument);

module.exports = router; 