import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/form/login";
import Signupoptions from "./components/form/signupoptions";
import Signup from "./components/form/signup";
import Notewriting from "./components/form/note";
import GetNotesByEmail from "./components/displaycontent/getNotesByEmail";
import UpdateContent from "./components/form/updatecontent";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

function App() {
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>       
          <Route path="/" element={<Login />} />
          <Route path="/comment" element={<h1>Home Page</h1>} />
          <Route path="/signupoptions" element={<Signupoptions/>} />
          <Route path="/signup/:role" element={<Signup/>} />
          <Route path="/updatecontent/:title" element={<UpdateContent/>} />
          <Route path="/notewriting" element={<Notewriting/>} />
          <Route path="/showallnotes" element={<GetNotesByEmail/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
