import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';
import { postsAPI } from '../services/api';
import ImageUpload from '../components/ImageUpload';

const EditPost = ({ user }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Technology',
    tags: '',
    featuredImage: '',
    isPublished: true
  });
  const [post, setPost] = useState(null); // Add this state to store the post data
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsAPI.getBySlug(slug);
        const postData = response.data;
        
        // Check if user is the author
        if (user && user.id !== postData.author?._id) {
          setError('You are not authorized to edit this post');
          setLoading(false);
          return;
        }

        setPost(postData); 
        setFormData({
          title: postData.title || '',
          content: postData.content || '',
          excerpt: postData.excerpt || '',
          category: postData.category || 'Technology',
          tags: postData.tags ? postData.tags.join(', ') : '',
          featuredImage: postData.featuredImage || '',
          isPublished: postData.isPublished !== undefined ? postData.isPublished : true
        });
      } catch (err) {
        setError('Post not found or error loading post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to edit a post');
      return;
    }

   
    if (!post || !post._id) {
      setError('Post data not loaded properly');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };

      const response = await postsAPI.update(post._id, postData);
      console.log('Post updated successfully:', response.data);
      
      setSuccessMessage('Post updated successfully!');
      setTimeout(() => {
        navigate(`/post/${response.data.slug}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.message || 'Error updating post');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      setError('Please login to save a draft');
      return;
    }

    if (!post || !post._id) {
      setError('Post data not loaded properly');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const draftData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        isPublished: false
      };


      const response = await postsAPI.update(post._id, draftData);
      console.log('Draft saved successfully:', response.data);
      
      setSuccessMessage('Draft saved successfully!');
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(err.response?.data?.message || 'Error saving draft');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
 
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content: content || ''
    });
  };

  const handleImageUpload = (imageUrl) => {
    setFormData({
      ...formData,
      featuredImage: imageUrl
    });
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

  if (error && error.includes('not authorized')) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/articles" className="text-primary hover:underline">
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl text-gray-600 mb-4">Authentication Required</h2>
          <p className="text-gray-500 mb-4">Please login to edit posts.</p>
          <Link to="/login" className="text-primary hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-dark">Edit Post</h1>
          <Link 
            to={`/post/${slug}`}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            ← Back to Post
          </Link>
        </div>
        
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
              disabled={saving}
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
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
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
              disabled={saving}
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
                disabled={saving}
              >
                <option value="Technology">Technology</option>
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="Cloud">Cloud Computing</option>
                <option value="Mobile">Mobile Development</option>
                <option value="DevOps">DevOps</option>
                <option value="Security">Cybersecurity</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
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
                disabled={saving}
              />
              <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({
                  ...formData,
                  isPublished: e.target.checked
                })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
                disabled={saving}
              />
              <span className="ml-2 text-sm text-gray-700">Publish immediately</span>
            </label>
          </div>

          <div className="flex space-x-4 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Post'}
            </button>
            
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate(`/post/${slug}`)}
              disabled={saving}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Editing Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Update your title to make it more engaging</li>
            <li>• Refresh your excerpt to attract readers</li>
            <li>• Consider updating your featured image</li>
            <li>• Use proper formatting with headers and code blocks</li>
            <li>• Add relevant tags to help readers find your content</li>
            <li>• Proofread before updating</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditPost;