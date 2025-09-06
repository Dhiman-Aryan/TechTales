


const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const mongoose = require('mongoose');


if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set in environment variables');
}


router.post('/register', async (req, res) => {
  try {
    console.log('=== FRONTEND REGISTRATION ATTEMPT ===');
    console.log('Request received at:', new Date().toISOString());
    
    let { username, email, password } = req.body;

    
    if (!username || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    console.log('Raw input:', { username, email, password: '***' });
    console.log('Database state:', mongoose.connection.readyState);

    
    username = username.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    console.log('Cleaned inputs:', { username, email, password: '***' });

   
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${email}$`, 'i') } },
        { username: { $regex: new RegExp(`^${username}$`, 'i') } }
      ]
    });
    
    if (existingUser) {
      console.log('❌ User already exists:', {
        existingEmail: existingUser.email,
        existingUsername: existingUser.username
      });
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('✅ No existing user found');

    
    const user = new User({ username, email, password });
    console.log('User instance created');

    
    console.log('Attempting to save user...');
    await user.save();
    console.log('✅ User saved successfully!');
    console.log('User ID:', user._id);

   
    const savedUser = await User.findById(user._id);
    console.log('Verification - User found in DB:', savedUser ? 'Yes' : 'No');

    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { 
      expiresIn: '7d' 
    });

    console.log('✅ Registration completed successfully for:', email);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Input email:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Database state:', mongoose.connection.readyState);

   
    const cleanEmail = email.trim().toLowerCase();
    console.log('Cleaned email:', cleanEmail);

  
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } 
    });
    
    console.log('User found:', user ? `Yes (${user.email})` : 'No');
    
    if (!user) {
      console.log('❌ User not found');
      
      
      const allUsers = await User.find({});
      console.log('All users in DB:', allUsers.map(u => u.email));
      
      return res.status(400).json({ message: 'Invalid credentials' });
    }

  
    console.log('🔐 Comparing passwords...');
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Login successful');

   
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { 
      expiresIn: '7d' 
    });

    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/debug/register', async (req, res) => {
  console.log('=== DEBUG REGISTRATION ===');
  console.log('Request body:', req.body);
  
  try {
    const user = new User(req.body);
    await user.save();
    
    console.log('✅ User saved successfully:', user._id);
    res.json({ success: true, userId: user._id });
    
  } catch (error) {
    console.error('❌ Debug registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/test', (req, res) => {
  console.log('=== TEST REQUEST RECEIVED ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Method:', req.method);
  
  res.json({ 
    message: 'Test successful', 
    received: true,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;