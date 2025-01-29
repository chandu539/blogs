import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import './Upload_blog.css';

function Upload_blog() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false); 


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    formData.append('description', description);

    try {
      const response = await axios.post('http://localhost:5001/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      if (data.success) {
        alert('Post added successfully');
        setTitle('');
        setDescription('');
        setImage(null);
      } else {
        alert('Error adding post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-blog-container" style={{ backgroundImage: 'url("post_blog.jpg")' }}>
      <div className='header'>
        <h2>Add New Blog Post</h2>
      </div>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Add Post'}
          </button>
        </form>
        <button className="back" onClick={() => navigate("/")}>Home</button>
      </div>
    </div>
  );
}

export default Upload_blog;
