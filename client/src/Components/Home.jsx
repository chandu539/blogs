import React from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ backgroundImage: 'url("bg_image.jpg")' }}>
      <div className="head">
        Welcome to the Blog Post Application
      </div>
      <div>
      <p className="para">Create, view, and manage blog posts easily.</p>
      </div>
      <br></br>
      <div className="button-container">
        <button className="btn" onClick={() => navigate("/upload")}>Add New Post</button>
        <button className="btn" onClick={() => navigate("/retrieve")}>View All Posts</button>
      </div>
    </div>
  );
}

export default Home;
