# Business Management System

A full-stack web application for managing employee records, built with React.js, Node.js, Express.js, and SQLite.

## Features

- Add new employees
- View all employee details
- Edit employee information
- Delete employee records
- REST API integration
- SQLite database for data storage
- Responsive and professional user interface

## Technologies Used

- **Frontend:** React.js, JavaScript, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Tools:** Visual Studio Code, Git, GitHub

## Project Structure

```text
business-management-system/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── server.js
│   ├── database.js
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install Node.js and npm before running the application.

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd business-management-system
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Start the Backend

```bash
npm start
```

The backend runs at:

`http://localhost:5000`

### 4. Install Frontend Dependencies

Open a new terminal in the project root and run:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL displayed in your terminal, usually:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/employees` | Get all employees |
| POST | `/api/employees` | Add an employee |
| PUT | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |

## Learning Objectives

This project demonstrates React frontend development, REST API integration, Express backend development, SQLite database operations, and CRUD functionality.

## Author

**Akshay Shakatla**

## License

This project is intended for learning and portfolio purposes.
