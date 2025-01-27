// import React, { useEffect, useState, useRef } from 'react';
// import { io } from 'socket.io-client';
// import { v4 as uuidv4 } from 'uuid';
// import { Peer } from "peerjs";
// import "../styles/video.css"

// const socket = io('http://localhost:3001', {
//   // transports: ['websocket'], 
//   withCredentials: true
// });

// const myPeer = new Peer(undefined, {
//     host: "/",
//     port: '3002'
// })

// const SocketWebRTC = () => {
//     const localVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);

//     // navigator.mediaDevices.getUserMedia(
//     //     { video: true, audio: true },
//     //     (stream) => {
//     //         const call = peer.call("another-peers-id", stream);
//     //         call.on("stream", (remoteStream) => {
//     //             // Show stream in some <video> element.
//     //         });
//     //     },
//     //     (err) => {
//     //         console.error("Failed to get local stream", err);
//     //     },
//     // );


//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         // Display the local stream
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }

//         socket.on("user-connected", userId => {
//             connectToNewUser(userId, stream)
//         })
//       }
//     )

//     const connectToNewUser = (userId, stream) => {
//         const call = myPeer.call(userId, stream)

//         call.on('stream', userVideoStream => {
//             // chatgpt code here
//         })
//     }

//     myPeer.on('open', id => {
//         socket.emit('join-room', window.location.pathname.replace("/", ""), id); // Send message to the server
//     })

    
        
//     socket.on('user-connected', userId => {
//         console.log('User connected ', userId)
//     })



//     return(
//         <div>
//             <div id="video-grid">
//                 <video ref={localVideoRef} autoPlay playsInline muted></video>
//             </div>
//         </div>
//     )
// }

// export default SocketWebRTC;