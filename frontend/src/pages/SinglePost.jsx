


import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import CommentSection from '../components/CommentSection';
import DeleteConfirmation from '../components/DeleteConfirmation';

const SinglePost = ({ user }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsAPI.getBySlug(slug);
        setPost(response.data);
      } catch (err) {
        setError('Post not found');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postsAPI.delete(post._id);
      navigate('/articles'); 
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <h1 className="text-2xl font-bold text-dark mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
        <Link to="/articles" className="text-primary hover:underline">
          ← Back to Articles
        </Link>
      </div>
    );
  }

  const isAuthor = user && user.id === post.author?._id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
       
        <div className="h-64 md:h-96 overflow-hidden">
          

          <img 
    src={
      post.featuredImage 
        ? (post.featuredImage.startsWith('/') 
            ? `http://localhost:5000${post.featuredImage}`
            : post.featuredImage.startsWith('data:image/')
            ? post.featuredImage
            : post.featuredImage
          )
        : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    }
    alt={post.title}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';
    }}
  />
        </div>

      
        <div className="p-6 md:p-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>By {post.author?.username || 'Unknown'}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(post.createdAt)}</span>
            <span className="mx-2">•</span>
            <span>{post.views} views</span>
            <span className="mx-2">•</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-6">{post.title}</h1>
          
          
          <div className="mb-8 whitespace-pre-wrap prose max-w-none">
            {post.content}
          </div>

         
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

       
          {isAuthor && (
            <div className="flex space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <Link to={`/edit-post/${post.slug}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
  Edit Post
</Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          )}

          <div className="border-t pt-6 flex justify-between items-center">
            <Link to="/articles" className="text-primary hover:underline flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Articles
            </Link>
            
            {isAuthor && (
              <span className="text-sm text-gray-500">
                You are the author of this post
              </span>
            )}
          </div>
        </div>
      </article>

     
      <CommentSection postId={post._id} user={user} />

      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={post.title}
      />
    </div>
  );
};

export default SinglePost;