// src/components/LoginHistory.js
import React, { useState } from "react";
import axios from "axios";
import { useUserAuth } from "../../context/Userauthcontext";

const LoginHistory = () => {
  const { user } = useUserAuth();
  const [history, setHistory] = useState([]);

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

  return (
    <ul>
      {history.map((item, index) => (
        <li key={index}>
          <strong>{item.email}</strong> — {item.ip} —{" "}
          {new Date(item.loginTime).toLocaleString()}
        </li>
      ))}
    </ul>
  );
};

export default LoginHistory;
