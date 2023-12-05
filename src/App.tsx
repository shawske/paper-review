import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SystemAdminPage from './pages/SystemAdminPage';
import AuthorPage from './pages/AuthorPage';
import ReviewerPage from './pages/ReviewerPage';
import './NavBar.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<SystemAdminPage />} />
        <Route path="/author" element={<AuthorPage />} />
        <Route path="/reviewer" element={<ReviewerPage />} />
      </Routes>
    </Router>
  );
};

export default App;
