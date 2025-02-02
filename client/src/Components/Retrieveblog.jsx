import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Retrieveblog.css';

function Retrieveblog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); 
  const navigate = useNavigate();
  const postRefs = useRef({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const handleSearch = () => {
    const post = posts.find(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (post && postRefs.current[post._id]) {
      postRefs.current[post._id].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('No matching post found');
    }
  };

  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className='heading-part'>
      <button className="back" onClick={() => navigate("/")}>Home</button>
        <h2>List of Posts</h2>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='search-button' onClick={handleSearch}>Search</button>
          
        </div>
      </div>
      <div className="retrieve-blog-container">
        <div className="posts-list">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <div key={post._id} ref={el => postRefs.current[post._id] = el} className="post-card">
                <h3>{post.title}</h3>
                <img src={post.image} alt={post.title} />
                <p>{post.description}</p>
                <div className='button-cls'>
                  <button className="update-btn" onClick={() => navigate("/upload", { state: { post } })}>Update</button>
                  <button className="back delete" onClick={() => handleDelete(post._id)}>Delete</button>
                  
                  </div>
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>

        <div className="pagination-controls">
          <button 
            onClick={handlePrevious} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            &laquo; 
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            );
          })}

          <button 
            onClick={handleNext} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            &raquo; 
          </button>
        </div>
      </div>
    </div>
  );
}

export default Retrieveblog;
