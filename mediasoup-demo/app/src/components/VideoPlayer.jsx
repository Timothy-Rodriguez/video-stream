import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const VideoPlayer = (props) => {

  const playerRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false); // State to manage play/pause
  const [seekValue, setSeekValue] = useState(0);
  const videoRef = useRef(null);

  const getVideo = async () => {
    let params = new URLSearchParams(document.location.search);
    let UUID = params.get("roomId"); // is the string "Jonathan"

    // Get video source
    const response = await axios.get(`https://localhost:8080/room?roomId=${UUID}`)

    try {
      const videoResponse = await axios.get(response.data, {
        headers: {
          Range: 'bytes=0-0' // Request only the first byte
        }
      });
      console.log(videoResponse);
      
      if (videoResponse.status === 206) {
        setVideoUrl(response.data)
      }
    } catch (error) {
      if (error.status === 404) {
        toast.error("Video not found! Please create a valid Room.")
        setTimeout(() => {
          window.history.pushState('', '', `/create-room`)
          window.dispatchEvent(new PopStateEvent("popstate"));
        }, 5000)
      } else {
        console.log(error);
        
        toast.error("Something went wrong! Please create a valid Room.")
        setTimeout(() => {
          window.history.pushState('', '', `/create-room`)
          window.dispatchEvent(new PopStateEvent("popstate"));
        }, 5000)
      }

    }



  }

  useEffect(() => {
    getVideo()
  }, [])
  // const handleSeek = (seconds) => {
  //   console.log(`Action: Seek to ${seconds} seconds`);
  // };

  // WEBSOCKET
  const [stompClient, setStompClient] = useState(null);

  const handlePlay = () => {
    console.log("Action: Play");
    if (stompClient && !document.hidden) {
      const message = {
        "action": "play",
        "timestamp": playerRef.current.getCurrentTime(),
      };
      stompClient.send("/app/send", {}, JSON.stringify(message));
      // setIsPlaying((prev) => !prev);
    }
  };

  const handleSeek = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(seekValue, "seconds"); // Seek to the specified time
    }
  };

  const handlePause = () => {
    console.log("Action: Pause");
    if (stompClient && !document.hidden) {
      const message = {
        "action": "pause",
        "timestamp": playerRef.current.getCurrentTime(),
      };
      stompClient.send("/app/send", {}, JSON.stringify(message));
      // setIsPlaying((prev) => !prev);
    }
  };

  useEffect(() => {
    // Establish WebSocket connection
    const socket = new SockJS("https://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("Connected to WebSocket");

      // Subscribe to the sync topic
      // client.subscribe("/topic/sync", (message) => {
      //   const { action, timestamp } = JSON.parse(message.body);

      //   // Handle received actions
      //   if (videoRef.current) {
      //     if (action === "play") {
      //       videoRef.current.currentTime = timestamp;
      //       videoRef.current.play();
      //     } else if (action === "pause") {
      //       videoRef.current.pause();
      //     } else if (action === "seek") {
      //       videoRef.current.currentTime = timestamp;
      //     }
      //   }
      // });

      client.subscribe("/topic/messages", (message) => {

        const data = JSON.parse(message.body)
        console.log("SUB::", data);
        console.log(message.body);
        console.log(data.timestamp);

        if (data.action == "play") {
          //setIsPlaying(true);
          const internalPlayer = playerRef.current.getInternalPlayer();
          // if (internalPlayer && internalPlayer.pause) {
          //   internalPlayer.play(); // Trigger pause
          // }


          if (internalPlayer && internalPlayer.play) {
            internalPlayer.play().catch((error) => {
              if (error.name === "NotAllowedError" || error.name === "AbortError") {
                alert(
                  "Playback was interrupted. This might be due to background media restrictions or autoplay policies. Please bring the tab into focus."
                );
                console.error("Playback error:", error);
              } else if (internalPlayer && internalPlayer.pause) {
                internalPlayer.play(); // Trigger pause
              }
            });
          }


          playerRef.current.seekTo(data.timestamp, "seconds"); // Seek to the specified time
        } else if (data.action == "pause") {
          //setIsPlaying((prev) => !prev);
          //setIsPlaying(false);
          const internalPlayer = playerRef.current.getInternalPlayer();
          // if (internalPlayer && internalPlayer.pause) {
          //   internalPlayer.pause(); // Trigger pause
          // }

          if (internalPlayer && internalPlayer.pause) {
            internalPlayer.pause().catch((error) => {
              if (error.name === "NotAllowedError" || error.name === "AbortError") {
                alert(
                  "Playback was interrupted. This might be due to background media restrictions or autoplay policies. Please bring the tab into focus."
                );
                console.error("Playback error:", error);
              } else if (internalPlayer && internalPlayer.play) {
                internalPlayer.pause(); // Trigger pause
              }
            });
          }

          playerRef.current.seekTo(data.timestamp, "seconds"); // Seek to the specified time
        }



      });
    });

    setStompClient(client);

    console.log(stompClient);

    // Cleanup on component unmount
    return () => {
      if (client) {
        client.disconnect(() => console.log("Disconnected from WebSocket"));
      }
    };
  }, []);

  const handleAction = (action) => {
    if (stompClient && videoRef.current) {
      const message = {
        action,
        timestamp: videoRef.current.currentTime,
      };
      // stompClient.send("/app/send", {}, JSON.stringify(message));
      console.log(action);
      stompClient.send("/app/send", {}, action);
    }
  };

  return (
    <div>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <ReactPlayer
        ref={playerRef}
        //url="http://localhost:8080/video/stream" // Replace with your video URL
        url={videoUrl}
        controls
        width="70%"
        height="70%"
        // onPlay={handlePlay}
        // onPause={handlePause}
        // onProgress={handleProgress}

        playing={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={handleAction}

        config={{
          file: {
            // attributes: {
            //   crossOrigin: "anonymous", // Required for loading external subtitle files
            // },
            // tracks: [
            //   {
            //     kind: "subtitles",
            //     src: "/i.want.to.eat.your.pancreas.2018.720p.bluray.x264.yts.mx-english.vtt", // Replace with your WebVTT subtitle file URL
            //     srcLang: "en",
            //     label: "English",
            //     default: true,
            //   },
            // ],
          },
        }}
      />
      {/* <div>
        <input
          type="number"
          value={seekValue}
          onChange={(e) => setSeekValue(Number(e.target.value))}
          placeholder="Enter seek time in seconds"
        />
        <button onClick={handleSeek}>Seek</button>
      </div> */}
    </div>
  );
};

export default VideoPlayer;
