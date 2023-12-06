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
  username: string; 
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
          submissionDate: data.submissionDate.toDate().toLocaleDateString(),
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', margin: 'auto' }}>
        {/* Control buttons at the top right */}
        <div style={{ alignSelf: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => navigate('/chairstatus')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
            Check Status on Papers
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

          {/* Submission details and reviewer assignment */}
          {selectedSubmission && (
            <div style={{ width: '70%', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
              <div style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px' }}>
                <h3>Conference Paper Review System</h3>
                <h2 style={{ marginTop: '10px' }}>Conference Program Chair</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                  <div>
                    <h4>Title: </h4>
                    <p>{selectedSubmission.title}</p>
                  </div>
                  <div>
                    <h4>Co-Authors: </h4>
                    <p>{selectedSubmission.authors.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Reviewer Dropdowns */}
              {[1, 2, 3].map(num => (
                <div key={num} style={{ marginBottom: '10px' }}>
                  <label htmlFor={`reviewer${num}`} style={{ marginRight: '5px' }}>Reviewer {num}: </label>
                  <select id={`reviewer${num}`} value={selectedReviewers[`reviewer${num}`]} onChange={(e) => handleReviewerChange(`reviewer${num}`, e.target.value)}>
                    <option value="">Select Reviewer</option>
                    {reviewers.map(reviewer => (
                      <option key={reviewer.id} value={reviewer.id}>{reviewer.username}</option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Assign Reviewers Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button onClick={assignReviewers} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                  Assign Reviewers
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConferenceChairPage;