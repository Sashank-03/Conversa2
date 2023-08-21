import React, { useContext, useEffect, useState } from 'react'
import {IconButton} from "@mui/material"
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SendIcon from '@mui/icons-material/Send';
import MessagesOthers from './MessagesOthers';
import MessagesSelf from './MessagesSelf';
import { useSelector } from 'react-redux';
// import { useDispatch} from "react-redux"
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
// import { io } from "socket.io-client";
import { API_URL } from './config';



// const ENDPOINT= `${API_URL}`;
// var socket, chat;

function ChatArea() {


  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState("");
  // const messagesEndRef = useRef(null);
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  // console.log(chat_id, chat_user);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [conversations, setConversations] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [isGroup, setIsGroup] = useState(false);
  const [allMessagesCopy, setAllMessagesCopy] = useState([]);
  // const [groups, SetGroups] = useState([]);
  const navigate = useNavigate();

  // console.log("Chat area id : ", chat_id._id);
  // const refresh = useSelector((state) => state.refreshKey);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setloaded] = useState(false);
  // const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);

  useEffect(() => {
    // console.log("Sidebar : ", user.token);
    const config = {
    headers: {
        Authorization: `Bearer ${userData.data.token}`,
    },
};

    axios.get(`${API_URL}/chat/`, config).then((response) => {
    console.log("Data refresh in sidebar ", response.data);
    setConversations(response.data);
    // dispatch(refreshSidebarFun(refresh));
    // setRefresh(!refresh);
    });
},[userData.data.token]);

useEffect(()=>{
  setIsGroup(false);
  conversations.map((conversation, index) => {
    console.log(conversation._id);
    console.log(chat_id);
    if (conversation._id==chat_id && conversation.isGroupChat) {
        setIsGroup(true);
    }
  });

}, [refresh, allMessages]);



  const sendMessage = () => {
    var data= null;
    // console.log("SendMessage Fired to", chat_id._id);
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .post(
        `${API_URL}/message/`,
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then(({ response }) => {
        data= response;
        console.log("Message Fired");
      });
      // socket.emit("newMessage", data);

  };
  // console.log(userData.data);
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };
//connect to socket
  // useEffect(() => {
  //   socket =io(ENDPOINT);
  //   socket.emit ("setup", userData); 
  //   socket.on("connection", () => {
  //     setSocketConnectionStatus(!socketConnectionStatus); 
  //   });
  // }, []);

  // useEffect(() => {
  //   socket.on("message recieved", (newMessage) =>{
  //     if (!allMessagesCopy || allMessagesCopy._id !== newMessage._id) {
  //   // setAllMessages ([...allMessages], newMessage);
  //     } else {
  //       setAllMessages([...allMessages], newMessage);
  //     }
  //   });
  // });

  //fetch Chats
  useEffect(() => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .get(`${API_URL}/message/` + chat_id, config)
      .then(({ data }) => {
        setAllMessages(data);
        setloaded(true);
        // console.log("Data from Acess Chat API ", data);
        // socket.emit("join chat", chat_id);
      });
      setAllMessagesCopy(allMessages);
    // scrollToBottom();
  }, [refresh, chat_id, userData.data.token]);

//   console.log(chat_user);


  if (!loaded) {
    return (
      <div className='loading'
        // style={{
        //   // border: "20px",
        //   padding: "0.625rem",
        //   width: "100%",
        //   display: "flex",
        //   flexDirection: "column",
        //   gap: "0.625rem",
        //   flex: 0.7
        // }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "0.625rem" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "0.625rem",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "0.625rem" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className={"chatarea-container" + (lightTheme ? "" : " dark2")}>
        <div className={"chatarea-header" + (lightTheme ? "" : " dark")}>
          <p className={"con-icon" + (lightTheme ? "" : " dark")}>
            {chat_user[0]}
          </p>
          <div className={"header-text" + (lightTheme ? "" : " dark")}>
            <p className={"con-title" + (lightTheme ? "" : " dark")}>
              {chat_user}
            </p>
            {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
              {props.timeStamp}
            </p> */}
          </div>
          {isGroup &&  (<IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <DeleteOutlineOutlinedIcon 
            onClick={() => {
              console.log("Deleting group chat");
              const config = {
                headers: {
                  Authorization: `Bearer ${userData.data.token}`,
                },
              };
              axios.put(
                `${API_URL}/chat/groupExit`,
                {
                  chatId: chat_id,
                  userId: userData.data._id,  
                },
                config
              );
              setRefresh(!refresh);
              navigate("../../app/welcome", {replace: true});
              // window.location.href = `${API_URL}/app/welcome`
            }}
            />
          </IconButton>)}
        </div>
        <div className={"chatarea-messages" + (lightTheme ? "" : " dark")}>
          {allMessages
            .slice(0)
            .reverse()
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              if (sender._id === self_id) {
                // console.log("I sent it ");
                return <MessagesSelf props={message} key={index} />;
              } else {
                // console.log("Someone Sent it");
                return <MessagesOthers props={message} key={index} />;
              }
            })}
        </div>
        {/* <div ref={messagesEndRef} className="BOTTOM" /> */}
        <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
          <input
            placeholder="Type a Message"
            className={"searchbox" + (lightTheme ? "" : " dark")}
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.code == "Enter") {
                // console.log(event);
                sendMessage();
                setMessageContent("");
                setRefresh(!refresh);
              }
            }}
          />
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              sendMessage();
              setRefresh(!refresh);
            }}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );
    }
}

export default ChatArea
