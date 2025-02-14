import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from '@mui/icons-material/People';
import { Link } from "react-router-dom";

const StyledItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#C6EDDB",
  ...theme.typography.body2,
  padding: theme.spacing(15),
  textAlign: "center",
  color: theme.palette.text.secondary,
  display: "flex",
  flexDirection: "column", 
  alignItems: "center",    
  justifyContent: "center", 
  height: "200px",   
  borderRadius: "30px",     
}));

function FormRow() {
  return (
    <React.Fragment>
      <Grid item xs={6}>
        <Link to="/signup/admin">
          <StyledItem>
            <AdminPanelSettingsIcon fontSize="large" style={{ fontSize: "80px" }}/>
            <span style={{ marginTop: "10px" }}>Sign up as Admin</span>
          </StyledItem>
        </Link>
      </Grid>
      <Grid item xs={6}> 
        <Link to="/signup/user">
          <StyledItem>
            <PeopleIcon fontSize="large" style={{ fontSize: "80px" }}/>
            <span style={{ marginTop: "10px" }}>Sign up as User</span>
          </StyledItem>
        </Link>
      </Grid>
    </React.Fragment>
  );
}

const Signupoptions = () => {
  return (
    <Box sx={{ flexGrow: 1, marginTop: "100px" }}>
      <Grid container spacing={1}>
        <Grid container item spacing={20}>
          <FormRow />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Signupoptions;
