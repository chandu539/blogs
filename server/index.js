const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); 
require('dotenv').config(); 

const app = express();

const PORT = process.env.PORT || 5001;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/blogDB';

// Connection to MongoDB
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define schema
const postSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
});

const Post = mongoose.model('Post', postSchema);  

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });  // Multer


app.post('/api/posts', upload.single('image'), async (req, res) => {       
  const { title, description } = req.body;
  const image = req.file.filename; 

  try {
    const newPost = new Post({ title, image, description });
    await newPost.save();
    res.json({ success: true, message: 'Post added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding post' });
  }
});


app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    
    const postsWithFullImageURL = posts.map(post => ({
      ...post.toObject(),
      image: `${req.protocol}://${req.get('host')}/uploads/${post.image}`,
    }));
    res.json(postsWithFullImageURL);  
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
