import firebase from 'firebase/app';
import 'firebase/auth'; 
import 'firebase/firestore';  

const firebaseConfig = {
    apiKey: "AIzaSyDve4MAqNdVvJC_o3r5d60hXAyoLJzs414",
    authDomain: "conferencepaperreviewsystem.firebaseapp.com",
    projectId: "conferencepaperreviewsystem",
    storageBucket: "conferencepaperreviewsystem.appspot.com",
    messagingSenderId: "357315574331",
    appId: "1:357315574331:web:6aa5bc16c018edee9c3a1e",
    measurementId: "G-SJB4FYNRWH"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;