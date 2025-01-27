// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBCFkJnq_cpGj0y-_nG4-OFNln7QYY5tws",
  authDomain: "webrtc-demo-c8700.firebaseapp.com",
  projectId: "webrtc-demo-c8700",
  storageBucket: "webrtc-demo-c8700.firebasestorage.app",
  messagingSenderId: "143091090328",
  appId: "1:143091090328:web:e19acec868b7a2547c21ed"
};

const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});
