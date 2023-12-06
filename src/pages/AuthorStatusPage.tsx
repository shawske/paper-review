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
      <div style={{ textAlign: 'right', padding: '10px 20px' }}>
        <button onClick={() => navigate('/author')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
          Submit Another Paper
        </button>
      </div>
      <div style={{ display: 'flex', padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
        <div style={{ flex: 1, padding: '0 20px' }}>
          <h3>Submissions</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {submissions.map((submission) => (
              <li key={submission.id} style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', marginBottom: '5px' }}
                  onClick={() => handleSubmissionClick(submission)}>
                <p>{submission.title}</p>
              </li>
            ))}
          </ul>
        </div>
        {selectedSubmission && (
          <div style={{ flex: 2, border: '1px solid #ccc', padding: '20px', marginLeft: '20px', alignSelf: 'start' }}>
            <h3>Submission Details</h3>
            <p>Title: {selectedSubmission.title}</p>
            <p>Submission Date: {selectedSubmission.submissionDate}</p>
            <p>Authors: {selectedSubmission.authors.join(', ')}</p>
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: getStatusColor(selectedSubmission.status) }}>
              <p>Status: {selectedSubmission.status}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
 }
  

export default AuthorStatusPage;