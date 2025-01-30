import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import toast, { Toaster } from 'react-hot-toast';

const JoinRoom = () => {
  const [toastError, setToastError] = useState("")
  const [formData, setFormData] = useState({
    roomId: "",
    roomPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const ApiCall = new Promise(async function (myResolve, myReject) {
        let response;
        let errorMessage = "";
        try {
          response = await fetch(`https://localhost:8080/join-room`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(formData)
          });
        } catch(error) {
          errorMessage = "Server is down! Please try again later."
          myReject(errorMessage)
        }
        
        try {
          const value = await response.json()

          if (value.status === 'success') {
            myResolve()

            setTimeout(() => {
              window.history.pushState('', '', `/room?roomId=${value.room}`)
              window.dispatchEvent(new PopStateEvent("popstate"));
            }, 2000)
          } else {
            errorMessage = "Oops! Room ID or password is incorrect. Please try again. 😔"
            myReject(errorMessage)
          }
        } catch {
          errorMessage = "Oops! Room ID or password is incorrect. Please try again. 😔"
          myReject(errorMessage)
        }
      })

      toast.promise(ApiCall, {
        loading: "Verifying... 🤔",
        success: <b>Whoo! Navigating to room. Grab your popcorn! 🍿</b>,
        error: (errorMsg) => errorMsg || "An unknown error occurred!",
      });

    } catch (error) {
      console.error("Error submitting form:", error);
    }


  };



  return (
    <div>
      <p>Join Room</p>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 300,
          margin: "auto",
          marginTop: 4,
        }}
      >
        <TextField
          label="Room ID"
          name="roomId"
          value={formData.roomId}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Room Password"
          name="roomPassword"
          type="password"
          value={formData.roomPassword}
          onChange={handleChange}
          required
          fullWidth
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </div>
  )
}

export default JoinRoom;
