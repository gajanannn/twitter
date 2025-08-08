import React, { useEffect, useState } from "react";
import "../../Login/Password/popup.css";
import TwitterIcon from "@mui/icons-material/Twitter";

export const NotificationPopup = (props) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <TwitterIcon
          style={{ fontSize: 40, color: "#1DA1F2", marginBottom: 10 }}
        />
        <p className="popup-text">🚀 NEW TWEET POSTED!</p>
        <p className="popup-text">{props.text}</p>
        <div className="popup-buttons">
          <button onClick={props.onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
