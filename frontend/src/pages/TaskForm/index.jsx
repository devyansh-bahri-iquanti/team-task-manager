import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const TaskForm = () => {
  const { projectId, taskId } = useParams(); // If taskId exists, we are Editing.
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "Medium",
    status: "Todo",
    assigned_to: "",
  });

  useEffect(() => {
    fetchUsers();
    if (taskId) fetchTaskData(); // Pre-fill the form if editing
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/users/", {
      headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) setUsers(await res.json());
  };

  const fetchTaskData = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setFormData({ ...data, assigned_to: data.assigned_to || "" });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = taskId
      ? `http://127.0.0.1:8000/api/tasks/${taskId}/`
      : "http://127.0.0.1:8000/api/tasks/";
    const method = taskId ? "PUT" : "POST";

    // Attach the project ID to the payload
    const payload = { ...formData, project: projectId || formData.project };

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate(`/projects/${payload.project}`); // Go back to project details
    } else {
      const err = await res.json();
      alert("Error: " + JSON.stringify(err));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{taskId ? "Edit Task" : "Create Task"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <br />
        <br />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <br />
        <br />

        <select
          name="assigned_to"
          value={formData.assigned_to}
          onChange={handleChange}
        >
          <option value="">-- Assign To --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
        <br />
        <br />

        <button type="submit">Save Task</button>
      </form>
    </div>
  );
};
export default TaskForm;
