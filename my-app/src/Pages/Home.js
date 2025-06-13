import React from "react";
import Widgets from "./widgets/widgets";
import Sidebar from "./Sidebar/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/Userauthcontext";

const Home = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  // const user={
  //     displayname:"Aditya",
  //     email:"adityanichat89@gmail.com"
  // }
  const handlelogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="app">
      <Sidebar handlelogout={handlelogout} user={user} />
      <Outlet />
      <Widgets />
    </div>
  );
};
export default Home;
