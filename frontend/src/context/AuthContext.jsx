import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check localStorage on first load
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  // Function to log in
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/"); // Go to Dashboard after login
  };

  // Function to log out
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
