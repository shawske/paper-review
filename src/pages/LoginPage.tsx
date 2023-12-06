import React from 'react';
import NavBar from './NavBar';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../data/firebase';

type SnackbarProps = {
  message: string;
  onClose: () => void;
};

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCollectionRef = collection(db, "User");
      const querySnapshot = await getDocs(query(userCollectionRef, where("username", "==", username)));
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.password === password) { 
          switch (userData.role) {
            case "author":
              navigate('/author');
              break;
            case "reviewer":
              navigate('/reviewer');
              break;
            case "chair":
              navigate('/chair');
              break;
            case "admin":
              navigate('/admin');
              break;
            default:
              navigate('/LoginPage'); 
          }
        }else {
          console.error("Incorrect password");
          setSnackbar({ open: true, message: 'Incorrect password' });
        }
      } else {
        console.error("User not found");
        setSnackbar({ open: true, message: 'User not found' });
      }
    } catch (err) {
      console.error("Login error: ", err);
    }
  };

  const Snackbar: React.FC<SnackbarProps> = ({ message, onClose }) => {
    return (
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px' }}>
        {message}
        <button onClick={onClose} style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>X</button>
      </div>
    );
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  return (
    <div>
      <NavBar />
      <div style={{ textAlign: 'center', maxWidth: '500px', margin: 'auto' }}>
        <h1>Welcome back!</h1>
        <p>Enter your username and password to access your account.</p>

        <form onSubmit={handleLogin}>
  <div style={{ marginBottom: '1em' }}>
    <input
      type="text"
      placeholder="Username"
      style={{ width: '100%', padding: '10px' }}
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
  </div>
  <div style={{ marginBottom: '1em' }}>
    <input
      type="password"
      placeholder="Password"
      style={{ width: '100%', padding: '10px' }}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>
  <div style={{ marginBottom: '1em' }}>
    <button 
      type="submit"
      style={{ width: '100%', padding: '10px', backgroundColor: 'black', color: 'white', border: 'none' }}
    >
      Sign in
    </button>
  </div>
</form>

        <div style={{ margin: '1em 0' }}>
          <a href="#" onClick={(e) => e.preventDefault()}>Forgot your password?</a>
        </div>

        <div style={{ borderTop: '1px solid #ccc', paddingTop: '1em', margin: '1em 0' }}>
          <span>or continue with</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1em' }}>
          <button 
            disabled 
            style={{ padding: '10px', flexGrow: 1, marginRight: '5px', backgroundColor: 'black', color: 'white', border: 'none' }}
          >
            Google
          </button>
          <button 
            disabled 
            style={{ padding: '10px', flexGrow: 1, marginLeft: '5px', backgroundColor: 'black', color: 'white', border: 'none' }}
          >
            Facebook
          </button>
        </div>

        <div>
          Don't have an account? <a href="#" onClick={(e) => e.preventDefault()}>Register</a>
        </div>
      </div>
      {snackbar.open && <Snackbar message={snackbar.message} onClose={handleCloseSnackbar} />}
    </div>
    
  );
};

export default LoginPage;