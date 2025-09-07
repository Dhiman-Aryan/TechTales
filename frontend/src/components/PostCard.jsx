




import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import DeleteConfirmation from './DeleteConfirmation';

const PostCard = ({ post, user, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isAuthor = user && user.id === post.author?._id;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postsAPI.delete(post._id);
      onDelete?.(post._id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Function to get the correct image URL
  const getImageUrl = () => {
    // If image failed to load, use fallback
    if (imageError) {
      return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';
    }

    // If no featured image in the post data, use fallback
     if (!post.featuredImage || post.featuredImage.trim() === '') {
    console.log('❌ No featuredImage for post:', post._id);
    return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';
  }

    // If it's a base64 image (starts with data:image/)
    if (post.featuredImage.startsWith('data:image/')) {
      console.log('✅ Using base64 image for post:', post._id);
      return post.featuredImage;
    }

    // If it's a relative path (starts with /)
    if (post.featuredImage.startsWith('/')) {
      const fullUrl = `http://localhost:5000${post.featuredImage}`;
      console.log('🌐 Using relative path converted to full URL:', fullUrl);
      return fullUrl;
    }

    // If it's already a full URL (http or https)
    if (post.featuredImage.startsWith('http')) {
      console.log('🌐 Using full URL:', post.featuredImage);
      return post.featuredImage;
    }

    // For any other case, log it and use fallback
    console.log('❓ Unknown image format:', post.featuredImage);
  return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';
};

  const handleImageError = (e) => {
    console.error('🖼️ Image failed to load for post:', post._id, 'URL:', post.featuredImage);
    setImageError(true);
    
    // Set the fallback image
    e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';
  };

  // Debug: Log the image info for this post
  console.log('📊 Post image info:', {
    postId: post._id,
    title: post.title,
    hasFeaturedImage: !!post.featuredImage,
    featuredImage: post.featuredImage,
    imageType: post.featuredImage ? 
      (post.featuredImage.startsWith('data:image/') ? 'base64' : 
       post.featuredImage.startsWith('/') ? 'relative path' : 
       post.featuredImage.startsWith('http') ? 'full url' : 'unknown') : 
      'no image'
  });

  return (
    <>
      <div className="article-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 overflow-hidden relative">
          <img 
            src={getImageUrl()}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
          
          {isAuthor && (
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                title="Delete post"
                disabled={deleting}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          {/* Meta Information */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="text-gray-600">By {post.author?.username || 'Unknown'}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(post.createdAt)}</span>
            {post.views > 0 && (
              <>
                <span className="mx-2">•</span>
                <span>{post.views} views</span>
              </>
            )}
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition">
            <Link to={`/post/${post.slug}`}>
              {post.title}
            </Link>
          </h3>
          
          {/* Excerpt */}
          <p className="text-gray-600 mb-4 line-clamp-3">
            {truncateText(post.excerpt || post.content || '', 120)}
          </p>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Category */}
          <div className="mb-4">
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {post.category || 'Uncategorized'}
            </span>
          </div>
          
          {/* Read More Link */}
          <Link 
            to={`/post/${post.slug}`}
            className="text-blue-600 font-medium hover:text-blue-800 transition flex items-center"
          >
            Read More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={post.title}
        isLoading={deleting}
      />
    </>
  );
};

export default PostCard;
