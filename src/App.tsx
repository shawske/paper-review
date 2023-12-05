import React from 'react';
import LoginPage from './pages/LoginPage';
import SystemAdminPage from './pages/SystemAdminPage';
import './NavBar.css';

const App: React.FC = () => {
  return (
    <div>
      <LoginPage />
      <SystemAdminPage />
    </div>
    
  );
};

export default App;

