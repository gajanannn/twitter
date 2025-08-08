import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserAuth } from "../../context/Userauthcontext";

const LoginHistory = () => {
  const { user } = useUserAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.email) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/loginHistory?email=${user.email}`
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching login history:", error);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <div
      style={{
        width: "80%",
        maxHeight: "400px",
        overflowY: "auto",
        margin: "20px auto",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Login History</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ textAlign: "left", padding: "10px" }}>Email</th>
            <th style={{ textAlign: "left", padding: "10px" }}>Browser</th>
            <th style={{ textAlign: "left", padding: "10px" }}>OS</th>
            <th style={{ textAlign: "left", padding: "10px" }}>Device</th>
            <th style={{ textAlign: "left", padding: "10px" }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>{entry.email}</td>
              <td style={{ padding: "10px" }}>{entry.browser}</td>
              <td style={{ padding: "10px" }}>{entry.os}</td>
              <td style={{ padding: "10px" }}>{entry.device}</td>
              <td style={{ padding: "10px" }}>{entry.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoginHistory;
