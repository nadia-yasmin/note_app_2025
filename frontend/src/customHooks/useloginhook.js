import { useState, useEffect, useContext } from "react";
import axiosInstance from "../Utils/axiosInstance";
import {useNavigate} from "react-router-dom"
const useLoginHook = (token, userId, newPassword, oldPassword, role) => {
  const [successAlert, setSuccessAlert] = useState(false);
  const [refresh,setRefresh]=useState(false)
  const [errorAlert, setErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate=useNavigate()
  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setSuccessAlert(true);
  };

  const showErrorAlert = (errorMessage) => {
    setAlertMessage(errorMessage);
    setErrorAlert(true);
  };
  const createLogin = (formData) => {
    console.log("formData", formData);
    axiosInstance
      .post("/login", formData)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          const token = data.data.token;
          setRefresh(!refresh)
          localStorage.setItem("userdata", JSON.stringify(data.data));
          localStorage.setItem("token", token);
          console.log("userdata token",data.data,token)
          navigate("/dashboard")
         
        }
        console.log("Successfully logged in:", data);
        localStorage.setItem("responseData", data.message);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        showErrorAlert(error.response.data.message);
      });
  };

  return { createLogin ,successAlert, errorAlert, alertMessage ,refresh};
};

export default useLoginHook;
