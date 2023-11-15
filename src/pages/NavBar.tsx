import React from 'react';

const NavBar = () => {
  return (
    <nav className="navbar">
      <button className="nav-button disabled" disabled>Home</button>
      <h1 className="nav-title">Conference Paper Review System</h1>
      <button className="nav-button disabled" disabled>Logout</button>
    </nav>
  );
};

export default NavBar;