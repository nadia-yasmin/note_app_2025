import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import io from "socket.io-client";
import StyledPaper from "./common/centered container/styledpaper";
import CenteredContainer from "./common/centered container/centeredcontainer";
import Buttoncomponent from "./common/button/button";
import axiosInstancefile from "../../Utils/axiosinstanceform";
import axiosInstance from "../../Utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ENDPOINT = "http://localhost:8000";
let socket; // Declare socket variable

const UpdateContent = () => {
  const userData = JSON.parse(localStorage.getItem("userdata"));
  const email = userData.email;
  const navigate = useNavigate();
  const { title } = useParams();
  const [note, setNote] = useState(null);
  const { control, handleSubmit, formState: { errors }, setValue } = useForm();
  const [isUpdating, setIsUpdating] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Fetch note data
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axiosInstancefile.get(`/shownotebytitle?title=${title}`);
        if (response.data) {
          setNote(response.data.data[0]);
          setValue("content", response.data.data[0].content);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Failed to fetch note");
      }
    };
    fetchNote();
  }, [title, setValue]);

  // Initialize Socket.IO connection
  useEffect(() => {
    socket = io(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("Connected to socket.io");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
      setSocketConnected(false);
    });

    if (userData) {
      socket.emit("setup", userData);
    }

    // Cleanup on unmount
    // return () => {
    //   socket.disconnect();
    // };
  }, [userData]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsUpdating(true);
      const response = await axiosInstance.put(`/updatenote`, {
        title,
        newContent: data.content,
        email,
      });

      if (response.data) {
        console.log("response.data", response.data);
        setNote(response.data.content);
        setValue("content", response.data.content);

        // Ensure socket is defined before emitting
        if (socket) {
          socket.emit("noteUpdated", { title, newContent: response.data.content });
        }

        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/showallnotes");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating note:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(
          error.response.data.error
            .map((err, index) => `${index + 1}. ${err.msg}`)
            .join("\n")
        );
      } else {
        toast.error("Update failed");
      }
    } finally {
      setTimeout(() => setIsUpdating(false), 2000);
    }
  };

  return (
    <CenteredContainer>
      <StyledPaper elevation={6}>
        <Grid container justifyContent="flex-end">
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} justifyContent="center" maxWidth="100%">
              <Grid item xs={12}>
                <Controller
                  name="content"
                  control={control}
                  rules={{
                    required: "Content is required",
                    minLength: { value: 10, message: "Minimum 10 characters required" },
                  }}
                  render={({ field }) => (
                    <TextField
                      label="Content"
                      {...field}
                      error={Boolean(errors.content)}
                      helperText={errors.content?.message}
                      multiline
                      rows={6}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Buttoncomponent text="Submit" type="submit" variant="contained" />
          </form>
        </Grid>
      </StyledPaper>
    </CenteredContainer>
  );
};

export default UpdateContent;