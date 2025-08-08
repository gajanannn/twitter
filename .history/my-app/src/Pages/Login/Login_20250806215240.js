import React, { useState, useContext } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useNavigate, Link } from "react-router-dom";
import twitterimg from "../../assets/twitterimg.png";
import "./Login.css";
import { useUserAuth } from "../../context/Userauthcontext";
import { auth } from "../../context/firebase";
import emailjs from "emailjs-com";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const { googleSignIn, login, resetPassword, user } = useUserAuth();
  const [generatedOtp, setGeneratedOtp] = useState("");
  let tempOtp = ""; // declare outside function if needed

  const sendOtp = async (targetEmail) => {
    if (!targetEmail || !targetEmail.includes("@")) {
      alert("Invalid email address. Please enter a valid email.");
      return false;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    tempOtp = otp; // ✅ use temporary variable
    setGeneratedOtp(otp); // still store in state for reference (optional)

    const templateParams = {
      user_email: targetEmail,
      otp_code: otp,
    };

    try {
      await emailjs.send(
        "service_ftaj888",
        "template_c7lczb9",
        templateParams,
        "eRifIZewRQGvKWqvr"
      );
      alert("OTP sent to your email.");
      return true;
    } catch (error) {
      alert("Failed to send OTP");
      console.log("EmailJS Error Details:", error?.text || error);
      return false;
    }
  };

  const verifyOtp = (userOtp) => {
    return userOtp === generatedOtp;
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
      const res = await fetch("http://localhost:5000/canreset", {
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

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    const { browser, os, device } = getUserInfo();

    try {
      if (browser === "Chrome") {
        const otpSent = await sendOtp(email);
        if (!otpSent) return;

        const userOtp = prompt("Enter the OTP sent to your email:");
        if (!userOtp) return alert("OTP required");

        if (userOtp !== tempOtp) return alert("Invalid OTP"); // ✅ compare with tempOtp

        alert("OTP Verified Successfully");
      }

      await login(email, password);
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

    try {
      // Step 1: Sign in and get email
      await googleSignIn();
      const loggedInEmail = auth.currentUser?.email;
      if (!loggedInEmail) return alert("Google login failed: no email");

      // Step 2: Immediately sign out to block access
      await auth.signOut();

      // Step 3: OTP verification for Chrome
      if (browser === "Chrome") {
        await sendOtp(loggedInEmail);

        const userOtp = prompt("Enter the OTP sent to your email:");
        if (!userOtp) return alert("OTP required");
        if (!verifyOtp(userOtp)) return alert("Invalid OTP");

        alert("OTP Verified Successfully");
      }

      // Step 4: Sign in again after successful OTP
      await googleSignIn();
      const finalEmail = auth.currentUser?.email;

      await fetch("http://localhost:5000/loginHistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: finalEmail,
          browser,
          os,
          device,
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
    </>
  );
};

export default Login;
