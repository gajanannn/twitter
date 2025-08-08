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
  }, [user?.email]); // run when user email changes

  return (
    <ul style={{ padding: "1rem" }}>
      {history.length === 0 ? (
        <li>No login history found.</li>
      ) : (
        history.map((item, index) => (
          <li key={index}>
            <strong>{item.email}</strong> — {item.ip} —{" "}
            {new Date(item.loginTime).toLocaleString()}
          </li>
        ))
      )}
    </ul>
  );
};

export default LoginHistory;
