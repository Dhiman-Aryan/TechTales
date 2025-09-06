import React, { useState } from 'react';
import CommentForm from './CommentForm';
import { commentsAPI } from '../services/api';

const Comment = ({ comment, postId, user, onUpdate, onDelete }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    
    setIsLiking(true);
    try {
      const response = await commentsAPI.like(comment._id);
      onUpdate(response.data);
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async (content) => {
    try {
      const response = await commentsAPI.create({
        content,
        postId,
        parentCommentId: comment._id
      });
      onUpdate(response.data);
      setIsReplying(false);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const handleEdit = async (content) => {
    try {
      const response = await commentsAPI.update(comment._id, { content });
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentsAPI.delete(comment._id);
        onDelete(comment._id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const isLiked = user && comment.likes.includes(user.id);
  const canModify = user && user.id === comment.author._id;

  return (
    <div className="border-l-2 border-gray-200 pl-4 mb-4">
      <div className="bg-white p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-800">{comment.author.username}</span>
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
              {comment.isEdited && ' (edited)'}
            </span>
          </div>
        </div>

        {isEditing ? (
          <CommentForm
            onSubmit={handleEdit}
            initialValue={comment.content}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <p className="text-gray-700 mb-3">{comment.content}</p>
            
            <div className="flex items-center space-x-4 text-sm">
              <button
                onClick={handleLike}
                disabled={!user || isLiking}
                className={`flex items-center space-x-1 ${
                  isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <span>👍</span>
                <span>{comment.likes.length}</span>
              </button>
              
              {user && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  Reply
                </button>
              )}

              {canModify && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {isReplying && user && (
        <div className="mt-3 ml-4">
          <CommentForm
            onSubmit={handleReply}
            onCancel={() => setIsReplying(false)}
            placeholder={`Replying to ${comment.author.username}...`}
          />
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              postId={postId}
              user={user}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
