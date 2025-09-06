import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';
import { postsAPI } from '../services/api';
import ImageUpload from '../components/ImageUpload';
const WritePost = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Technology',
    tags: '',
    featuredImage: '',
    isPublished: true
  });
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 SUBMITTING FORM DATA:', {
    ...formData,
    featuredImage: formData.featuredImage ? 'EXISTS' : 'MISSING'
  });
    if (!user) {
      setError('Please login to create a post');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await postsAPI.create(formData);
      console.log('Post published successfully:', response.data);
      navigate(`/post/${response.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
//     
  if (!user) {
    setError('Please login to save a draft');
    return;
  }


  if (!formData.title || !formData.content) {
    setError('Title and content are required to save draft');
    return;
  }

  setSavingDraft(true);
  setError('');
  setSuccessMessage('');

  try {
    const draftData = {
      ...formData,
      isPublished: false,
         
    };

   
   
    const response = await postsAPI.create(draftData);
    console.log('Draft saved successfully:', response.data);
    setSuccessMessage('Draft saved successfully!');
    
   
   
    
  } catch (err) {
    console.error('Error saving draft:', err);
    
    
    if (err.message === 'User not authenticated') {
      setError('Please login again to save drafts');
    } else if (err.response?.data?.error?.includes('author')) {
      setError('Authentication error. Please try logging in again.');
    } else {
      setError(err.response?.data?.message || 'Error saving draft');
    }
  } finally {
    setSavingDraft(false);
  }
};

const handleImageUpload = (imageUrl) => {
    setFormData({
      ...formData,
      featuredImage: imageUrl
    });
     if (imageUrl) {
    setSuccessMessage('Image uploaded successfully!');
    setTimeout(() => setSuccessMessage(''), 3000); // Clear after 3 seconds
  }
  };

  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content: content || ''
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl text-gray-600 mb-4">Authentication Required</h2>
          <p className="text-gray-500 mb-4">Please login to create a post.</p>
          <a href="/login" className="text-primary hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-dark mb-6">Write New Post</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
              placeholder="Enter a compelling title for your post"
              disabled={loading || savingDraft}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
              placeholder="Brief description of your post"
              disabled={loading || savingDraft}
            />
          </div>

        
  
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
   
  </label>
  <ImageUpload 
    onImageUploaded={handleImageUpload}
    currentImage={formData.featuredImage}
  />
</div>
          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              height={400}
              disabled={loading || savingDraft}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading || savingDraft}
              >
                <option value="Technology">Technology</option>
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="Cloud">Cloud Computing</option>
                <option value="Mobile">Mobile Development</option>
                <option value="DevOps">DevOps</option>
                <option value="Security">Cybersecurity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="react, javascript, web, tutorial"
                disabled={loading || savingDraft}
              />
              <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
            </div>
          </div>

          <div className="flex space-x-4 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || savingDraft}
              className="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
            
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading || savingDraft}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition disabled:opacity-50"
            >
              {savingDraft ? 'Saving Draft...' : 'Save Draft'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/articles')}
              disabled={loading || savingDraft}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Writing Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use a clear and descriptive title</li>
            <li>• Write a compelling excerpt to attract readers</li>
            <li>• Use proper formatting with headers and code blocks</li>
            <li>• Add relevant tags to help readers find your content</li>
            <li>• Proofread before publishing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WritePost;