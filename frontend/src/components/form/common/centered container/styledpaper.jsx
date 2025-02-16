import { styled } from "@mui/material/styles";
import { Paper, Avatar, Grid } from "@mui/material";
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
  export default StyledPaper;