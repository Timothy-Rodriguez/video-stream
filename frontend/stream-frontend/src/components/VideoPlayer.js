import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const VideoPlayer = () => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // State to manage play/pause
  const [seekValue, setSeekValue] = useState(0);
  const videoRef = useRef(null);

  // const handleSeek = (seconds) => {
  //   console.log(`Action: Seek to ${seconds} seconds`);
  // };

  // WEBSOCKET
  const [stompClient, setStompClient] = useState(null);

  const handlePlay = () => {
    console.log("Action: Play");
    if (stompClient) {
      const message = {
        "action":"play",
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
    if (stompClient) {
      const message = {
        "action":"pause",
        "timestamp": playerRef.current.getCurrentTime(),
      };
      stompClient.send("/app/send", {}, JSON.stringify(message));
      // setIsPlaying((prev) => !prev);
    }
  };

  useEffect(() => {
    // Establish WebSocket connection
    const socket = new SockJS("http://localhost:8080/ws");
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
          setIsPlaying(true);
          playerRef.current.seekTo(data.timestamp, "seconds"); // Seek to the specified time
        } else if (data.action == "pause") {
          //setIsPlaying((prev) => !prev);
          setIsPlaying(false);
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
      <ReactPlayer
        ref={playerRef}
        url="http://localhost:8080/video/stream" // Replace with your video URL
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
            tracks: [
              {
                kind: "subtitles",
                src: "/files/subtitles.vtt", // Replace with your WebVTT subtitle file URL
                srcLang: "en",
                label: "English",
                default: true,
              },
            ],
          },
        }}
      />
      <div>
        <input
          type="number"
          value={seekValue}
          onChange={(e) => setSeekValue(Number(e.target.value))}
          placeholder="Enter seek time in seconds"
        />
        <button onClick={handleSeek}>Seek</button>
      </div>
    </div>
  );
};

export default VideoPlayer;
