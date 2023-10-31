// src/controllers/employeeController.js
const Employee = require('../models/employeeModel');

class EmployeeController {
    async getAllEmployees(req, res) {
        try {
          const employees = await Employee.find({});
          res.status(200).json(employees);
        } catch (err) {
          res.status(500).json({ message: 'Error fetching employees', error: err });
        }
      }

      async getEmployeesByDate(req, res) {
        try {
          const date = new Date(req.params.date); // Convert the date parameter to a Date object
          const employees = await Employee.find({ dateCreated: date });
    
          res.status(200).json(employees);
        } catch (err) {
          res.status(500).json({ message: 'Error filtering employees by date', error: err });
        }
      }

   async createEmployee(req, res) {
    try {
      const employee = new Employee(req.body);
      await employee.save();
      res.status(201).json({ message: 'Employee created successfully', employee });
    } catch (err) {
      res.status(400).json({ message: 'Employee creation failed', error: err });
    }
  }
  // Implement other controller methods for check-in, check-out, and duration calculation
}