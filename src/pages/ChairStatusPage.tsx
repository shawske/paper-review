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
      
        // Logic to determine the final recommendation status
        const recommendations = fetchedReviews.map(review => review.recommendation);
        const recommendCount = recommendations.filter(r => r === "recommended").length;
        const doNotRecommendCount = recommendations.filter(r => r === "not recommended").length;
      
        let finalStatus = 'Pending';
        if (recommendCount === 3) {
          finalStatus = 'Publish';
        } else if (doNotRecommendCount >= 2) {
          finalStatus = 'Do Not Publish';
        }
      
        // Update the selected submission status locally
        if (selectedSubmission) {
          setSelectedSubmission({ ...selectedSubmission, status: finalStatus });
        }
      };

      const getStatusColor = (status: string) => {
        switch (status) {
          case 'Pending':
            return 'grey';
          case 'Do Not Publish':
            return 'red';
          case 'Publish':
            return 'green';
          default:
            return 'white'; // Default color for unknown status
        }
      };
      const updateSubmissionStatus = async (newStatus: string) => {
        if (selectedSubmission) {
          const submissionRef = doc(db, "PaperSubmission", selectedSubmission.id);
          await updateDoc(submissionRef, { status: newStatus });
    
          // Update the local state to reflect the change
          setSelectedSubmission({ ...selectedSubmission, status: newStatus });
        }
      };
    
      const handleApprove = () => {
        updateSubmissionStatus("Published");
      };
    
      const handleDeny = () => {
        updateSubmissionStatus("Not Published");
      };

      return (
        <div>
          <NavBar />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', margin: 'auto' }}>
            {/* Control buttons at the top right */}
            <div style={{ alignSelf: 'flex-end', marginBottom: '20px' }}>
              <button onClick={() => navigate('/chair')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                Approve Another Conference
              </button>
            </div>
    
            {/* Main content area */}
            <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
              {/* Submissions list */}
              <div style={{ width: '30%', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ borderBottom: '2px solid black', paddingBottom: '10px' }}>Submitted Papers</h3>
                {submissions.map((submission) => (
                  <div key={submission.id} onClick={() => handleSubmissionClick(submission)}
                    style={{ cursor: 'pointer', padding: '10px', backgroundColor: selectedSubmission?.id === submission.id ? '#d9edf7' : 'transparent', marginBottom: '5px', borderRadius: '4px' }}>
                    <p>{submission.title}</p>
                  </div>
                ))}
              </div>
    
              {/* Submission details and review information */}
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
    
                  <h4>Reviews</h4>
                  {reviews.map((review, index) => (
                    <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#e9e9e9', borderRadius: '4px' }}>
                      <p><strong>Reviewer {index + 1}:</strong> {review.reviewerName}</p>
                      <p><strong>Comments:</strong> {review.comments}</p>
                      <p><strong>Recommendation:</strong> {review.recommendation}</p>
                    </div>
                  ))}
    
                  {/* Approve and Deny buttons */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button onClick={handleApprove} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Approve
                    </button>
                    <button onClick={handleDeny} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Deny
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };
    

export default ChairStatusPage;