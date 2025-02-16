import * as React from "react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Buttoncomponent from "./common/button/button";
import { TextField } from "@mui/material";
import axiosInstancefile from "../../Utils/axiosinstanceform";
import { Paper, Avatar, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import io from 'socket.io-client';
import StyledPaper from "./common/centered container/styledpaper";
import CenteredContainer from "./common/centered container/centeredcontainer";

const UpdateContent = () => {
  const { title } = useParams();
  const [note, setNote] = useState(null);
  const socket = io('http://localhost:8000');
  const { control, handleSubmit, formState: { errors }, setValue } = useForm();
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axiosInstancefile.get(`/note/shownotebytitle?title=${title}`);
        if (response.data) {
          setNote(response.data[0]); 
          setValue("content", response.data[0].content); 
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };
    fetchNote();

    socket.on('noteUpdated', (updatedNote) => {
      console.log('Note updated in real-time:', updatedNote);
      setNote(updatedNote);  
      setValue("content", updatedNote.content); 
    });
    return () => {
      socket.off('noteUpdated');
    };
  }, [title, setValue]); 
  const onSubmit = async (data) => {
    try {
      const response = await axiosInstancefile.put(`/updatenote`, { title, content: data.content });
      console.log("Response:", response);
      if (response.data) {
        socket.emit('noteUpdated', response.data.savedNote);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <CenteredContainer>
      <StyledPaper elevation={6}>
        <Grid container justifyContent="flex-end">
          <EditCalendarIcon fontSize="large" style={{ fontSize: "30px" }} />
        </Grid>

        <form noValidate onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Grid container spacing={3} justifyContent="center" maxWidth="100%">
            <Grid item xs={12}>
              <Controller
                name="content"
                control={control}
                rules={{
                  required: "Content is required",
                  minLength: {
                    value: 10,
                    message: "Content must be at least 10 characters long",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label="Content"
                    type="text"
                    placeholder="Enter your content"
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
          <Buttoncomponent
            text={"Submit"}
            type={"submit"}
            variant={"contained"}
            style={{ marginTop: 16, backgroundColor: "#00695f" }}
          />
        </form>
      </StyledPaper>
    </CenteredContainer>
  );
};

export default UpdateContent;
