const express = require("express");
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/Users')

mongoose.connect("mongodb+srv://KyleAnthonyHay:KH123@briefly.fqr9z2v.mongodb.net/BrieflyDatabase?retryWrites=true&w=majority");

// Check if the database connection was successful
mongoose.connection.on('connected', () => {
  console.log('Connected to database');
});

// Check if there was an error connecting to the database
mongoose.connection.on('error', (error) => {
  console.log('Error connecting to database:', error);
});

// Define the endpoint to get all users
app.get("/getUsers", (req, res) => {
  // Use the UserModel to find all documents in the users collection
  UserModel.find({}, (err, result) =>{
    if (err) {
      // If there was an error, send the error message as a JSON response
      res.json(err);
    } else {
      // If there were no errors, send the documents as a JSON response
      res.json(result);
    }
  });
});

// Start the server and listen on port 3001
app.listen(3001, () =>{
  console.log("Server works!")
});
