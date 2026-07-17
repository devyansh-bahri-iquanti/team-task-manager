import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);

  if (!token) return null; // Don't show the navbar on the Login/Register screens

  return (
    <nav className="navbar">
      <h2>Team Task Manager</h2>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
