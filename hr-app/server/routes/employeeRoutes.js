const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const documentController = require('../controllers/documentController');

// Get all employees
router.get('/', employeeController.getAllEmployees);

// Get employee by Poornata ID
router.get('/:poornataId', employeeController.getEmployeeByPoornataId);

// Create new employee
router.post('/', employeeController.createEmployee);

// Update employee
router.put('/:poornataId', employeeController.updateEmployee);

// Delete employee
router.delete('/:poornataId', employeeController.deleteEmployee);

// Generate POSH document
router.get('/:poornataId/generate-posh', documentController.generatePOSHDocument);

module.exports = router; 