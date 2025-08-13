import React, { useState, useContext } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useNavigate, Link } from "react-router-dom";
import twitterimg from "../../assets/twitterimg.png";
import "./Login.css";
import { useUserAuth } from "../../context/Userauthcontext";
import { auth } from "../../context/firebase";
import Popup from "./Password/Popup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const { googleSignIn, login, resetPassword, user } = useUserAuth();
  const [popup, setpopup] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otpResolve, setOtpResolve] = useState(null);

  const generatePassword = () => {
    let password = "";
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const random = 10 + Math.floor(Math.random() * 11); // random length from 10 to 20
    const randomChar = () => Math.floor(52 * Math.random());

    for (let i = 0; i < random; i++) {
      password += letters[randomChar()];
    }

    setGeneratedPassword(password);
    setpopup(true);
  };

  const sendOtp = async (targetEmail) => {
    if (!targetEmail || !targetEmail.includes("@")) {
      alert("Invalid email address. Please enter a valid email.");
      return false;
    }

    try {
      const response = await fetch(
        "https://twitter-ot3r.onrender.com/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: targetEmail }),
        }
      );

      const data = await response.json();
      console.log("OTP response:", data);

      if (data.success) {
        alert("OTP sent to your email.");
        return true;
      } else {
        alert("Failed to send OTP: " + data.message);
        return false;
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP.");
      return false;
    }
  };

  const getUserInfo = () => {
    const userAgent = navigator.userAgent;
    let browser = "unknown";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      browser = "Chrome";
    } else if (userAgent.includes("Edg")) {
      browser = "Microsoft Edge";
    } else if (userAgent.includes("Firefox")) {
      browser = "Firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browser = "Safari";
    }
    let os = "Unknown";
    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac")) os = "macOS";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
      os = "iOS";
    let device = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";
    return { browser, os, device };
  };

  const handlereset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://twitter-ot3r.onrender.com/canreset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.allowed) {
        await resetPassword(email);
        alert("Reset link sent to your email.");
      } else {
        alert(data.message || "You've reached today's reset limit.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const getOtpFromDialog = () => {
    return new Promise((resolve) => {
      setOtp("");
      setOtpResolve(() => resolve);
      setOpenOtpDialog(true);
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    const { browser, os, device } = getUserInfo();
    if (device === "Mobile") {
      const now = new Date();
      const hour = now.getHours();

      if (hour < 10 || hour >= 13) {
        alert("Mobile access is only allowed between 10 AM and 1 PM.");
        return;
      }
    }

    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      const ip = ipData.ip;
      if (browser === "Chrome") {
        const otpSent = await sendOtp(email);
        if (!otpSent) return;

        const userOtp = await getOtpFromDialog();
        if (!userOtp) return alert("OTP required");

        const verifyRes = await fetch(
          "https://twitter-ot3r.onrender.com/verify-otp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp: userOtp }),
          }
        );

        const verifyData = await verifyRes.json();
        if (!verifyData.success) return alert("Invalid or expired OTP");

        alert("OTP Verified Successfully");
      }

      await login(email, password);
      await fetch("https://twitter-ot3r.onrender.com/loginHistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          browser,
          os,
          device,
          ip,
        }),
      });

      navigate("/");
      // ...rest of the code
    } catch (error) {
      seterror(error.message);
      alert(error.message);
    }
  };

  const hanglegooglesignin = async (e) => {
    e.preventDefault();
    const { browser, os, device } = getUserInfo();
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    const ip = ipData.ip;
    if (device === "Mobile") {
      const now = new Date();
      const hour = now.getHours();

      if (hour < 10 || hour >= 13) {
        alert("Mobile access is only allowed between 10 AM and 1 PM.");
        return;
      }
    }

    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      const ip = ipData.ip;
      await googleSignIn();
      const loggedInEmail = auth.currentUser?.email;

      await fetch("https://twitter-ot3r.onrender.com/loginHistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loggedInEmail,
          browser,
          os,
          device,
          ip,
        }),
      });

      navigate("/");
    } catch (error) {
      console.log("Google sign-in failed:", error.message);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="image-container">
          <img src={twitterimg} className=" image" alt="twitterimg" />
        </div>
        <div className="form-container">
          <div className="form-box">
            <TwitterIcon style={{ color: "skyblue" }} />
            <h2 className="heading">Happening now</h2>
            {error && <p>{error.message}</p>}
            <form onSubmit={handlesubmit}>
              <input
                type="email"
                className="email"
                placeholder="Email address"
                onChange={(e) => setemail(e.target.value)}
              />
              <input
                type="password"
                className="password"
                placeholder="Password"
                onChange={(e) => setpassword(e.target.value)}
              />
              {/* ✅ Generate Password Button */}
              <div className="btn-login">
                <button
                  type="button"
                  onClick={generatePassword}
                  className="btn"
                >
                  Generate password
                </button>
              </div>
              {popup && (
                <Popup
                  password={generatedPassword}
                  onClose={() => setpopup(false)}
                />
              )}

              <div className="btn-login">
                <button type="submit" className="btn">
                  Log In
                </button>
              </div>
              <div className="btn-login">
                <button onClick={handlereset} className="btn" disabled={!email}>
                  Reset Password
                </button>
              </div>
            </form>
            <hr />
            <div>
              <GoogleButton
                className="g-btn"
                type="light"
                onClick={hanglegooglesignin}
              />
            </div>
          </div>
          <div>
            Don't have an account
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <Dialog open={openOtpDialog} onClose={() => setOpenOtpDialog(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="OTP"
            type="text"
            fullWidth
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenOtpDialog(false);
              if (otpResolve) otpResolve(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenOtpDialog(false);
              if (otpResolve) otpResolve(otp);
            }}
            variant="contained"
            color="primary"
          >
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
