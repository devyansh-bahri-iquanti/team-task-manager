import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Dashboard - Welcome to Team Task Manager
      </h1>
      <Link to="/projects">
        <button>Manage Projects</button>
      </Link>
      <br />
      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
};
export default Dashboard;
