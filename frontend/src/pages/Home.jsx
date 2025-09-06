import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedPosts from '../components/FeaturedPosts';

const Home = () => {
  return (
    <div>
     
      <section className="gradient-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Latest Tech Insights & News</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Stay updated with the latest technology trends, programming tutorials, and industry news.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/articles" className="bg-white text-primary text-blue-500 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 hover:text-blue-600 transition text-center">
              Read Latest Articles
            </Link>
            <Link to="/create-post" className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition text-center">
              Write a Post
            </Link>
          </div>
        </div>
      </section>

     
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold  text-center text-dark mb-12">Featured Articles</h2>
          <FeaturedPosts />
          
          <div className="text-center mt-10">
            <Link to="/articles" className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition">
              View All Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;