import React, { useEffect, useState } from "react";
import "./popup.css";

const Popup = (props) => {
  const [pass, setpass] = useState(null);

  useEffect(() => {
    setpass(props.password);
  }, [props.password]);

  const copyText = () => {
    navigator.clipboard.writeText(pass);
    alert("Password copied to clipboard!");
    props.onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p className="popup-text">Password: {pass}</p>
        <div className="popup-buttons">
          <button onClick={props.onClose}>Close</button>
          <button onClick={copyText}>📋 Copy</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
