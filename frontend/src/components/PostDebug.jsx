// components/PostDebug.jsx
import React from 'react';

const PostDebug = ({ post }) => {
  return (
    <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg mt-4">
      <h3 className="font-bold text-yellow-800 mb-2">🐛 POST DEBUG INFO</h3>
      <div className="text-sm text-yellow-700 space-y-1">
        <p><strong>Post ID:</strong> {post._id}</p>
        <p><strong>Title:</strong> {post.title}</p>
        <p><strong>Has featuredImage:</strong> {!!post.featuredImage ? 'YES' : 'NO'}</p>
        <p><strong>featuredImage value:</strong> {post.featuredImage || 'NULL'}</p>
        <p><strong>Image type:</strong> {
          !post.featuredImage ? 'No image' :
          post.featuredImage.startsWith('data:image/') ? 'Base64' :
          post.featuredImage.startsWith('/') ? 'Relative path' :
          post.featuredImage.startsWith('http') ? 'Full URL' :
          'Unknown format'
        }</p>
        <p><strong>All post keys:</strong> {Object.keys(post).join(', ')}</p>
      </div>
    </div>
  );
};

export default PostDebug;