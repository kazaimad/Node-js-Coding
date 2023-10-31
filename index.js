const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;
const moment = require('moment');

const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb://127.0.0.1:27017/project";

mongoose.connect('mongodb://127.0.0.1:27017/project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json());

// Mongoose Schema for Employee
const employeeSchema = new mongoose.Schema({
  lastName: String,
  firstName: String,
  dateCreated: Date,
  department: String,
  checkIn: Date, // Add a field for check-in time
  checkOut: Date, // Add a field for check-out time
  comment: String, // Add a field for comments
  timeBetweenCheckInAndCheckOut: Number,
});

const Employee = mongoose.model('Employee', employeeSchema);
/**
 * Create a new employee.
 * @route POST /employees
 * @group TimeClock - Employee operations
 * @param {string} lastName.body.required - Last name of the employee.
 * @param {string} firstName.body.required - First name of the employee.
 * @param {string} dateCreated.body.required - Date of employee creation (format: 'YYYY-MM-DDTHH:mm:ss').
 * @param {string} department.body.required - Department of the employee.
 * @returns {object} 201 - The newly created employee.
 * @returns {object} 500 - Internal server error.
 */

// Endpoint to create a new employee
app.post('/employees', async (req, res) => {
  try {
    const { lastName, firstName, dateCreated, department } = req.body;
    const employee = new Employee({
      lastName,
      firstName,
      dateCreated,
      department,
      
    });
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create an employee' });
  }
});
/**
 * Retrieve a list of all employees.
 * @route GET /employees
 * @group TimeClock - Employee operations
 * @returns {Array.<object>} 200 - An array of employee objects.
 * @returns {object} 500 - Internal server error.
 */

// Get a list of employees
app.get('/employees', async (req, res) => {
  try {
    const { dateCreated } = req.query;
    const query = {};

    if (dateCreated) {
      query.dateCreated = { $gte: new Date(dateCreated) }; // Filter employees created on or after the specified date
    }

    const employees = await Employee.find(query);

    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Record the check-in time for an employee.
 * @route POST /timeclock/check-in
 * @group TimeClock - Check-In/Out operations
 * @param {string} employeeId.body.required - The unique identifier of the employee.
 * @param {string} comment.body - Optional comment.
 * @returns {object} 200 - The updated employee object with check-in time.
 * @returns {object} 404 - Employee not found.
 * @returns {object} 500 - Internal server error.
 */
// Check-in endpoint
app.post('/check-in', async (req, res) => {
  try {
    const { employeeId, comment } = req.body;

    // Find the employee by their unique ID (you should use a unique identifier for employees)
    const employee = await Employee.findOne({ _id: employeeId });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    
    employee.checkIn = new Date();
    employee.comment = comment;

    await employee.save();

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * Record the check-out time for an employee and calculate time between check-in and check-out.
 * @route POST /timeclock/check-out
 * @group TimeClock - Check-In/Out operations
 * @param {string} employeeId.body.required - The unique identifier of the employee.
 * @param {string} comment.body - Optional comment.
 * @returns {object} 200 - The updated employee object with check-out time and time calculation.
 * @returns {object} 404 - Employee not found.
 * @returns {object} 400 - No check-in time found for the employee.
 * @returns {object} 500 - Internal server error.
 */
// Check-out endpoint
app.post('/check-out', async (req, res) => {
  try {
    const { employeeId, comment } = req.body;

    // Find the employee by their unique ID (you should use a unique identifier for employees)
    const employee = await Employee.findOne({ _id: employeeId });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    if (!employee.checkIn) {
      return res.status(400).json({ error: 'No check-in time found for the employee' });
    }

    // Record the check-out time
    employee.checkOut = new Date();
    employee.comment = comment;

    // Calculate the time between check-in and check-out
    const checkInTime = employee.checkIn.getTime();
    const checkOutTime = employee.checkOut.getTime();
    const timeDifferenceInMilliseconds = checkOutTime - checkInTime;

    // Save the time difference in seconds
    employee.timeBetweenCheckInAndCheckOut = timeDifferenceInMilliseconds / 1000;

    await employee.save();

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});