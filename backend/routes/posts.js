const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const User = require('../models/User'); 
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all published posts with optional pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isPublished: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ isPublished: true });
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

// Get featured posts (most viewed)
router.get('/featured', async (req, res) => {
  try {
    const featuredPosts = await Post.find({ isPublished: true })
      .populate('author', 'username')
      .sort({ views: -1, createdAt: -1 })
      .limit(3);

    res.json(featuredPosts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.isPublished) {
      post.views += 1;
      await post.save();
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get post by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'username');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add search endpoint
// Add this to your search endpoint
router.get('/search', async (req, res) => {
  try {
    const { q, category, author, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isPublished: true };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (author) {
      // FIXED: Now User is imported
      const users = await User.find({ 
        username: { $regex: author, $options: 'i' } 
      });
      query.author = { $in: users.map(u => u._id) };
    }

    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts,
      currentPage: parseInt(page),
      totalPages,
      totalPosts,
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new post (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, isPublished = true, featuredImage  } = req.body;
    
    console.log('Received post data:', {
      title, excerpt, category, tags, isPublished, featuredImage ,
      contentLength: content?.length
    });

    // Get author ID from authenticated user (from auth middleware)
    const authorId = req.userId;
    console.log('Author ID from auth middleware:', authorId);

    if (!authorId) {
      console.log('❌ No author ID provided');
      return res.status(400).json({ message: 'Author is required' });
    }

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ message: 'A post with this title already exists' });
    }

    const post = new Post({
      title,
      content,
      excerpt,
      slug,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: authorId, // Use the ID from auth middleware
      isPublished,
       featuredImage: featuredImage || null
    });

    await post.save();
    await post.populate('author', 'username');
    
    console.log('✅ Post saved successfully:', {
      id: post._id,
      title: post.title,
      hasFeaturedImage: !!post.featuredImage,
      featuredImage: post.featuredImage
    });
     res.status(201).json(post);

  } catch (error) {
    console.error('❌ Error creating post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    res.json({
      message: 'File uploaded successfully',
      imageUrl: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Delete a post (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    
    console.log('✅ Post deleted successfully:', req.params.id);
    res.json({ message: 'Post deleted successfully' });
    
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a post (author only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, isPublished, featuredImage } = req.body;
    
    console.log('📤 Update request data:', {
      title, content, excerpt, category, tags, isPublished, featuredImage,
      tagsType: typeof tags,
      tagsIsArray: Array.isArray(tags)
    });

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    
    if (title !== undefined) {
      post.title = title;
      
      post.slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    if (content !== undefined) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (category !== undefined) post.category = category;
    
    // Handle tags - they might come as array or string
    if (tags !== undefined) {
      if (typeof tags === 'string') {
        // If tags is a string, split by commas
        post.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      } else if (Array.isArray(tags)) {
        // If tags is already an array, use it directly
        post.tags = tags.map(tag => typeof tag === 'string' ? tag.trim() : tag).filter(tag => tag !== '');
      } else {
        // If tags is something else, set to empty array
        post.tags = [];
      }
    }
    
    if (isPublished !== undefined) post.isPublished = isPublished;
    if (featuredImage !== undefined) post.featuredImage = featuredImage || null;

    await post.save();
    await post.populate('author', 'username');
    
    console.log('✅ Post updated successfully:', {
      id: post._id,
      title: post.title,
      tags: post.tags,
      hasFeaturedImage: !!post.featuredImage,
      featuredImage: post.featuredImage
    });
    
    res.json(post);

  } catch (error) {
    console.error('❌ Error updating post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;