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
      // Adjust the query as needed, here it's set to fetch the first conference
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
      })[0]; // Get the first conference

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
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      {conference && (
        <div style={{ width: '250px', padding: '0 20px' }}>
          <h3>Conference Request</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li key={conference.id} style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', marginBottom: '5px' }}
                onClick={() => setSelectedConference(conference)}>
              {conference.name}
            </li>
          </ul>
        </div>
      )}
        {selectedConference && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
            <div style={{
              border: '1px solid #ccc',
              padding: '20px',
              marginBottom: '20px',
              width: '100%'
            }}>
              <h3>{selectedConference.name}</h3>
              <p>Location: {selectedConference.location}</p>
              <p>Start Date: {selectedConference.startDate}</p>
              <p>End Date: {selectedConference.endDate}</p>
              <p>Submission Deadline: {selectedConference.submissionDeadline}</p>
              <h2>Conference Chair Information</h2>
              <p>First Name: {'Joe'}</p>
              <p>Last Name: {'Louis'}</p>
              <p>Title: {'Captain'}</p>
              <p>Affiliation: {'Red Wings'}</p>
              <p>Email: {'JoeyL@gmail.com'}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button onClick={navigateToLogin} style={{ marginRight: '10px', padding: '10px 20px' }}>
              Approve
            </button>
            <button onClick={navigateToLogin} style={{ padding: '10px 20px' }}>
              Deny
            </button>
          </div>
        </div>
      )}
    </div>
</div>
  );
};

export default SystemAdminPage;