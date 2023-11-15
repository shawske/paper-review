import React from 'react';
import NavBar from './NavBar';

const LoginPage: React.FC = () => {
  return (
    
    <div>
      <NavBar />
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome Back!</h1>
        <p>Enter your username and password to access your account.</p>
      </div>
    </div>
  );
};

export default LoginPage;