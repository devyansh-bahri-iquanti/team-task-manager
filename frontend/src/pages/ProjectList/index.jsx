import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./ProjectList.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  // NEW: Dedicated state variables for UI feedback
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const { token } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true); // Start loading
    setErrorMsg(""); // Clear old errors
    try {
      const response = await fetch(`${API_URL}/projects/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setErrorMsg("Failed to load projects. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Network Error: Could not connect to the server.");
    } finally {
      setIsLoading(false); // Stop loading regardless of success/failure
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      const response = await fetch(`${API_URL}/projects/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        fetchProjects();
      } else {
        setErrorMsg("Failed to delete. You might not have permission.");
      }
    } catch (error) {
      setErrorMsg("Network Error: Could not execute deletion.");
    }
  };

  return (
    <div className="project-container">
      <h2>Projects</h2>
      <Link to="/projects/new">
        <button style={{ marginBottom: "20px" }}>Create New Project</button>
      </Link>

      {/* PROFESSIONAL ERROR HANDLING UI */}
      {errorMsg && (
        <div
          style={{
            backgroundColor: "#ffcccc",
            color: "#cc0000",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {/* PROFESSIONAL LOADING UI */}
      {isLoading ? (
        <p>Loading your projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects found. Create one to get started!</p>
      ) : (
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.id} className="project-card">
              <div>
                <Link to={`/projects/${project.id}`}>
                  <strong>{project.name}</strong>
                </Link>
                <p>{project.description}</p>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(project.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default ProjectList;
