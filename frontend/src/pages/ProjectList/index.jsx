import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/projects/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      alert("Network Error: Failed to load projects.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/projects/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        fetchProjects();
      } else {
        alert("Failed to delete. Are you the owner?");
      }
    } catch (error) {
      alert("Network Error: Could not connect to the server.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Projects</h2>
      <Link to="/projects/new">
        <button>Create New Project</button>
      </Link>
      <ul>
        {projects.map((project) => (
          <li key={project.id} style={{ margin: "10px 0" }}>
            <Link to={`/projects/${project.id}`}>
              <strong>{project.name}</strong>
            </Link>{" "}
            - {project.description}
            <button
              onClick={() => handleDelete(project.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProjectList;
