import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProjectForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // We add 'try' so if anything crashes, it skips to the 'catch' block at the bottom
    try {
      const response = await fetch("http://127.0.0.1:8000/api/projects/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        navigate("/projects");
      } else {
        // If Django sends a 400 or 500 error, we handle it here
        const errorText = await response.text(); // Read as text first just in case it's HTML!
        console.log("Django Error:", errorText);
        alert("Backend Error: " + errorText);
      }
    } catch (error) {
      // If the server is offline or React crashes, this catches it!
      console.error("React Crash:", error);
      alert(
        "Network Error: Is your Django server running? (" + error.message + ")",
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};
export default ProjectForm;
