import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-xl">TT</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 bg-clip-text text-transparent">TechTales</span>
            </div>
            <p className="text-gray-400 mb-6">
              Providing the latest technology insights and tutorials for developers.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg text-gray-500 font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-gray-500 transition">Home</Link></li>
              <li><Link to="/articles" className="text-gray-400 hover:text-gray-500 transition">Articles</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-gray-500 transition">About</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-gray-500 transition">Contact</Link></li>
              
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-500 mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-gray-400 hover:text-gray-500">Email: aryandhiman2017@gmail.com</li>
              <li className="text-gray-400 hover:text-gray-500">Phone: +91 ---- --- ---</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center bg-gray-100 text-gray-600">
          <p>© 2025 TechTales. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;