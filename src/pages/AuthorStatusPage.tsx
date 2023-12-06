import React from 'react';
import NavBar from './NavBar';
import {useState, useEffect} from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../data/firebase';
import { useNavigate } from 'react-router-dom'; 

type PaperSubmission = {
    id: string;
    title: string;
    submissionDate: string; 
    status: string;
    authors: string[]; 
  };

const AuthorStatusPage: React.FC = () => {

    const [submissions, setSubmissions] = useState<PaperSubmission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<PaperSubmission | null>(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchSubmissions = async () => {
      const submissionsCollectionRef = collection(db, "PaperSubmission");
      const querySnapshot = await getDocs(submissionsCollectionRef);

      const fetchedSubmissions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          submissionDate: data.submissionDate.toDate().toLocaleDateString(), // Adjust if the format needs to be changed
          status: data.status,
          authors: data.authors,
        };
      }) as PaperSubmission[];

      setSubmissions(fetchedSubmissions);
    };
    fetchSubmissions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'grey';
      case 'Not Published':
        return 'red';
      case 'Published':
        return 'green';
      default:
        return 'white'; 
    }
  };

  
  const handleSubmissionClick = (submission: PaperSubmission) => {
    setSelectedSubmission(submission);
  };

  return (
    <div>
      <NavBar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', margin: 'auto' }}>
        {/* Control buttons at the top right */}
        <div style={{ alignSelf: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => navigate('/author')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
            Submit Another Paper
          </button>
        </div>

        {/* Main content area */}
        <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
          {/* Submissions list */}
          <div style={{ width: '30%', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ borderBottom: '2px solid black', paddingBottom: '10px' }}>Submissions</h3>
            {submissions.map((submission) => (
              <div key={submission.id} onClick={() => handleSubmissionClick(submission)}
                style={{ cursor: 'pointer', padding: '10px', backgroundColor: selectedSubmission?.id === submission.id ? '#d9edf7' : 'transparent', marginBottom: '5px', borderRadius: '4px' }}>
                <p>{submission.title}</p>
              </div>
            ))}
          </div>

          {/* Selected submission details */}
          {selectedSubmission && (
            <div style={{ width: '70%', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
              <div style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px' }}>
                <h3>{selectedSubmission.title}</h3>
                <p><strong>Submission Date:</strong> {selectedSubmission.submissionDate}</p>
                <p><strong>Authors:</strong> {selectedSubmission.authors.join(', ')}</p>
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: getStatusColor(selectedSubmission.status), textAlign: 'center' }}>
                  <p>Status: {selectedSubmission.status}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  

export default AuthorStatusPage;