const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Update if different
  password: "root", // Update if different
  database: "hospiconnect",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// API to handle appointment booking
app.post("/book-appointment", (req, res) => {
  const { patientName, hospital, doctor, appointmentDate, timeSlot } = req.body;

  if (!patientName || !hospital || !doctor || !appointmentDate || !timeSlot) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const sql = "INSERT INTO appointments (patientName, hospital, doctor, appointmentDate, timeSlot) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [patientName, hospital, doctor, appointmentDate, timeSlot], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ message: "Database error!" });
    }
    res.status(201).json({ message: "Appointment booked successfully!" });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
