import React, { useContext, useEffect, useState } from 'react'
import {IconButton} from "@mui/material"
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SendIcon from '@mui/icons-material/Send';
import MessagesOthers from './MessagesOthers';
import MessagesSelf from './MessagesSelf';
import { useSelector } from 'react-redux';
// import { useDispatch} from "react-redux";
import { useParams } from "react-router-dom";
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
  const [allMessages, setAllMessages] = useState([]);
  const [allMessagesCopy, setAllMessagesCopy] = useState([]);
  // console.log("Chat area id : ", chat_id._id);
  // const refresh = useSelector((state) => state.refreshKey);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setloaded] = useState(false);
  // const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);



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
  }, [refresh, chat_id]);

//   console.log(chat_user);


  if (!loaded) {
    return (
      <div
        style={{
        //   border: "20px",
          padding: "0.625rem",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "0.625rem",
          // flex: 0.7
        }}
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
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
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
