import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';

const Test = () => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [isCallStarted, setIsCallStarted] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    // Initialize PeerJS
    const peer = new Peer(undefined, {
        host: "/",
        port: '3002'
    })
    
    peer.on('open', (id) => {
      setPeerId(id); // Get the unique ID assigned by PeerJS
      console.log(`My peer ID is: ${id}`);
    });

    // Answer incoming call
    peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          // Stop any existing tracks before assigning a new stream
          if (localVideoRef.current.srcObject) {
            const tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          }

          // Assign the stream and play the video
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.onloadedmetadata = () => {
            localVideoRef.current.play().catch((error) => {
              console.error('Error playing the local video:', error);
            });
          };

          // Answer the call with the local stream
          call.answer(stream);

          // Handle the remote stream
          call.on('stream', (remoteStream) => {
            // Stop existing tracks for the remote video
            if (remoteVideoRef.current.srcObject) {
              const tracks = remoteVideoRef.current.srcObject.getTracks();
              tracks.forEach((track) => track.stop());
            }

            // Assign the remote stream and play the video
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.onloadedmetadata = () => {
              remoteVideoRef.current.play().catch((error) => {
                console.error('Error playing the remote video:', error);
              });
            };
          });
        })
        .catch((err) => console.error('Error accessing media devices.', err));
    });

    peerInstance.current = peer;

    return () => {
      peer.destroy(); // Clean up on component unmount
    };
  }, []);

  const startCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Stop any existing tracks before assigning a new stream
        if (localVideoRef.current.srcObject) {
          const tracks = localVideoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }

        // Assign the stream and play the video
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.onloadedmetadata = () => {
          localVideoRef.current.play().catch((error) => {
            console.error('Error playing the local video:', error);
          });
        };

        // Start the call to the remote peer
        const call = peerInstance.current.call(remotePeerId, stream);
        call.on('stream', (remoteStream) => {
          // Stop existing tracks for the remote video
          if (remoteVideoRef.current.srcObject) {
            const tracks = remoteVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          }

          // Assign the remote stream and play the video
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play().catch((error) => {
              console.error('Error playing the remote video:', error);
            });
          };
        });

        setIsCallStarted(true);
      })
      .catch((err) => console.error('Error accessing media devices.', err));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>React Video Call with PeerJS</h1>
      <div>
        <p>Your Peer ID: {peerId}</p>
        <input
          type="text"
          placeholder="Enter Remote Peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
        />
        <button onClick={startCall} disabled={!remotePeerId || isCallStarted}>
          Call
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <div>
          <h3>Local Video</h3>
          <video ref={localVideoRef} width="400" height="300" muted autoPlay></video>
        </div>
        <div>
          <h3>Remote Video</h3>
          <video ref={remoteVideoRef} width="400" height="300" autoPlay></video>
        </div>
      </div>
    </div>
  );
};

export default Test;
