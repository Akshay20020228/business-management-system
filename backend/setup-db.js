require("dotenv").config();
const mysql = require("mysql2/promise");

async function setupDatabase() {
  let connection;

  try {
    console.log("Connecting to MySQL...");
    console.log("Host:", process.env.DB_HOST);
    console.log("User:", process.env.DB_USER);
    console.log("Database:", process.env.DB_NAME);

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("MySQL connection successful!");

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    );

    console.log("Database created or already exists.");

    await connection.query(`USE \`${process.env.DB_NAME}\``);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        salary DECIMAL(10,2) NOT NULL
      )
    `);

    console.log("Employees table created successfully.");

    await connection.query(`
      INSERT INTO employees (name, department, salary)
      VALUES
      ('Rahul Sharma', 'IT', 45000),
      ('Priya Reddy', 'HR', 38000),
      ('Arjun Kumar', 'Finance', 42000)
    `);

    console.log("Sample employees inserted.");
    console.log("DATABASE SETUP SUCCESSFUL!");
  } catch (error) {
    console.error("\nDATABASE SETUP FAILED");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();