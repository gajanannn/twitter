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
    <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px" }}>
      <h3 style={{ marginBottom: "10px" }}>Login History</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Browser</th>
            <th>OS</th>
            <th>Device</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {loginData.map((entry, index) => (
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
