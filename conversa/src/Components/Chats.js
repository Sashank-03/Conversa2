import React, { useContext, useEffect } from 'react'
import './allStyles.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../Features/themeSlice';
import axios from "axios";
import { myContext } from "./MainContainer";
import { API_URL } from './config';


function Chats() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const lightTheme = useSelector((state) => state.themeKey);
    // const refresh = useSelector((state) => state.refreshKey);
    const { refresh, setRefresh } = useContext(myContext);
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
        // setRefresh(!refresh);
        });
    }, [refresh]);


  return (

    
    <div className={'sb-chats-phone '+ (lightTheme?"":"dark")}>
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
                        setRefresh(!refresh);
                        }}
                    >
                        <div
                        key={index}
                        className="conversation-container"
                        onClick={() => {
                            navigate("chat/" +conversation._id +"&" +chatName);
                        }}
                        // dispatch change to refresh so as to update chatArea
                        >
                        <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                            {chatName[0]}
                        </p>
                        <p className={"con-title" + (lightTheme ? "" : " dark")}>
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
                        className="conversation-container"
                        onClick={() => {
                        navigate("chat/" +conversation._id +"&" +chatName);
                        }}
                    >
                        <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                        {chatName[0]}
                        </p>
                        <p className={"con-title" + (lightTheme ? "" : " dark")}>
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
  )
}

export default Chats