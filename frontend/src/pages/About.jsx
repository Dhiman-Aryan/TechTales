import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-6">About TechTales</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            Welcome to TechTales, your go-to destination for the latest technology insights, 
            programming tutorials, and industry news. We're passionate about sharing knowledge 
            and helping developers stay updated with the ever-evolving tech landscape.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-dark mb-4">Our Mission</h2>
              <p className="text-gray-700">
                To create a community-driven platform where tech enthusiasts can share knowledge, 
                learn from each other, and stay informed about the latest trends in technology 
                and software development.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-dark mb-4">What We Offer</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>In-depth technical articles and tutorials</li>
                <li>Industry news and trends analysis</li>
                <li>Community discussions and knowledge sharing</li>
                <li>Resources for developers of all skill levels</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold text-dark mb-4">Join Our Community</h2>
            <p className="text-gray-700 mb-4">
              TechTales is built by developers, for developers. We welcome contributions from 
              everyone passionate about technology.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Create Account
              </Link>
              <Link
                to="/create-post"
                className="border border-primary text-primary px-6 py-2 rounded-md hover:bg-blue-100 transition"
              >
                Write a Post
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-dark mb-4">Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-black text-xl font-bold">AD</span>
                </div>
                <h3 className="font-semibold text-dark">Aryan Dhiman</h3>
                <p className="text-gray-600 text-sm">MERN Stack Developer</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-black text-xl font-bold">----</span>
                </div>
                <h3 className="font-semibold text-dark">____</h3>
                <p className="text-gray-600 text-sm">____</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-black text-xl font-bold">----</span>
                </div>
                <h3 className="font-semibold text-dark">____</h3>
                <p className="text-gray-600 text-sm">____</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-dark mb-4">Get In Touch</h2>
            <p className="text-gray-700 mb-4">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you!
            </p>
            <Link
              to="/contact"
              className="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;