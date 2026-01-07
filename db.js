const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",          // change if different
  password: "radhakrishna", // put your MySQL password
  database: "workforce4"  // MUST match your DB name
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    return;
  }
  console.log("✅ MySQL connected");
});

module.exports = db;
