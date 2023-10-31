const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  lastName: String,
  firstName: String,
  dateCreated: Date,
  department: String,
 
});

module.exports = mongoose.model('Employee', employeeSchema);

