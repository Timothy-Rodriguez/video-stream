import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import toast, { Toaster } from 'react-hot-toast';

const CreateRoom = () => {
  const [formData, setFormData] = useState({
    roomId: "",
    roomPassword: "",
    movieFileName: "",
    subtitleFileName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ApiCall = new Promise(async function (myResolve, myReject) {
        let response;
        let errorMessage = "";
        try {
          response = await fetch(`https://localhost:8080/create-room`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(formData)
          });
        } catch (error) {
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
            errorMessage = value.reason
            myReject(errorMessage)
          }
        } catch (error) {
          errorMessage = "Oops! Something went wrong. Please try again."
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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Room
        </Typography>
        <Toaster
          position="bottom-center"
          reverseOrder={false}
        />
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Room ID"
                name="roomId"
                value={formData.RoomId}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Room Password"
                name="roomPassword"
                type="password"
                value={formData.roomPassword}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Movie File Name"
                name="movieFileName"
                value={formData.movieFileName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Subtitle File Name"
                name="subtitleFileName"
                value={formData.subtitleFileName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateRoom;