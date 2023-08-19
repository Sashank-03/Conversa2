import React, { useState } from 'react'
import {IconButton} from "@mui/material"
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
// import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import { useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { create } from "@mui/material/styles/createTransitions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from './config';


function CreateGroups() {

  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  // console.log("Data from LocalStorage : ", userData);
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }
  const user = userData.data;
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log("User Data from CreateGroups : ", userData);
  // console.log(`["${userData.data._id}"]`);
  var users= [];
  users.push(`["${userData.data._id}"]`);

  const createGroup = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    // console.log(userData);
    axios.post(
      `${API_URL}/chat/createGroup`,
      {
        name: groupName,
        users: users,
      },
      config
    );
    nav("/app/groups");
  };

  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you want to create a Group Named " + groupName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will create a create group in which you will be the admin and
              other will be able to join this group.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                createGroup();
                handleClose();
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className={"creategroup-container" + (lightTheme ? "" : " dark")}>
        <input
          placeholder="Enter Group Name"
          className={"searchbox" + (lightTheme ? "" : " dark")}
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
        />
        <IconButton
          className={"icon" + (lightTheme ? "" : " dark")}
          onClick={() => {
            handleClickOpen();
            // createGroup();
          }}
        >
          <DoneOutlineRoundedIcon />
        </IconButton>
      </div>
    </>
  )
}

export default CreateGroups
