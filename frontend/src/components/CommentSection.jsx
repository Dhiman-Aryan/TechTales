import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { commentsAPI } from '../services/api';

const CommentSection = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getByPostId(postId);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (content) => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      const response = await commentsAPI.create({ content, postId });
      setComments(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = (updatedComment) => {
    setComments(prev => prev.map(comment => 
      comment._id === updatedComment._id ? updatedComment : comment
    ));
  };

  const handleDelete = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-20 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-dark mb-6">
        Comments ({comments.length})
      </h3>

      {user ? (
        <CommentForm onSubmit={handleSubmit} loading={submitting} />
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-gray-600">
            Please <a href="/login" className="text-primary hover:underline">login</a> to leave a comment.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              postId={postId}
              user={user}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;