
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/employees";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    async function loadEmployees() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to load employees");
        }

        const data = await response.json();
        setEmployees(data);
        setError("");
      } catch (error) {
        setError(error.message);
      }
    }

    loadEmployees();
  }, []);

  
async function handleDelete(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this employee?"
  );

  if (!confirmed) {
    return;
  }

  setError("");
  setMessage("");

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to delete employee");
    }

    setEmployees((previous) =>
      previous.filter((employee) => employee.id !== id)
    );

    if (editingId === id) {
      cancelEdit();
    }

    setMessage("Employee deleted successfully!");
  } catch (error) {
    setError(error.message);
  }
}


  
  function startEdit(employee) {
    setEditingId(employee.id);
    setName(employee.name);
    setDepartment(employee.department);
    setSalary(String(employee.salary));
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setDepartment("");
    setSalary("");
    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim() || !department.trim() || salary === "") {
      setError("Please fill in all three fields.");
      return;
    }

    if (
      !Number.isFinite(Number(salary)) ||
      Number(salary) < 0
    ) {
      setError("Please enter a valid, non-negative salary.");
      return;
    }

    setSaving(true);

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            department: department.trim(),
            salary: Number(salary),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The operation failed."
        );
      }

      if (isEditing) {
        setEmployees((previous) =>
          previous.map((employee) =>
            employee.id === editingId
              ? data.employee
              : employee
          )
        );
        setMessage("Employee updated successfully!");
      } else {
        setEmployees((previous) => [...previous, data]);
        setMessage("Employee added successfully!");
      }

      setEditingId(null);
      setName("");
      setDepartment("");
      setSalary("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="employee-list">
      <h2>
        {editingId !== null ? "Edit Employee" : "Add Employee"}
      </h2>

      <form className="employee-form" onSubmit={handleSubmit}>
        <label htmlFor="employee-name">Employee Name</label>
        <input
          id="employee-name"
          type="text"
          placeholder="Enter employee name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="employee-department">Department</label>
        <input
          id="employee-department"
          type="text"
          placeholder="Enter department"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
          required
        />

        <label htmlFor="employee-salary">Salary (₹)</label>
        <input
          id="employee-salary"
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter salary"
          value={salary}
          onChange={(event) => setSalary(event.target.value)}
          required
        />

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId !== null
                ? "Save Changes"
                : "Add Employee"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="cancel-button"
              onClick={cancelEdit}
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <h2>Employee List</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.department}</td>
              <td>
                ₹{Number(employee.salary).toLocaleString("en-IN")}
              </td>
              <td>
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => startEdit(employee)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(employee.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {employees.length === 0 && (
            <tr>
              <td colSpan="5">No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
