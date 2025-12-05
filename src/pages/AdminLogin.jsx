import React, { useState, useEffect } from "react";
import axios from "axios";
import backgroundImage from "../assets/oni/21.jpg"; // your imported image
import { FaArrowLeft } from "react-icons/fa"; // using react-icons for the arrow

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const backendUrl = "http://localhost:5000"; // <---- CHANGE THIS

  const handleLogin = async () => {
    if (!password) return setError("Please enter password!");
    setError("");
    try {
      const res = await axios.post(`${backendUrl}/api/auth/login`, { password });
      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/admin"; // redirect to admin dashboard
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) window.location.href = "/admin";
  }, []);

  const goBack = () => {
    window.location.href = "/"; // redirect to homepage
  };

  return (
    <div style={styles.container}>
      <button onClick={goBack} style={styles.backButton}>
        <FaArrowLeft /> Back to Homepage
      </button>

      <h1 style={styles.title}>Admin Login</h1>

      <input
        type="password"
        placeholder="Enter Admin Password"
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      {error && <p style={styles.error}>{error}</p>}

      <button style={styles.button} onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  title: {
    color: "#fff",
    fontSize: "28px",
    marginBottom: "20px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
  },
  input: {
    width: "260px",
    padding: "12px",
    marginBottom: "12px",
    border: "1px solid #444",
    borderRadius: "10px",
    backgroundColor: "rgba(34, 34, 34, 0.8)",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    width: "260px",
    padding: "12px",
    backgroundColor: "#e91e63",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "18px",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "#ff4d4d",
    marginBottom: "10px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
  },
};
