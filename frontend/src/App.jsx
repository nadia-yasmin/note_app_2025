import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DenseAppBar from "./Components/navbar/navbar";
import Footer from "./Components/footer/footer";
import Login from "./Components/form/loginform";
import "./App.css";
function App() {
  return (
    <div>
      <BrowserRouter>
        <DenseAppBar />
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
