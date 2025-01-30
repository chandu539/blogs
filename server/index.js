require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/blogDB';

// Connect to MongoDB
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Schema
const postSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['http://localhost:3001', 'https://blogs-topaz-xi.vercel.app'] }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Upload a New Blog Post
app.post('/api/posts', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const newPost = new Post({ title, image, description });
    await newPost.save();
    
    res.json({ success: true, message: 'Post added successfully', post: newPost });
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).json({ success: false, message: 'Error adding post' });
  }
});

//  Get All Blog Posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    const formattedPosts = posts.map(post => ({
      ...post.toObject(),
      image: post.image ? `${req.protocol}://${req.get('host')}/uploads/${post.image}` : null,
    }));
    res.json(formattedPosts);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ message: 'Error retrieving posts' });
  }
});

//  Delete a Blog Post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

  
    if (post.image) {
      const imagePath = path.join(__dirname, 'uploads', post.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Failed to delete post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});


app.put('/api/posts/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (req.file) {
      const oldImagePath = path.join(__dirname, 'uploads', post.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      post.image = req.file.filename;
    }
    post.title = title;
    post.description = description;
    await post.save();
    res.json({ success: true, message: 'Post updated successfully', post });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ success: false, message: 'Error updating post' });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
