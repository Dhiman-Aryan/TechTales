
const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const router = express.Router();


router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate({
        path: 'posts',
        match: { isPublished: true },
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const postCount = await Post.countDocuments({ 
      author: user._id, 
      isPublished: true 
    });

    res.json({ ...user.toObject(), postCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's posts
router.get('/:username/posts', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: user._id, isPublished: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ 
      author: user._id, 
      isPublished: true 
    });
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;