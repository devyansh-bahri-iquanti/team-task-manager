import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/projects/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) setProject(await res.json());
    } catch (error) {
      console.error("Network error fetching project details");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks/?project=${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) setTasks(await res.json());
    } catch (error) {
      console.error("Network error fetching tasks");
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchTasks();
      } else {
        const err = await res.json();
        alert("Update failed: " + JSON.stringify(err));
      }
    } catch (error) {
      alert("Network Error: Could not connect to the server.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) fetchTasks();
    } catch (error) {
      alert("Network Error: Could not delete task.");
    }
  };

  if (!project) return <p>Loading...</p>;

  // Filter tasks into columns
  const todoTasks = tasks.filter((t) => t.status === "Todo");
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress");
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  const renderTaskCard = (task) => (
    <div key={task.id} className="task-card">
      <strong>{task.title}</strong> ({task.priority})
      <p style={{ margin: "5px 0", fontSize: "14px" }}>{task.description}</p>
      <small>
        Assigned: {task.assignee_name ? task.assignee_name : "Unassigned"}
      </small>
      <select
        value={task.status}
        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
      >
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <div className="task-actions">
        <Link to={`/tasks/${task.id}`}>
          <button
            style={{
              marginRight: "10px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
            }}
          >
            Open
          </button>
        </Link>

        <Link to={`/tasks/${task.id}/edit`}>
          <button style={{ marginRight: "10px" }}>Edit</button>
        </Link>
        <button
          onClick={() => deleteTask(task.id)}
          style={{ color: "red", border: "none" }}
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/projects">← Back to Projects</Link>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <Link to={`/projects/${id}/tasks/new`}>
        <button>+ Add Task</button>
      </Link>

      <div className="kanban-board">
        <div className="kanban-column">
          <h3>Todo</h3>
          {todoTasks.map(renderTaskCard)}
        </div>

        <div className="kanban-column">
          <h3>In Progress</h3>
          {inProgressTasks.map(renderTaskCard)}
        </div>

        <div className="kanban-column">
          <h3>Completed</h3>
          {completedTasks.map(renderTaskCard)}
        </div>
      </div>
    </div>
  );
};
export default ProjectDetails;
