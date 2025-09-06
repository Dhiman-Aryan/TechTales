import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { postsAPI } from '../services/api';

const FeaturedPosts = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await postsAPI.getAll();
        setFeaturedPosts(response.data.posts.slice(0, 3)); // Show first 3 as featured
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-48 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default FeaturedPosts;
