import React from 'react';
import { useNavigate } from 'react-router-dom';


const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };
  return (
    <nav className="navbar">
      <button className="nav-button" onClick={handleLogout}>Home</button>
      <h1 className="nav-title">Conference Paper Review System</h1>
      <button className="nav-button" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default NavBar;