import React from 'react';
import NavBar from './NavBar';
import {useState, useEffect} from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
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

const AuthorPage: React.FC = () => {

  const [conferences, setConferences] = useState<ConferenceData[]>([]);
  const [selectedConference, setSelectedConference] = useState<ConferenceData | null>(null);
  const navigate = useNavigate(); 
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState(['', '', '']); 
  const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().split('T')[0]); 


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
          startDate: data.startDate.toDate().toLocaleDateString(),
          endDate: data.endDate.toDate().toLocaleDateString(),
          submissionDeadline: data.submissionDeadline.toDate().toLocaleDateString(),
        };
      }) as ConferenceData[];
    
      setConferences(fetchedConferences);
    };
    fetchConferences();
  }, []);


  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthors = [...authors];
    newAuthors[index] = event.target.value;
    setAuthors(newAuthors);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    console.log('Submit Button');
    event.preventDefault();
  
    
    const submissionTimestamp = Timestamp.fromDate(new Date(submissionDate));
  
    const paperData = {
      title,
      authors,
      submissionDate: submissionTimestamp, 
      status: 'Pending'
    };
  
    try {
      const PaperSubmissionRef = collection(db, 'PaperSubmission');
      await addDoc(PaperSubmissionRef, paperData);
      window.location.reload();
    } catch (error) {
      console.error('Error submitting paper:', error);
     
    }
  };

  return (
    <div>
    <NavBar />
    <div style={{ textAlign: 'right', padding: '10px 20px' }}>
        <button onClick={() => navigate('/status')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
          View Previous Submissions
        </button>
      </div>
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ width: '250px', padding: '0 20px' }}>
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
            </div>
            <form style={{
              border: '1px solid #ccc',
              padding: '20px',
              width: '100%' 
            }} onSubmit={handleSubmit}>
              <h3>Submit Paper</h3>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={handleTitleChange}
              />
              {authors.map((author, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Co-Author ${index + 1}`}
                  value={author}
                  onChange={handleAuthorChange(index)}
                />
              ))}
              {/* File input */}
              <label style={{ margin: '10px 0', alignSelf: 'flex-start' }}>
                Paper:
                <input
                  type="file"
                  style={{ margin: '10px 0', padding: '5px' }}
                />
              </label>
              {/* Submit button */}
              <button type="submit" style={{ padding: '10px 20px', margin: '10px 0' }}>
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
 }
  

export default AuthorPage;