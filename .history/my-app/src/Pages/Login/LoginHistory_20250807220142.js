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
        maxHeight: "200px",
        overflowY: "auto",
        marginTop: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>
        Login History
      </h3>
      <table style={{ width: "100%", fontSize: "14px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Email</th>
            <th style={{ textAlign: "left" }}>Browser</th>
            <th style={{ textAlign: "left" }}>OS</th>
            <th style={{ textAlign: "left" }}>Device</th>
            <th style={{ textAlign: "left" }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={index}>
              <td>{entry.email}</td>
              <td>{entry.browser}</td>
              <td>{entry.os}</td>
              <td>{entry.device}</td>
              <td>{entry.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoginHistory;
