import React, { useEffect, useState, useRef, useReducer } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { LogLevel, Peer } from "peerjs";
import "../styles/video.css"
import VideoStream from './VideoStream';

const ACTIONS = {
    addCurrentUser: 'user',
    addPeer: 'peer'
}

const socket = io('http://localhost:3001', {
    // transports: ['websocket'], 
    withCredentials: true
});

const myPeer = new Peer(undefined, {
    host: "/",
    port: '3002'
})

const SocketWebRTC = () => {

    const reducer = (state, action) => {

        switch (action.type) {
            case ACTIONS.addCurrentUser:
                console.log(action.payload.id);
                console.log(action.payload.stream);

                return [...state, {
                    isCurrentUser: true,
                    clientId: action.payload.id,
                    stream: action.payload.stream
                }]
            case ACTIONS.addPeer:
                return [
                    ...state,
                    {
                        isCurrentUser: false,
                        clientId: action.payload.id,
                        stream: action.payload.stream,
                    },
                ];
            default:
                return state;
        }

    }

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [peer, setPeer] = useState(myPeer)
    const [stream, setSteam] = useState(null)
    const [redux, dispatch] = useReducer(reducer, [])

    useEffect(() => {
        setPeer(myPeer)

        myPeer.on('open', id => {
            socket.emit('join-room', window.location.pathname.replace("/", ""), id); // Send message to the server

            try {
                navigator.mediaDevices
                    .getUserMedia({ video: true, audio: true })
                    .then((streamData) => {
                        setSteam(streamData)
                        dispatch({ type: ACTIONS.addCurrentUser, payload: { id: id, stream: streamData } })
                    }
                    )
            } catch (e) {
                console.log(e);
            }

        })


    }, [])

    useEffect(() => {
        console.log("Updated redux state:", redux);
    }, [redux]);

    useEffect(() => {
        if (!peer) return
        if (!stream) return

        socket.on("user-joined", (peerId) => {
            console.log("peer ", peerId);
            console.log(stream);
            
            const call = peer.call(peerId, stream)
            console.log(call);

            call.on("stream", (peerStream) => {
                // call.answer(peerStream)
                console.log("Received peer stream:", peerId, peerStream);
                dispatch({ type: ACTIONS.addPeer, payload: { id: peerId, stream: peerStream } })
            })
        }) 

        peer.on("call", (call) => {
            console.log(call);

            call.answer(stream)
            call.on("stream", (peerStream) => {
                dispatch({ type: ACTIONS.addPeer, payload: { id: call.peer, stream: peerStream } })
            })
        })


    }, [peer, stream])

    // socket.on('user-connected', userId => {
    //     console.log(userId);
    //     const call = myPeer.call(userId);
    //     call.on("stream", (peerStream) => {
    //         console.log("Received peer stream:", userId, peerStream);

    //         dispatch({ type: ACTIONS.addCurrentUser, payload: { id: userId, stream: peerStream } })
    //     })
    //     //connectToNewUser(userId, stream)
    // })


    useEffect(() => {
        console.log("Updated redux state:", redux);
    }, [redux]);

    return (
        <div>
            {/* <VideoStream stream={stream} /> */}
            {redux.map((video, index) => (
                <React.Fragment key={index}>
                    <p>{video.clientId}</p>
                    <VideoStream stream={video.stream} />
                </React.Fragment>
            ))}

            <div id="video-grid">
                {/* <video ref={localVideoRef} autoPlay playsInline muted></video> */}

                {/* {stream ? (
            <VideoStream stream={stream} />
        ) : (
            <p>Loading stream...</p>
        )} */}
            </div>
        </div>
    )
}

export default SocketWebRTC;