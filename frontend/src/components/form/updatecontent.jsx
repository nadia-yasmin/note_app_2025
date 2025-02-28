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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ENDPOINT="http://localhost:5000";
var socket, selectedNoteCompare;

const UpdateContent = () => {
  const userData = JSON.parse(localStorage.getItem("userdata"));
  const navigate = useNavigate();
  const { title } = useParams();
  const [note, setNote] = useState(null);
  const { control, handleSubmit, formState: { errors }, setValue } = useForm();
  const [isUpdating, setIsUpdating] = useState(false); 
  const [socketConnected, setSocketConnected] = useState(false); 

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
}, []); 

// useEffect(() => {
//  socket= io(ENDPOINT);
//  socket.emit("setup",userData);
//  socket.on("connection",()=>{setSocketConnected(true)})

// }, []); 

  const onSubmit = async (data) => {
    try {
      setIsUpdating(true); 
      const response = await axiosInstancefile.put(`/updatenote`, { title, content: data.content });

      if (response.data) {
        setNote(response.data.savedNote);
        setValue("content", response.data.savedNote.content);
        socket.emit("noteUpdated", { title, content: data.content });
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/showallnotes");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Update failed");
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
