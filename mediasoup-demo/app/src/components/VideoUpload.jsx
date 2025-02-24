import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, LinearProgress, Grid } from '@mui/material';
import axios from 'axios';

const VideoUpload = () => {
  // Form info state
  const [formDataInfo, setFormDataInfo] = useState({
    roomId: "",
    roomPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataInfo({ ...formDataInfo, [name]: value });
  };

  // Video info state
  const [selectedMovieFile, setSelectedMovieFile] = useState(null);
  const [uploadMovieProgress, setUploadMovieProgress] = useState(0);
  const [isMovieUploading, setIsMovieUploading] = useState(false);

  const [selectedSubFile, setSelectedSubFile] = useState(null);

  const handleVideoChange = (event) => {
    setSelectedMovieFile(event.target.files[0]);
    setUploadMovieProgress(0); // Reset progress when a new file is selected
  };

  const handleSubtitleChange = (event) => {
    setSelectedSubFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedMovieFile) {
      alert('Please select a movie file!');
      return;
    }

    const formData = new FormData();
    formData.append('movieFile', selectedMovieFile);
    formData.append('subtitleFile', selectedSubFile);

    formData.append('roomId', formDataInfo.roomId);
    formData.append('roomPassword', formDataInfo.roomPassword);
    formData.append('movieFileName', selectedMovieFile.name);
    if (selectedSubFile) {
      formData.append('subtitleFileName', selectedSubFile.name);
    }

    setIsMovieUploading(true);

    try {

      const response = await axios.post('https://localhost:8080/file-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadMovieProgress(percentCompleted);
        },
      });
      
      if (response.data.status === 'success') {
        setTimeout(() => {
          window.history.pushState('', '', `/room?roomId=${response.data.room}`)
          window.dispatchEvent(new PopStateEvent("popstate"));
        }, 2000)
      } else {
        alert('error')
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setIsMovieUploading(false);
      setUploadMovieProgress(0); // Reset progress after upload
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create Room
          </Typography>
          {/* <Toaster
          position="bottom-center"
          reverseOrder={false}
        /> */}
          <Box component="form">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Room ID"
                  name="roomId"
                  value={formDataInfo.RoomId}
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
                  value={formDataInfo.roomPassword}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                {/* <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Submit
              </Button> */}
                <Box sx={{ margin: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Upload Video
                  </Typography>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    style={{ display: 'none' }}
                    id="video-upload"
                  />
                  <label htmlFor="video-upload">
                    <Button variant="contained" component="span">
                      Choose Video
                    </Button>
                  </label>
                  {selectedMovieFile && (
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                      Selected File: {selectedMovieFile.name}
                    </Typography>
                  )}

                  <Typography variant="h6" gutterBottom>
                    Upload Subtitle
                  </Typography>
                  <input
                    type="file"
                    accept=".vtt"
                    onChange={handleSubtitleChange}
                    style={{ display: 'none' }}
                    id="subtitle-upload"
                  />
                  <label htmlFor="subtitle-upload">
                    <Button variant="contained" component="span">
                      Choose Subtitles
                    </Button>
                  </label>
                  {selectedSubFile && (
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                      Selected File: {selectedSubFile.name}
                    </Typography>
                  )}

                  {isMovieUploading && (
                    <Box sx={{ marginTop: 2 }}>
                      <LinearProgress variant="determinate" value={uploadMovieProgress} />
                      <Typography variant="body2" sx={{ marginTop: 1 }}>
                        {uploadMovieProgress}% uploaded
                      </Typography>
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={isMovieUploading}
                    sx={{ marginTop: 2 }}
                  >
                    Upload
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

    </>
  );
};

export default VideoUpload;