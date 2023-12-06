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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', margin: 'auto' }}>
        {/* Control buttons at the top right */}
        <div style={{ alignSelf: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => navigate('/status')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
            View Previous Submissions
          </button>
        </div>

        {/* Main content area */}
        <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
          {/* Conference list */}
          <div style={{ width: '30%', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ borderBottom: '2px solid black', paddingBottom: '10px' }}>Conferences</h3>
            {conferences.map((conference) => (
              <div key={conference.id} onClick={() => setSelectedConference(conference)}
                style={{ cursor: 'pointer', padding: '10px', backgroundColor: selectedConference?.id === conference.id ? '#d9edf7' : 'transparent', marginBottom: '5px', borderRadius: '4px' }}>
                <p>{conference.name}</p>
              </div>
            ))}
          </div>

          {/* Paper submission form */}
          {selectedConference && (
            <div style={{ width: '70%', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
              <div style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px' }}>
                <h3>{selectedConference.name}</h3>
                <p><strong>Location:</strong> {selectedConference.location}</p>
                <p><strong>Start Date:</strong> {selectedConference.startDate}</p>
                <p><strong>End Date:</strong> {selectedConference.endDate}</p>
                <p><strong>Submission Deadline:</strong> {selectedConference.submissionDeadline}</p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={handleTitleChange}
                  style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                {authors.map((author, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Co-Author ${index + 1}`}
                    value={author}
                    onChange={handleAuthorChange(index)}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                ))}
                <label style={{ alignSelf: 'flex-start', marginTop: '20px' }}>
                  Paper:
                  <input
                    type="file"
                    style={{ margin: '10px 0', padding: '5px' }}
                  />
                </label>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer', marginTop: '10px' }}>
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  

export default AuthorPage;