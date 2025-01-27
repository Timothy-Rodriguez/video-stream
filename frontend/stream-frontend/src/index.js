import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//import reportWebVitals from './reportWebVitals';
import VideoPlayer from './components/VideoPlayer';
// import WebSocketDemo from './components/WebSocketDemo';
// import WebRTC from './components/WebRTC';
// import Socket from './components/Socket-io';
// import SocketWebRTC from './components/SocketWebRTC';
// import Test from './components/Test';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode
  <>
    {/* <App /> */}
    <VideoPlayer />
    {/* <WebSocketDemo /> */}
    {/* <WebRTC /> */}
    {/* <Socket /> */}
    {/* <SocketWebRTC /> */}
    {/* <Test /> */}
    </>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
