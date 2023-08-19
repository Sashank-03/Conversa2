import React, { useContext, useEffect, useRef } from 'react'
import './allStyles.css'
import { useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import {IconButton} from "@mui/material"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../Features/themeSlice';
import axios from "axios";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { myContext } from "./MainContainer";
import { API_URL } from './config';



function Sidebar() {

    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const lightTheme = useSelector((state) => state.themeKey);
    // const refresh = useSelector((state) => state.refreshKey);
    const { refresh} = useContext(myContext);
    console.log("Context API : refresh : ", refresh);
    const [conversations, setConversations] = useState([]);
    // console.log("Conversations of Sidebar : ", conversations);
    const userData = JSON.parse(localStorage.getItem("userData"));
    // console.log("Data from LocalStorage : ", userData);
    const nav = useNavigate();
    if (!userData) {
        console.log("User not Authenticated");
        nav("/");
    }

    const [refreshToggle, setRefreshToggle] = useState(false);
    const user = userData.data;
    useEffect(() => {
        // console.log("Sidebar : ", user.token);
        const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

        axios.get(`${API_URL}/chat/`, config).then((response) => {
        console.log("Data refresh in sidebar ", response.data);
        setConversations(response.data);
        setRefreshToggle(false);
        // dispatch(refreshSidebarFun(refresh));
        // setRefresh(!refresh);
        });
    },[refreshToggle]);

    useEffect(() => {
        // Trigger the refresh by toggling refreshToggle
        setRefreshToggle(true);
    }, [refresh]);
    



  return (
    <div className='sidebar-container'>
      <div className={'sb-header '+ (lightTheme?"":"dark")}>
        <div className='icons1'>
            <IconButton onClick={() => {
                nav("/app/welcome");
                }}
            >
                <AccountCircleOutlinedIcon className={'icon '+ (lightTheme?"":"dark")}/>
            </IconButton>
            <IconButton onClick={() => {
                nav("/app");
                }} className='sb-header-chaticon'
                // style={{ display: 'none' }}
            >
                <ChatOutlinedIcon className={'icon '+ (lightTheme?"":"dark")}/>
            </IconButton>

        </div>
        <div className='icons2'>
            <IconButton onClick={()=>navigate('/app/users-online')}>
                <PersonAddAlt1OutlinedIcon className={'icon '+ (lightTheme?"":"dark")}/>
            </IconButton>
            <IconButton onClick={()=>navigate('/app/groups')}>
                <GroupAddOutlinedIcon className={'icon '+ (lightTheme?"":"dark")}/>
            </IconButton>
            <IconButton onClick={()=>navigate('/app/create-group')}>
                <AddCircleOutlineOutlinedIcon className={'icon '+ (lightTheme?"":"dark")}/>
            </IconButton>
            <IconButton onClick={()=>{dispatch(toggleTheme())}}>
                {lightTheme && <DarkModeOutlinedIcon/>}
                {!lightTheme && <LightModeOutlinedIcon className={'icon '+ (lightTheme?"":"dark")}/>}
            </IconButton>
        </div>
            <IconButton onClick={() => {
                localStorage.removeItem("userData");
                navigate("/");
                }}
            >
                <LogoutOutlinedIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
      </div>

      <div className={'sb-search '+ (lightTheme?"":"dark")}>
        <IconButton>
            <SearchOutlinedIcon className={(lightTheme?"":"dark")}/>
        </IconButton>
        <input placeholder='Search' className={'searchbox '+ (lightTheme?"":"dark")}/>
      </div>
      <div className={'sb-chats '+ (lightTheme?"":"dark")}>
        {conversations.map((conversation, index) => {
            // console.log("current convo : ", conversation);
            var chatName="";
            if (conversation.isGroupChat) {
                // console.log("grou[p chat");
                chatName= conversation.chatName;
                
            }
            else{
                conversation.users.map((user) =>{
                    if(user._id!= userData.data._id){
                        chatName= user.name;
                    }
                });
            }
            // if(conversation.users.length==2){

                if (conversation.latestMessage === undefined) {
                    // console.log("No Latest Message with ", conversation.users[1]);
                    return (
                    <div
                        key={index}
                        // key={conversation._id}
                        onClick={() => {
                        console.log("Refresh fired from sidebar");
                        // dispatch(refreshSidebarFun());
                        // setRefresh(!refresh);
                    }}
                    >
                        <div
                        key={index}
                        className={(lightTheme?"":"dark1 ")+ 'conversation-container '}
                        onClick={() => {
                            navigate("chat/" +conversation._id +"&" +chatName);
                        }}
                        // dispatch change to refresh so as to update chatArea
                        >
                        <p className={"con-icon" + (lightTheme ? "" : " dark5")}>
                            {chatName[0]}
                        </p>
                        <p className={"con-title" + (lightTheme ? "" : " dark-text")}>
                            {chatName}
                        </p>
    
                        <p className="con-lastmessage">
                            No previous Messages, click here to start a new chat
                        </p>
                        {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                        {conversation.timeStamp}
                    </p> */}
                        </div>
                    </div>
                    );
                } else {
                    return (
                        <div
                        key={index}
                        className={(lightTheme?"":"dark1 ")+ 'conversation-container '}
                        onClick={() => {
                            navigate("chat/" +conversation._id +"&" +chatName);
                        // setRefresh(!refresh);
                        // dispatch(refreshSidebarFun());
                        }}
                    >
                        <p className={"con-icon" + (lightTheme ? "" : " dark5")}>
                        {chatName[0]}
                        </p>
                        <p className={"con-title" + (lightTheme ? "" : " dark-text")}>
                        {chatName}
                        </p>
    
                        <p className="con-lastmessage">
                        {conversation.latestMessage.content}
                        </p>
                        {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                        {conversation.timeStamp}
                    </p> */}
                    </div>
                    );
                // }
            }
            })}
      </div>
    </div>
  )
}

export default Sidebar
