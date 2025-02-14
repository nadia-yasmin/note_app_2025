import React from "react";
import ReactDOM from "react-dom/client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Heading4 from "./common/button/button"
import Buttoncomponent from "./common/button/button"
import { TextField, Stack, Typography } from "@mui/material";
import useLoginHook from "../../customHooks/useloginhook";
import { Container, Paper, Avatar, Grid } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
  backgroundColor: "#F4FBF8",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
  [theme.breakpoints.up("md")]: {
    maxWidth: "50%",
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: "30%",
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
  height: "120vh",
  width: "120vh",
});
const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const { createLogin, successAlert, errorAlert, alertMessage,refresh } =
    useLoginHook();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPasword(e.target.value);
  };

  const onSubmit = (data) => {
    localStorage.clear();
    createLogin(data);
  };

  return (
   
    <CenteredContainer>
      <StyledPaper elevation={10}>
        <Avatar src="/broken-image.jpg" style={{ marginBottom: 16 }} />
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} justifyContent="center" maxWidth="100%">
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label="Email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      handleEmailChange(e);
                      field.onChange(e);
                    }}
                    style={{
                      border: errors.email ? "1px solid red" : "",
                    }}
                  />
                )}
              />
              {errors.email && (
                <Heading4 text={errors.email.message} variant={"h6"} />
              )}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  // Add your password vali
                }}
                render={({ field }) => (
                  <TextField
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      handlePasswordChange(e);
                      field.onChange(e);
                    }}
                    style={{
                      border: errors.password ? "1px solid red" : "",
                    }}
                  />
                )}
              />
              {errors.password && (
                <Heading4 text={errors.password.message} variant={"h6"} />
              )}
            </Grid>
          </Grid>
          <Buttoncomponent
            text={"Log in"}
            type={"submit"}
            variant={"contained"}
            style={{ marginTop: 16, backgroundColor: "#00695f" }}
          />
        </form>
        <Link
          to="/forgotpassword"
          style={{ textDecoration: "none" }}
          // onClick={() => handleForgotPasswordClick()}
        >
          <Typography
            variant="body2"
            color="primary"
            style={{ marginTop: 16, textAlign: "center" }}
          >
            Forgot Password?
          </Typography>
        </Link>
      </StyledPaper>
      {successAlert && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          {alertMessage}
        </Alert>
      )}
      {errorAlert && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {alertMessage}
        </Alert>
      )}
    </CenteredContainer>
  );
};

export default Login;
