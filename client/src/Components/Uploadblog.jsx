import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate, useLocation } from 'react-router-dom';
import './Uploadblog.css';

function Uploadblog() {
  const location = useLocation();
  const navigate = useNavigate();
  const existingPost = location.state?.post || null;
  
  const [title, setTitle] = useState(existingPost ? existingPost.title : '');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState(existingPost ? existingPost.description : '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setDescription(existingPost.description);
    }
  }, [existingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    if (image) formData.append('image', image);
    formData.append('description', description);
    try {
      let response;
      if (existingPost) {
        response = await axios.put(`http://localhost:5000/api/posts/${existingPost._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('http://localhost:5000/api/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      console.log("API Response:", response.data);
      alert(existingPost ? 'Post updated successfully' : 'Post added successfully');
      navigate("/");
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-blog-container" style={{ backgroundImage: 'url("post_blog.jpg")' }}>
      <div className='header'>
        <h2>{existingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
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
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Uploading...' : existingPost ? 'Update Post' : 'Add Post'}
          </button>
        </form>
        <button className="back" onClick={() => navigate("/")}>Home</button>
      </div>
    </div>
  );
}

export default Uploadblog;
