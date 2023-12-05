import React from 'react';
import NavBar from './NavBar';
import {useState, useEffect} from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../data/firebase';

type ConferenceData = {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
};

const AuthorPage: React.FC = () => {

  const [conferences, setConferences] = useState<ConferenceData[]>([]);
  const [selectedConference, setSelectedConference] = useState<ConferenceData | null>(null);

  useEffect(() => {
    const fetchConferences = async () => {
      const conferenceCollectionRef = collection(db, "Conference");
      const querySnapshot = await getDocs(conferenceCollectionRef);
    
      const fetchedConferences = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          location: data.location,
          // Convert Timestamp to Date and format as a string
          startDate: data.startDate.toDate().toLocaleDateString(),
          endDate: data.endDate.toDate().toLocaleDateString(),
          submissionDeadline: data.submissionDeadline.toDate().toLocaleDateString(),
        };
      }) as ConferenceData[];
    
      setConferences(fetchedConferences);
    };
    fetchConferences();
  }, []);

  return (
    <div>
    <NavBar />
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '250px', marginRight: '20px' }}>
        <h3>Conferences</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {conferences.map((conference) => (
            <li key={conference.id} style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', marginBottom: '5px' }}
                onClick={() => setSelectedConference(conference)}>
              {conference.name}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          {selectedConference && (
            <div style={{
              border: '1px solid #ccc',
              padding: '20px',
              width: 'fit-content', // Use a specific width if you want to set the width of the box
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center' // This centers the content horizontally inside the InfoBox
            }}>
            <h3>{selectedConference.name}</h3>
            <p>Location: {selectedConference.location}</p>
            <p>Start Date: {selectedConference.startDate}</p>
            <p>End Date: {selectedConference.endDate}</p>
            <p>Submission Deadline: {selectedConference.submissionDeadline}</p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default AuthorPage;