import React from 'react';
import NavBar from './NavBar';
import {useState, useEffect} from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../data/firebase';
import { useNavigate } from 'react-router-dom'; 


type PaperSubmission = {
  id: string;
  title: string;
  submissionDate: string; 
  status: string;
  authors: string[]; 
};

const ReviewerPage: React.FC = () => {
 
  const [submissions, setSubmissions] = useState<PaperSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<PaperSubmission | null>(null);
  const [recommendation, setRecommendation] = useState('recommended');
  const [comments, setComments] = useState('');
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');

useEffect(() => {
  const fetchSubmissions = async () => {
    const submissionsCollectionRef = collection(db, "PaperSubmission");
    const querySnapshot = await getDocs(submissionsCollectionRef);

    const fetchedSubmissions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        submissionDate: data.submissionDate.toDate().toLocaleDateString(), 
        status: data.status,
        authors: data.authors,
      };
    }) as PaperSubmission[];

    setSubmissions(fetchedSubmissions);
  };
  fetchSubmissions();
}, []);


const handleSubmissionClick = (submission: PaperSubmission) => {
  setSelectedSubmission(submission);
  setRecommendation('recommended');
  setComments('');
};

const handleSubmitReview = async () => {
  if (selectedSubmission) {
    const reviewData = {
      comments: comments,
      recommendation: recommendation,
      reviewDate: new Date().toISOString(), 
      reviewerID: userID,
      submissionID: selectedSubmission.id,
    };

    try {
      await addDoc(collection(db, "Review"), reviewData);
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error writing document: ', error);
      alert('Failed to submit review.');
    }
  }
};

return (
  <div>
    <NavBar />
    <div style={{ display: 'flex', padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ flex: 1, padding: '0 20px' }}>
        <h3>Papers to Review</h3>
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
          <select value={recommendation} onChange={(e) => setRecommendation(e.target.value)} style={{ margin: '10px 0' }}>
            <option value="recommended">Recommended</option>
            <option value="not recommended">Not Recommended</option>
          </select>
         
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Leave a comment" style={{ margin: '10px 0', width: '100%', minHeight: '100px' }} />
        
          <button onClick={handleSubmitReview} style={{ padding: '10px 20px', margin: '10px 0' }}>
            Submit Review
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default ReviewerPage;