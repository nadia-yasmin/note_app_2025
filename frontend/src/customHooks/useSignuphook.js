import { useState, useEffect, useContext } from "react";
import axiosInstancefile from "../Utils/axiosinstanceform";
import { toast, ToastContainer } from 'react-toastify';
import {useNavigate} from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
const usesignuphook = (role) => {
  const navigate=useNavigate()

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
  const createPost = (data) => {
    const formData = new FormData();
    console.log("data", data);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("name", data.name);
  
    axiosInstancefile
      .post(`/signup?role=${role}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        console.log("Successfully added user:", data);
        showSuccessAlert(JSON.stringify(data.message));
        return data;
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        showErrorAlert(JSON.stringify(error.response.data.message));
        throw error;
      });
  };

  return { createPost };
};

export default usesignuphook;
