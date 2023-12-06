import React from 'react';
import NavBar from './NavBar';
import {useState, useEffect} from 'react';
import { collection, getDocs, query, where, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../data/firebase';
import { useNavigate } from 'react-router-dom'; 
import { Timestamp } from 'firebase/firestore'; 

type ConferenceData = {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
};

const SystemAdminPage: React.FC = () => {
  const [conference, setConference] = useState<ConferenceData | null>(null);
  const [selectedConference, setSelectedConference] = useState<ConferenceData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConference = async () => {
      const conferenceCollectionRef = collection(db, "Conference");
     
      const q = query(conferenceCollectionRef, orderBy("startDate", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      const fetchedConference = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          location: data.location,
          startDate: data.startDate.toDate().toLocaleDateString(),
          endDate: data.endDate.toDate().toLocaleDateString(),
          submissionDeadline: data.submissionDeadline.toDate().toLocaleDateString(),
        };
      })[0]; 
      setConference(fetchedConference);
    };

    fetchConference();
  }, []);


 const navigateToLogin = async (event: React.FormEvent) => {
      navigate('/')
  };


  return (
    <div>
      <NavBar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', margin: 'auto' }}>
        {/* Conference request */}
        <div style={{ display: 'flex', width: '100%', gap: '20px', marginTop: '20px' }}>
          {conference && (
            <div style={{ width: '100%', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
              <h3>Conference Request</h3>
              <div style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px' }}>
                <h4>{conference.name}</h4>
                <p><strong>Location:</strong> {conference.location}</p>
                <p><strong>Start Date:</strong> {conference.startDate}</p>
                <p><strong>End Date:</strong> {conference.endDate}</p>
                <p><strong>Submission Deadline:</strong> {conference.submissionDeadline}</p>
                {/* Sample conference chair information */}
                <h4>Conference Chair Information</h4>
                <p>First Name: Joe</p>
                <p>Last Name: Louis</p>
                <p>Title: Captain</p>
                <p>Affiliation: Red Wings</p>
                <p>Email: JoeyL@gmail.com</p>
              </div>
              
              {/* Approve and Deny buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button onClick={navigateToLogin} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Approve
                </button>
                <button onClick={navigateToLogin} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Deny
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default SystemAdminPage;