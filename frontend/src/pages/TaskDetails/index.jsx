import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import "./TaskDetails.css";

const TaskDetails = () => {
  const { taskId } = useParams();
  const { token } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchTask();
    fetchComments();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTask = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) setTask(await res.json());
    } catch (error) {
      console.error("Network error fetching task details");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/comments/?task=${taskId}`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) setComments(await res.json());
    } catch (error) {
      console.error("Network error fetching comments");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/comments/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: taskId, content: newComment }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      alert("Network Error: Could not post comment.");
    }
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className="task-details-container">
      <Link to={`/projects/${task.project}`}>← Back to Project Board</Link>

      <h2>{task.title}</h2>
      <p>
        <strong>Description:</strong> {task.description}
      </p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <p>
        <strong>Priority:</strong> {task.priority}
      </p>
      <p>
        <strong>Assigned To:</strong> {task.assignee_name || "Unassigned"}
      </p>
      <p>
        <strong>Due Date:</strong> {task.due_date}
      </p>

      <div className="comments-section">
        <h3>Comments</h3>

        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <span className="comment-author">{comment.author_name}</span>
            <span className="comment-date">
              {new Date(comment.created_at).toLocaleString()}
            </span>
            <p style={{ marginTop: "10px" }}>{comment.content}</p>
          </div>
        ))}

        <form className="comment-form" onSubmit={handleAddComment}>
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <br />
          <button
            type="submit"
            style={{ padding: "8px 15px", cursor: "pointer" }}
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};
export default TaskDetails;
