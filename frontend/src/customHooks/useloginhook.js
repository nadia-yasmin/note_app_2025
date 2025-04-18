import { useState, useEffect, useContext } from "react";
import axiosInstancefile from "../Utils/axiosinstanceform";
import {useNavigate} from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const useLoginHook = () => {
  const [refresh,setRefresh]=useState(false)
  const navigate=useNavigate()
  const showSuccessAlert = (message) => {
    console.log('Showing success toast with message:', message);
    toast.success(message, {
      position: "top-right",
      autoClose: 2000, 
    });
    setTimeout(() => {
      console.log('Navigating to the home page...');
      navigate("/notewriting"); 
    }, 2000);
  };
  
  const showErrorAlert = (errorMessage) => {
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 2000, 
    });
  };
  const createLogin = (formData) => {
    console.log("formData", formData);
    axiosInstancefile
      .post("/login", formData)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          const token = data.data.token;
          setRefresh(!refresh)
          localStorage.setItem("userdata", JSON.stringify(data.data));
          localStorage.setItem("token", token);
          console.log("userdata",data)
          showSuccessAlert(data.message);
          // navigate("/dashboard")
         
        }
        console.log("Successfully logged in:", data);
        // localStorage.setItem("responseData", data.message);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        showErrorAlert(error.response.data.message);
      });
  };

  return { createLogin ,refresh};
};

export default useLoginHook;
