import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard - Welcome to Team Task Manager</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
export default Dashboard;
