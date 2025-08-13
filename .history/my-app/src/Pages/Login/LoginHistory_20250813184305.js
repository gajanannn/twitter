import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserAuth } from "../../context/Userauthcontext";
import { useTranslation } from "react-i18next";

const LoginHistory = () => {
  const { user } = useUserAuth();
  const [history, setHistory] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.email) return;
      try {
        const response = await axios.get(
          `https://twitter-ot3r.onrender.com/loginHistory?email=${user.email}`
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching login history:", error);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ marginBottom: "20px" }}>{t("login_history")}</h2>

      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "800px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ textAlign: "left", padding: "6px 8px" }}>Email</th>
              <th style={{ textAlign: "left", padding: "6px 8px" }}>Browser</th>
              <th style={{ textAlign: "left", padding: "6px 8px" }}>OS</th>
              <th style={{ textAlign: "left", padding: "6px 8px" }}>Device</th>
              <th style={{ textAlign: "left", padding: "6px 8px" }}>
                IP Address
              </th>
              <th style={{ textAlign: "left", padding: "6px 8px" }}>Date</th>
              <th style={{ textAlign: "left", padding: "6px 8px" }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "6px 8px" }}>{entry.email}</td>
                <td style={{ padding: "6px 8px" }}>{entry.browser}</td>
                <td style={{ padding: "6px 8px" }}>{entry.os}</td>
                <td style={{ padding: "6px 8px" }}>{entry.device}</td>
                <td style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>
                  {new Date(entry.loginTime).toLocaleDateString()}
                </td>
                <td style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>
                  {new Date(entry.loginTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginHistory;
