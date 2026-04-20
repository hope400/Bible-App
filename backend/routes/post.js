const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const { io } = require('../server');


router.post('/', protect, async (req, res) => {
  try {
    const { content, verseRef } = req.body;
    const post = await Post.create({
      userId: req.user._id,
      content,
      verseRef
    });
    io.emit('post:created', post);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      await post.save();
      io.emit('notification:new', {
        message: `${req.user.name} liked your post`,
        postId: post._id
      });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;