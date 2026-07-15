import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/dashboard/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (error) {
      console.error("Network Error: Could not fetch stats");
    }
  };

  if (!stats)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Loading Dashboard...
      </p>
    );

  // Data mapping for the Recharts library
  const chartData = [
    { name: "Completed Tasks", value: stats.completed_tasks, color: "#27ae60" },
    { name: "Pending Tasks", value: stats.pending_tasks, color: "#f39c12" },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <div>
          <Link to="/projects">
            <button
              style={{
                marginRight: "10px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              Manage Projects
            </button>
          </Link>
          <button
            onClick={logout}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p>{stats.total_projects}</p>
        </div>
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{stats.total_tasks}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <p>{stats.completed_tasks}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Tasks</h3>
          <p>{stats.pending_tasks}</p>
        </div>
      </div>

      <div className="chart-container">
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Task Completion Status
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default Dashboard;
