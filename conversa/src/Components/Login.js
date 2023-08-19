import React, { useState } from "react";
import logo from "../Images/fin2.png";
import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from './config';
import Toaster from "./Toaster";

function Login() {
  const [showlogin, setShowLogin] = useState(false);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [logInStatus, setLogInStatus] = React.useState(null);
  const [signInStatus, setSignInStatus] = React.useState(null);

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    setLoading(true);
    console.log(data);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        `${API_URL}/user/login/`,
        data,
        config
      );
      console.log("Login : ", response);
      setLogInStatus({ msg: "Success", key: Math.random() });
      setLoading(false);
      localStorage.setItem("userData", JSON.stringify(response));
      navigate("/app/welcome");
    } catch (error) {
      setLogInStatus({
        msg: "Invalid User name or Password",
        key: Math.random(),
      });
    }
    setLoading(false);
  };

  const signUpHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        `${API_URL}/user/register/`,
        data,
        config
      );
      console.log(response);
      setSignInStatus({ msg: "Success", key: Math.random() });
      navigate("/app/welcome");
      localStorage.setItem("userData", JSON.stringify(response));
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response.status === 405) {
        setSignInStatus({
          msg: "User with this email ID already Exists",
          key: Math.random(),
        });
      }
      if (error.response.status === 406) {
        setSignInStatus({
          msg: "User Name already Taken, Please take another one",
          key: Math.random(),
        });
      }
      console.log(signInStatus);
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="login-container">
        <div className="login-image">
          <img src={logo} alt="Logo" className="welcome-logo" />
          <h1 className="login-title">Conversa</h1>
        </div>
        {showlogin && (
          <div className="login-form">
            <p className="login-heading">Login to your Account</p>
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter User Name"
              variant="outlined"
              // color="secondary"
              name="name"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  // console.log(event);
                  loginHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              // color="secondary"
              name="password"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  // console.log(event);
                  loginHandler();
                }
              }}
            />
            <Button
              variant="contained"
              // color="secondary"
              onClick={loginHandler}
              isLoading
            >
              Login
            </Button>
            <p className="login-footer">
              Don't have an Account ?{" "}
              <span
                className="hyper"
                onClick={() => {
                  setShowLogin(false);
                  setLogInStatus(null); // Reset the logInStatus when switching to sign-up form
                  setSignInStatus(null); // Reset the logInStatus when switching to sign-up form

                }}
              >
                Sign Up
              </span>
            </p>
            {logInStatus ? (
              <Toaster key={logInStatus.key} message={logInStatus.msg} />
            ) : null}
          </div>
        )}
        {!showlogin && (
          <div className="login-form">
            <p className="login-heading">Create your Account</p>
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter User Name"
              variant="outlined"
              // color="secondary"
              name="name"
              helperText=""
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  // console.log(event);
                  signUpHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter Email Address"
              variant="outlined"
              // color="secondary"
              name="email"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  // console.log(event);
                  signUpHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              // color="secondary"
              name="password"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  // console.log(event);
                  signUpHandler();
                }
              }}
            />
            <Button
              // variant="outlined"
              variant="contained"
              // color="secondary"
              onClick={signUpHandler}
            >
              Sign Up
            </Button>
            <p className="login-footer">
              Already have an Account ?
              <span
                className="hyper"
                onClick={() => {
                  setShowLogin(true);
                  setSignInStatus(null); // Reset the signInStatus when switching to login form
                  setLogInStatus(null); // Reset the signInStatus when switching to login form

                }}
              >
                Log in
              </span>
            </p>
            {signInStatus ? (
              <Toaster key={signInStatus.key} message={signInStatus.msg} />
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}

export default Login;