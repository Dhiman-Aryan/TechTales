const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./middleware/auth');

require('dotenv').config();


const app = express();



// CORS Configuration - SIMPLIFIED
app.use(cors({
   origin: [
  'VITE_API_URL=https://tech-tales-ruby.vercel.app'], // Allow both ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


app.get('/api/debug/database', (req, res) => {
  res.json({
    readyState: mongoose.connection.readyState,
    readyStateName: ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][mongoose.connection.readyState],
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    env: process.env.NODE_ENV,
    hasMongoURI: !!process.env.MONGODB_URI
  });
});



// Middleware
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogapp';
const JWT_SECRET = process.env.JWT_SECRET;

// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('✅ MongoDB connected successfully'))
//   .catch(err => {
//     console.log('❌ MongoDB connection error:', err.message);
//     console.log('💡 Connection string used:', process.env.MONGODB_URI ? 'Exists' : 'Missing');
//   });

// // Connection event listeners
// mongoose.connection.on('connected', () => {
//   console.log('✅ MongoDB connected successfully');
// });

// mongoose.connection.on('error', (err) => {
//   console.log('❌ MongoDB connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('⚠️ MongoDB disconnected');
// });



// Improved MongoDB connection with retries
const connectWithRetry = () => {
  console.log('🔗 Attempting MongoDB connection...');
  
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected - attempting reconnect...');
  connectWithRetry();
});




// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', auth, require('./routes/posts')); 
app.use('/api/users', require('./routes/users'));
app.use('/api/comments', require('./routes/comments'));
app.use('/uploads', express.static('uploads'));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blog API is working!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected'
  });
});




// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected',
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🌐 CORS allowed for: http://localhost:5173`);
});