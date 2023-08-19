import React, { useContext, useEffect, useState } from 'react'
import logo from "../Images/fin2.png"
import { IconButton } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";
import { API_URL } from './config';


function Groups() {

  const { refresh, setRefresh } = useContext(myContext);

  const lightTheme = useSelector((state) => state.themeKey);
  const dispatch = useDispatch();
  const [groups, SetGroups] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  // console.log("Data from LocalStorage : ", userData);
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData.data;
  useEffect(() => {
    console.log("Users refreshed : ", user.token);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get(`${API_URL}/chat/fetchGroups`, config)
      .then((response) => {
        console.log("Group Data from API ", response.data);
        SetGroups(response.data);
      });
  }, [refresh]);


    return (
        <div className='usersonline-container'>
          <div className={"usersonline-header" + (lightTheme ? "" : " dark")}>

          <div className='usersonline-hleft'>

              <img src={logo} alt='logo' className='uo-logo'/>

              <p className={"uo-title" + (lightTheme ? "" : " dark")}>
                Available Groups
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
          {groups.map((group, index) => {
            // console.log(group);
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={"uo-listitem" + (lightTheme ? "" : " dark")}
                key={index}
                onClick={() => {
                  console.log("Creating chat with ", group.chatName);
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userData.data.token}`,
                    },
                  };
                  axios.put(
                    `${API_URL}/chat/addSelfToGroup`,
                    {
                      chatId: group._id,
                      userId: userData.data._id,
                    },
                    config
                  );
                  setRefresh(!refresh);
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark5")}>T</p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {group.chatName}
                </p>
              </motion.div>
            );
          })}
            
          </div>
    
        </div>
      )
}

export default Groups
