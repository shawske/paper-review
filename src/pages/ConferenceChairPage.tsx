import React from 'react';
import NavBar from './NavBar';
import {useState, useEffect} from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../data/firebase';
import { useNavigate } from 'react-router-dom'; 

type PaperSubmission = {
  id: string;
  title: string;
  submissionDate: string; 
  status: string;
  authors: string[]; 
};
type Reviewer = {
  id: string;
  username: string; // Add other relevant fields as needed
};

const ConferenceChairPage: React.FC = () => {



  const [submissions, setSubmissions] = useState<PaperSubmission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<PaperSubmission | null>(null);
  const navigate = useNavigate(); 

  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  
  useEffect(() => {
  const fetchReviewers = async () => {
    const userCollectionRef = collection(db, "User");
    const q = query(userCollectionRef, where("role", "==", "reviewer"));
    const querySnapshot = await getDocs(q);
  
    const fetchedReviewers = querySnapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        id: doc.id,
        username: docData.username, 
      };
    });
    console.log(fetchedReviewers);
    setReviewers(fetchedReviewers);
  };
 
    fetchReviewers();
    
  }, []); 

  type SelectedReviewers = Record<string, string>;
  const [selectedReviewers, setSelectedReviewers] = useState<SelectedReviewers>({ reviewer1: '', reviewer2: '', reviewer3: '' });
const handleReviewerChange = (reviewerNumber: string, reviewerId: string) => {
  setSelectedReviewers(prev => ({ ...prev, [reviewerNumber]: reviewerId }));
};

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

 const assignReviewers = async () => {
  if (selectedSubmission) {
    const submissionId = selectedSubmission.id;
    const submissionRef = doc(db, "PaperSubmission", submissionId);
    
    await updateDoc(submissionRef, { reviewers: selectedReviewers });
    alert('Reviewers assigned successfully!');
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

    {/* Reviewer Dropdowns */}
    {[1, 2, 3].map(num => (
      <div key={num}>
        <label htmlFor={`reviewer${num}`}>Reviewer {num}: </label>
        <select id={`reviewer${num}`} value={selectedReviewers[`reviewer${num}`]} onChange={(e) => handleReviewerChange(`reviewer${num}`, e.target.value)}>
          <option value="">Select Reviewer</option>
          {reviewers.map(reviewer => (
            <option key={reviewer.id} value={reviewer.id}>{reviewer.username}</option>
          ))}
        </select>
      </div>
    ))}
  </div>
)}
<button onClick={assignReviewers}>Assign Reviewers</button>
      </div>
    </div>
  );
};

export default ConferenceChairPage;