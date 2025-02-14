import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import Buttoncomponent from "./common/button/button";
import { TextField } from "@mui/material";
import useCreateNotehook from "../../customHooks/useCreateNotehook";
import { Paper, Avatar, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
const StyledPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
    backgroundColor: "#F4FBF8",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "90%",  
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: "70%", 
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: "50%",
    },
    avatar: {
      margin: theme.spacing(2),
      backgroundColor: "white",
    },
  }));
const CenteredContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "90vh",
});
const Notewriting = () => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        mode: "onChange",
        defaultValues: {
          Title: "", 
          content: "", 
        }
      });
  const { createNote } = useCreateNotehook();
  const onSubmit = (data) => {
    console.log("data is ", data);
    createNote(data);
  };
  return (
    <CenteredContainer>
      <StyledPaper elevation={6}>
      <Grid container justifyContent="flex-end">
  <EditCalendarIcon fontSize="large" style={{ fontSize: "30px" }} />
</Grid>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <Grid container spacing={3} justifyContent="center" maxWidth="100%">
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: "Title is required",
                  pattern: {
                    value: /^[A-Za-z0-9!?'".]*$/, 
                    message: "Title must contain alphabets and allowed special characters: ! ? ' \" .",
                  }
                }}
                render={({ field }) => (
                  <TextField
                    label="Title"
                    type="title"
                    placeholder="Enter a title"
                    {...field}
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>
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

export default Notewriting;
