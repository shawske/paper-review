import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
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
  
  type Review = {
    reviewerName: string;
    comments: string;
    recommendation: string;
  };

const ChairStatusPage: React.FC = () => {
    const [submissions, setSubmissions] = useState<PaperSubmission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<PaperSubmission | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
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
              submissionDate: data.submissionDate.toDate().toLocaleDateString(),
              status: data.status,
              authors: data.authors,
            };
          }) as PaperSubmission[];
    
          setSubmissions(fetchedSubmissions);
        };
        fetchSubmissions();
      }, []);
 
  
      const handleSubmissionClick = async (submission: PaperSubmission) => {
        setSelectedSubmission(submission);
    
        const reviewsCollectionRef = collection(db, "Review");
        const q = query(reviewsCollectionRef, where("submissionID", "==", submission.id));
        const querySnapshot = await getDocs(q);
    
        const fetchedReviews = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            reviewerName: data.reviewerName, // Assuming this field exists
            comments: data.comments,
            recommendation: data.recommendation,
          };
        }) as Review[];
    
        setReviews(fetchedReviews);
      };

      const getStatusColor = (status: string) => {
        switch (status) {
          case 'Pending':
            return 'grey';
          case 'Not Published':
            return 'red';
          case 'Published':
            return 'green';
          default:
            return 'white'; // Default color for unknown status
        }
      };

  return (
    <div>
      <NavBar />
      <div style={{ textAlign: 'right', padding: '10px 20px' }}>
        <button onClick={() => navigate('/chair')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
          Approve Another Conference
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
          <h4>Reviews</h4>
          {reviews.map((review, index) => (
            <div key={index}>
              <p>Reviewer: {review.reviewerName}</p>
              <p>Comments: {review.comments}</p>
              <p>Recommendation: {review.recommendation}</p>
            </div>
            
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default ChairStatusPage;