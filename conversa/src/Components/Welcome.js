import React from 'react'
import logo from "../Images/fin2.png"
// import './allStyles.css'
import { useSelector } from "react-redux";
// import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Welcome() {

  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  } 

  return (
    <div className={"welcome-container" + (lightTheme ? "" : " dark")}>
      <img src={logo} alt='logo' className='welcome-logo'/>
      <b className='welcome-text'>Hi , {userData.data.name} 👋</b>
      <p className='welcome-text'>View and text directly to people present in the chat Rooms.</p>
    </div>
  )
}

export default Welcome
