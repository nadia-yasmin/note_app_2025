import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/form/login";
import "./App.css";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>Home Page</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
