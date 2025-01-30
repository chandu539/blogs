import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Uploadblog from "./Components/Uploadblog";
import Retrieveblog from "./Components/Retrieveblog";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Uploadblog/>} />
        <Route path="/retrieve" element={<Retrieveblog/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
