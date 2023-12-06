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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', margin: 'auto' }}>
      {/* Papers list */}
      <div style={{ display: 'flex', width: '100%', gap: '20px', marginTop: '20px' }}>
        <div style={{ width: '30%', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ borderBottom: '2px solid black', paddingBottom: '10px' }}>Papers to Review</h3>
          {submissions.map((submission) => (
            <div key={submission.id} onClick={() => handleSubmissionClick(submission)}
              style={{ cursor: 'pointer', padding: '10px', backgroundColor: selectedSubmission?.id === submission.id ? '#d9edf7' : 'transparent', marginBottom: '5px', borderRadius: '4px' }}>
              <p>{submission.title}</p>
            </div>
          ))}
        </div>

        {/* Review form */}
        {selectedSubmission && (
          <div style={{ width: '70%', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
            <h3>Review Paper</h3>
            <div style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px' }}>
              <h4>{selectedSubmission.title}</h4>
              <p><strong>Submission Date:</strong> {selectedSubmission.submissionDate}</p>
              <p><strong>Authors:</strong> {selectedSubmission.authors.join(', ')}</p>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="recommendation" style={{ marginRight: '5px' }}>Recommendation: </label>
              <select id="recommendation" value={recommendation} onChange={(e) => setRecommendation(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
                <option value="recommended">Recommended</option>
                <option value="not recommended">Not Recommended</option>
              </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="comments" style={{ marginRight: '5px' }}>Comments: </label>
              <textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Leave a comment" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', minHeight: '100px' }} />
            </div>

            <button onClick={handleSubmitReview} style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}>
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default ReviewerPage;