
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "business.db"));

// Create the employees table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    salary REAL NOT NULL
  )
`);

// Insert sample employees only when the table is empty
const count = db.prepare(
  "SELECT COUNT(*) AS total FROM employees"
).get();

if (count.total === 0) {
  const insert = db.prepare(`
    INSERT INTO employees (name, department, salary)
    VALUES (?, ?, ?)
  `);

  const addEmployees = db.transaction(() => {
    insert.run("Rahul Sharma", "IT", 45000);
    insert.run("Priya Reddy", "HR", 38000);
    insert.run("Arjun Kumar", "Finance", 42000);
  });

  addEmployees();
}

module.exports = db;
