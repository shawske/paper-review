import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { db } from './data/firebase';
import { collection, getDocs } from 'firebase/firestore';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

console.log(db)


//Reading all users
async function readAllUsers() {
  try {
    const userCollectionRef = collection(db, "User");
    const snapshot = await getDocs(userCollectionRef);

    console.log(`Found ${snapshot.size}x user.`);
    const docs = snapshot.docs
    docs.forEach(docSnapshot => {
      console.log(docSnapshot.id, docSnapshot.data());
    })

    // Additional processing of snapshot.docs if needed
  } catch (err) {
    console.error(err);
  }
}

async function readAllPapers() {
  try {
    const userCollectionRef = collection(db, "PaperSubmission");
    const snapshot = await getDocs(userCollectionRef);

    console.log(`Found ${snapshot.size}x paper(s).`);
    const docs = snapshot.docs
    docs.forEach(docSnapshot => {
      console.log(docSnapshot.id, docSnapshot.data());
    })

    // Additional processing of snapshot.docs if needed
  } catch (err) {
    console.error(err);
  }
}


