const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const socketEmitter = require('../socket'); // No circular dependency!

// CREATE
router.post('/', protect, async (req, res) => {
  try {
    const { content, verseRef } = req.body;
    const post = await Post.create({ userId: req.user._id, content, verseRef });
    const populated = await Post.findById(post._id).populate('userId', 'name');

    socketEmitter.emit('post:created', populated);
    socketEmitter.emit('activity:new', {
      name: req.user.name,
      action: verseRef ? `shared a reflection on ${verseRef}` : 'shared a new reflection',
      icon: '✨',
      timestamp: new Date().toISOString()
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ all
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'name').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ one
router.get('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('userId', 'name');
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LIKE / UNLIKE
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name');
    const alreadyLiked = post.likes.some(id => id.toString() === req.user._id.toString());

    if (!alreadyLiked) {
      post.likes.push(req.user._id);
      await post.save();
      socketEmitter.emit('notification:new', {
        message: `${req.user.name} liked your post`,
        postId: post._id,
        targetUserId: post.userId?._id
      });
      socketEmitter.emit('activity:new', {
        name: req.user.name, action: 'liked a reflection',
        icon: '❤️', timestamp: new Date().toISOString()
      });
    } else {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
      await post.save();
    }

    const updated = await Post.findById(post._id).populate('userId', 'name');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    socketEmitter.emit('post:deleted', { postId: req.params.id });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;