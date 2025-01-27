import React, { useEffect, useState, useRef } from "react";

const VideoStream = ({stream}) => {
    console.log(stream);
    
    const videoRef = useRef(null)

    useEffect(() => {        
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream])

    return (
        <div>
            <video ref={videoRef} autoPlay muted></video>
        </div>
    )
}

export default VideoStream