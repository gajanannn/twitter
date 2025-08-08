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
    <ul
    // style={{
    //   width: "400px",
    //   height: "300px",
    //   overflowY: "scroll",
    //   border: "1px solid #ccc",
    //   padding: "10px",
    //   marginLeft: "20px",
    //   backgroundColor: "#f9f9f9",
    //   borderRadius: "8px",
    // }}
    >
      {history.map((item, index) => (
        <li key={index}>
          <strong>Email:</strong> {item.email} | <strong>Browser:</strong>{" "}
          {item.browser} | <strong>OS:</strong> {item.os} |{" "}
          <strong>Device:</strong> {item.device} | <strong>Time:</strong>{" "}
          {new Date(item.loginTime).toLocaleString()}
        </li>
      ))}
    </ul>
  );
};

export default LoginHistory;
