import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Header = ({ user, setUser }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center  space-x-2">
          <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-xl">TT</span>
          </div>      
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 bg-clip-text text-transparent">TechTales</span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-600 hover:text-primary transition">Home</Link>
          <Link to="/articles" className="text-gray-600 hover:text-primary transition">Articles</Link>
          <Link to="/about" className="text-gray-600 hover:text-primary transition">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-primary transition">Contact</Link>
           {user && (
    <Link to="/create-post" className="text-gray-600 hover:text-primary transition">
  Write Post
</Link>
  )}
        </nav>

        {/* // Add this to your Header component, after the navigation */}
<div className="hidden md:flex items-center space-x-4">
  <SearchBar />
  {/* ... existing user auth buttons ... */}
</div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.username}</span>
              <button 
                onClick={() => setUser(null)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                Login
              </Link>
              <Link to="/register" className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;