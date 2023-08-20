import React, { useContext, useEffect, useState } from 'react'
import logo from "../Images/fin2.png"
import { IconButton } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useSelector } from 'react-redux';
// import { useDispatch} from "react-redux";
import {motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";
import { API_URL } from './config';



function Users() {

  const { refresh, setRefresh} = useContext(myContext);

  const lightTheme = useSelector((state) => state.themeKey);
  const [users, setUsers] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  // console.log("Data from LocalStorage : ", userData);
  const nav = useNavigate();
  // const dispatch = useDispatch();

  if (!userData) {
    console.log("User not Authenticated");
    nav(-1);
  }

  useEffect(() => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios.get(`${API_URL}/user/fetchUsers`, config).then((data) => {
      console.log("UData refreshed in Users panel ");
      setUsers(data.data);
      // setRefresh(!refresh);
      // dispatch(refreshSidebarFun());
      // console.log(users);
    });
  }, [refresh, userData.data.token]);


  return (
    <div className='usersonline-container'>
      <div className={"usersonline-header" + (lightTheme ? "" : " dark")}>

        <div className='usersonline-hleft'>
          <img src={logo} alt='logo' className='uo-logo'/>
          <p className={"uo-title" + (lightTheme ? "" : " dark")}>
            Available Users
          </p>

        </div>
        <div>

          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <RefreshOutlinedIcon />
          </IconButton>
        </div>

      </div>
      <div className={"sb-search" + (lightTheme ? "" : " dark")}>
        <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
          <SearchOutlinedIcon />
        </IconButton>
        <input
          placeholder="Search"
          className={"searchbox" + (lightTheme ? "" : " dark")}
        />
      </div>
        <div className="uo-list">
          {users.map((user, index) => {
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={"uo-listitem" + (lightTheme ? "" : " dark")}
                key={index}
                onClick={() => {
                  console.log("Creating chat with ", user.name);
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userData.data.token}`,
                    },
                  };
                  axios.post(
                    `${API_URL}/chat/`,
                    {
                      userId: user._id,
                    },
                    config
                  );
                  setRefresh(!refresh);
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark5")}>{user.name[0]}</p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {user.name}
                </p>
              </motion.div>
            );
          })}
        </div>
        
        
      </div>

  )
}

export default Users
