import React from 'react';
import NavBar from './NavBar';

const LoginPage: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div style={{ textAlign: 'center', maxWidth: '500px', margin: 'auto' }}>
        <h1>Welcome back!</h1>
        <p>Enter your username and password to access your account.</p>

        <form>
          <div style={{ marginBottom: '1em' }}>
            <input type="text" placeholder="Username" style={{ width: '100%', padding: '10px' }} />
          </div>
          <div style={{ marginBottom: '1em' }}>
            <input type="password" placeholder="Password" style={{ width: '100%', padding: '10px' }} />
          </div>
          <div style={{ marginBottom: '1em' }}>
            <button 
              type="submit" 
              disabled 
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
    </div>
  );
};

export default LoginPage;