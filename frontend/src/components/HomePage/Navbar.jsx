import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  const navigate = useNavigate();

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
      <Logo />

      <div className="hidden md:flex space-x-8">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-medium text-black"
        >
          Home
        </button>
        <button 
          onClick={() => handleScroll('function-section')}
          className="font-medium text-gray-600 hover:text-black"
        >
          About us
        </button>
        <button 
          onClick={() => handleScroll('footer-section')}
          className="font-medium text-gray-600 hover:text-black"
        >
          Contact
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/choose-role?mode=signin')}
          className="text-black font-medium">Sign In</button>
        <button 
          onClick={() => navigate('/choose-role')}
          className="bg-black text-white px-6 py-2 rounded-full font-medium transform transition-transform duration-300 hover:scale-105 hover:translate-x-1"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
