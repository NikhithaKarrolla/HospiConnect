const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",  // Change if necessary
    database: process.env.DB_NAME || "hospiconnect"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database.");
});

const router = express.Router();

// Fetch all patients
router.get("/patients", (req, res) => {
    db.query("SELECT * FROM patients ORDER BY admission_date DESC", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Add a new patient
router.post("/add_patient", (req, res) => {
    const { name, age, gender, contact, address } = req.body;
    const query = "INSERT INTO patients (name, age, gender, contact, address, admission_date) VALUES (?, ?, ?, ?, ?, NOW())";
    
    db.query(query, [name, age, gender, contact, address], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Patient added successfully!" });
    });
});

app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
