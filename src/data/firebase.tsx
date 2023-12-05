import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


//TODO: this shouldn't be directly in source code. We don't want to commit this to GitHub
const firebaseConfig = {
    apiKey: "AIzaSyDve4MAqNdVvJC_o3r5d60hXAyoLJzs414",
    authDomain: "conferencepaperreviewsystem.firebaseapp.com",
    projectId: "conferencepaperreviewsystem",
    storageBucket: "conferencepaperreviewsystem.appspot.com",
    messagingSenderId: "357315574331",
    appId: "1:357315574331:web:6aa5bc16c018edee9c3a1e",
    measurementId: "G-SJB4FYNRWH"
  };

  const app = initializeApp(firebaseConfig)

  const db = getFirestore(app)

  export {db};