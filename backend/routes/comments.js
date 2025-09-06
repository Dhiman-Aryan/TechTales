
const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const router = express.Router();
const auth = require('../middleware/auth'); 


router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, parentComment: null })
      .populate('author', 'username')
      .populate({
        path: 'likes',
        select: 'username'
      })
      .sort({ createdAt: 1 });

   
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'username')
          .populate({
            path: 'likes',
            select: 'username'
          })
          .sort({ createdAt: 1 });
        
        return {
          ...comment.toObject(),
          replies
        };
      })
    );

    res.json(commentsWithReplies);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    console.log('Creating comment:', { content, postId, parentCommentId, userId: req.userId });

    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      content,
      author: req.userId, 
      post: postId,
      parentComment: parentCommentId || null
    });

    await comment.save();
    
    
    await comment.populate('author', 'username');
    await comment.populate({
      path: 'likes',
      select: 'username'
    });

    console.log('Comment created successfully:', comment);
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

   
    await comment.populate('author', 'username');
    await comment.populate({
      path: 'likes',
      select: 'username'
    });

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(req.userId);
    
    if (likeIndex > -1) {
    
      comment.likes.splice(likeIndex, 1);
    } else {
      
      comment.likes.push(req.userId);
    }

    await comment.save();
    
    
    await comment.populate('author', 'username');
    await comment.populate({
      path: 'likes',
      select: 'username'
    });

    res.json(comment);
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;