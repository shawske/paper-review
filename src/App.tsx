import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SystemAdminPage from './pages/SystemAdminPage';
import './NavBar.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<SystemAdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;
