import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔐 Token in interceptor:', token);
  console.log('📤 Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Authorization header set');
  } else {
    console.log('❌ No token found');
  }
  
  return config;
});


api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);


const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};


const uploadImageWithFallback = async (formData) => {
  const endpoints = [
    '/upload/image',
    '/upload',
    '/posts/upload',
    '/api/upload'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`🔄 Trying endpoint: ${endpoint}`);
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(`✅ Success with endpoint: ${endpoint}`);
      return response;
    } catch (error) {
      console.log(`❌ Failed with endpoint: ${endpoint}`, error.response?.status);
      
    }
  }
  
  throw new Error('All upload endpoints failed');
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Posts API
export const postsAPI = {
  getAll: () => api.get('/posts'),
  getById: (id) => api.get(`/posts/${id}`),
  getBySlug: (slug) => api.get(`/posts/slug/${slug}`),
  getFeatured: () => api.get('/posts/featured'),
  create: (postData) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      return Promise.reject(new Error('User not authenticated'));
    }
    return api.post('/posts', postData);
  },
  update: (id, postData) => api.put(`/posts/${id}`, postData),
 
  uploadImage: async (formData) => {
    try {
      return await uploadImageWithFallback(formData);
    } catch (error) {
      console.error('All upload endpoints failed:', error);
      
     
      const file = formData.get('image');
      if (file) {
        
        const base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        
       
        return {
          data: {
            imageUrl: base64Image,
            message: 'Image converted to base64 (no upload endpoint available)'
          }
        };
      }
      
      throw error;
    }
  },
  
  update: (id, postData) => api.put(`/posts/${id}`, postData),
  delete: (id) => api.delete(`/posts/${id}`),

 search: (params = {}) => {
    console.log('🔍 Making search request with params:', params);
    
 
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    
    console.log('🧹 Cleaned params:', cleanParams);
    return api.get('/posts/search', { params: cleanParams });
  },
};

// Comments API
export const commentsAPI = {
  getByPostId: (postId) => api.get(`/comments/post/${postId}`),
  create: (commentData) => api.post('/comments', commentData),
  update: (id, commentData) => api.put(`/comments/${id}`, commentData),
  delete: (id) => api.delete(`/comments/${id}`),
  like: (id) => api.post(`/comments/${id}/like`)
};

// Users API
export const usersAPI = {
  getProfile: (username) => api.get(`/users/${username}`),
  getPosts: (username, params = {}) => api.get(`/users/${username}/posts`, { params })
};

export default api;