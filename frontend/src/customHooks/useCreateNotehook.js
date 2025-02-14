import { useState, useEffect, useContext } from "react";
import axiosInstancefile from "../Utils/axiosinstanceform";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useCreateNotehook = () => {
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const showSuccessAlert = (message) => {
    console.log('Showing success toast with message:', message);
    toast.success(message, {
      position: "top-right",
      autoClose: 2000, 
    });
    setTimeout(() => {
      console.log('Navigating to the home page...');
      navigate("/"); 
    }, 2000);
  };

  const showErrorAlert = (errorMessage) => {
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 2000, 
    });
  };

  const createNote = (formData) => {
    console.log("formData", formData);
    const userData = JSON.parse(localStorage.getItem("userdata"));
    const userName = userData ? userData.name : "Anonymous";
    const formDataWithAuthor = { ...formData, author: userName };
    
    axiosInstancefile
      .post("/addnote", formDataWithAuthor)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          console.log("Data: ", data);
          showSuccessAlert(data.message);
        }
        console.log("Successfully note submitted.", data);
      })
      .catch((error) => {
        console.error("Error submitting note.", error);
        showErrorAlert(error.response.data.message);
      });
  };

  return { createNote, refresh };
};

export default useCreateNotehook;
