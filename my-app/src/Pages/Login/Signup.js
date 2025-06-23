import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import twitterimg from "../../assets/twitterimg.png";
import { useUserAuth } from "../../context/Userauthcontext";

const Signup = () => {
  const [username, setusername] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [error, seterror] = useState("");
  const [password, setpassword] = useState("");
  const { Signin } = useUserAuth();
  const { googlesignin } = useUserAuth();
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    try {
      await Signin(email, password);
      const user = {
        username,
        name,
        email,
        password,
      };
      fetch("https://twitter-ot3r.onrender.com/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            console.log(data);
            navigate("/");
          }
        });
    } catch (error) {
      seterror(error.message);
      window.alert(error.message);
    }
  };

  const handlegooglesignin = async (e) => {
    e.preventDefault();
    try {
      await googlesignin();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="image-container">
          <img className="image" height={500} src={twitterimg} alt="twitter" />
        </div>

        <div className="form-container">
          <TwitterIcon className="Twittericon" style={{ color: "skyblue" }} />
          <h2 className="heading">Happening now</h2>
          <h3 className="heading1">Join Twitter today</h3>
          {error && <p className="errorMessage">{error}</p>}
          <form onSubmit={handlesubmit}>
            <input
              type="text"
              placeholder="@username"
              onChange={(e) => setusername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter full name"
              onChange={(e) => setname(e.target.value)}
            />
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setemail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setpassword(e.target.value)}
            />
            <button type="submit" className="btn">
              Sign up
            </button>
          </form>
          <hr />
          <GoogleButton
            className="g-btn"
            type="light"
            onClick={handlegooglesignin}
          />
          <div>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
