const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('🔍 Auth middleware called');
    console.log('Headers:', req.headers);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Extracted token:', token);
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found for token');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.userId = decoded.userId;
    req.user = user;
    console.log('✅ Authentication successful, user ID:', req.userId);
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;