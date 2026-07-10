import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams, Link } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams(); // Grabs the project ID from the URL
  const { token } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
  }, []);

  const fetchProjectDetails = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) setProject(await res.json());
  };

  const fetchTasks = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/tasks/?project=${id}`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) setTasks(await res.json());
  };

  const deleteTask = async (taskId) => {
    const res = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) fetchTasks();
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/projects">← Back to Projects</Link>
      <h2>{project.name}</h2>
      <p>{project.description}</p>

      <hr />
      <h3>Tasks</h3>
      <Link to={`/projects/${id}/tasks/new`}>
        <button>+ Add Task</button>
      </Link>

      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              margin: "15px 0",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <strong>{task.title}</strong> - {task.status} ({task.priority}{" "}
            Priority)
            <br /> Due: {task.due_date}
            <br /> Assigned To:{" "}
            {task.assignee_name ? task.assignee_name : "Unassigned"}
            <br />
            <br />
            <Link to={`/tasks/${task.id}/edit`}>
              <button style={{ marginRight: "10px" }}>Edit</button>
            </Link>
            <button
              onClick={() => deleteTask(task.id)}
              style={{ color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProjectDetails;
