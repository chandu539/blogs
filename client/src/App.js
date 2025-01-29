import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Upload_blog from "./Components/Upload_blog";
import Retrieve_blog from "./Components/Retrieve_blog";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload_blog/>} />
        <Route path="/retrieve" element={<Retrieve_blog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
