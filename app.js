const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb://127.0.0.1:27017/project";

MongoClient.connect(uri)
  .then(client => {
    console.log("Connected to MongoDB");
    const db = client.db('to-do-app')
    const taskCollection = db.collection('tasks')



  })
  .catch (error => console.error(error))
  const employeeSchema = new mongoose.Schema({
    lastName: String,
    firstName: String,
    dateCreated: Date,
    department: String,
    
  });
  const Employee = mongoose.model('Employee', employeeSchema);


  app.get('/', (req, res) => {
    res.send('Hello, this is your API.');
  });
  app.get('/employees', (req, res) => {
    const { dateCreated } = req.query;
  
    let query = Employee.find();
  
    if (dateCreated) {
      query.where('dateCreated').equals(dateCreated);
    }
  
    query.exec((err, employees) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      res.json(employees);
    });
  });
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




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
