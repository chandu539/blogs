import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Retrieve_blog.css';

function Retrieve_blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="retrieve-blog-container">
      
      <h2>List of Posts</h2>
      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="post-card">
              <h3>{post.title}</h3>
              <img src={post.image} alt={post.title} />
              <p>{post.description}</p>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
      
    </div>
  );
}

export default Retrieve_blog;
