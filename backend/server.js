
const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Home page
app.get("/", (req, res) => {
  res.send("Business Management System API is running!");
});

// Check backend and database
app.get("/api/health", (req, res) => {
  try {
    db.prepare("SELECT 1").get();
    res.json({
      status: "OK",
      database: "SQLite connected"
    });
  } catch (error) {
    res.status(500).json({ error: "Database check failed" });
  }
});

// Get all employees
app.get("/api/employees", (req, res) => {
  try {
    const employees = db.prepare(
      "SELECT * FROM employees ORDER BY id"
    ).all();

    res.json(employees);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to retrieve employees" });
  }
});


 // Update an employee
app.put("/api/employees/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, department, salary } = req.body;

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof department !== "string" ||
    !department.trim() ||
    salary === "" ||
    salary === null ||
    salary === undefined ||
    !Number.isFinite(Number(salary)) ||
    Number(salary) < 0
  ) {
    return res.status(400).json({
      error: "Enter a valid name, department, and non-negative salary."
    });
  }

  try {
    const result = db.prepare(`
      UPDATE employees
      SET name = ?, department = ?, salary = ?
      WHERE id = ?
    `).run(name.trim(), department.trim(), Number(salary), id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Employee not found."
      });
    }

    const employee = db.prepare(
      "SELECT * FROM employees WHERE id = ?"
    ).get(id);

    res.json({
      message: "Employee updated successfully.",
      employee
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Failed to update employee."
    });
  }
});


// Add an employee
app.post("/api/employees", (req, res) => {
  const { name, department, salary } = req.body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof department !== "string" || !department.trim() ||
    salary === "" || salary === null ||
    salary === undefined || !Number.isFinite(Number(salary)) ||
    Number(salary) < 0
  ) {
    return res.status(400).json({
      error: "Enter a valid name, department, and non-negative salary"
    });
  }

  try {
    const result = db.prepare(`
      INSERT INTO employees (name, department, salary)
      VALUES (?, ?, ?)
    `).run(name.trim(), department.trim(), Number(salary));

    const employee = db.prepare(
      "SELECT * FROM employees WHERE id = ?"
    ).get(result.lastInsertRowid);

    res.status(201).json(employee);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to add employee" });
  }
});


// Delete an employee
app.delete("/api/employees/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid employee ID" });
  }

  const result = db.prepare(
    "DELETE FROM employees WHERE id = ?"
  ).run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Employee not found" });
  }

  res.json({ message: "Employee deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("SQLite database is ready.");
});
