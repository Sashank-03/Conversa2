import React from "react";
import "./allStyles.css";
import {useSelector } from "react-redux";

function MessagesOthers({ props }) {
  // const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  // console.log("message others : ", props);
  return (
    <div className={"other-message-container" + (lightTheme ? "" : " dark")}>
      <div className={"conversation-container-chat" + (lightTheme ? "" : " dark")}>
        <p className={"con-icon" + (lightTheme ? "" : " dark5")}>
          {props.sender.name[0]}
        </p>
        <div className={"other-text-content" + (lightTheme ? "" : " dark4")}>
          <p className={"con-title-2" + (lightTheme ? "" : " dark4")}>
            {props.sender.name}
          </p>
          <p className={"con-lastMessage" + (lightTheme ? "" : " dark4")}>
            {props.content}
          </p>
          {/* <p className="self-timestamp">12:00am</p> */}
        </div>
      </div>
    </div>
  );
}

export default MessagesOthers;