import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axiosInstancefile from "../../Utils/axiosinstanceform";
import CenteredContainer from "../form/common/centered container/centeredcontainer";
import Heading4 from "../form/common/button/button";
import { Button, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

const GetNotesByEmail = () => {
  const userData = JSON.parse(localStorage.getItem("userdata"));
  const email = userData ? userData.email : "anonymous@gmail.com";
  const [noteData, setNoteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const navigate = useNavigate();
  const ENDPOINT = "http://localhost:8000";
  const socketRef = useRef(null);

  useEffect(() => {
    // Establish socket connection
    socketRef.current = io(ENDPOINT, { transports: ["websocket"] });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected");
      setSocketConnected(true);
      if (userData) {
        socket.emit("setup", userData);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    // Handle updated notes event
    socket.on("noteUpdated", (updatedNotes) => {
      console.log("Received updated notes via socket:", updatedNotes);
      setNoteData(updatedNotes);
    });

    // (Optional) Debug message
    socket.on("hi", (message) => {
      console.log("Message from server:", message);
    });

    // return () => {
    //   socket.disconnect();
    //   socketRef.current = null;
    // };
  }, []);

  // Fetch initial notes only once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstancefile.post(`/showallnotes`, { email });
        if (response.data && Array.isArray(response.data.data)) {
          setNoteData(response.data.data);
        } else {
          setNoteData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  if (loading) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <main>
          <h2 style={{ textAlign: "center", color: "#00695f" }}>Loading your notes...</h2>
        </main>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <main>
          <h2 style={{ textAlign: "center", color: "#d32f2f" }}>Error: {error}</h2>
        </main>
      </ThemeProvider>
    );
  }

  const handleNoteClick = (title) => {
    navigate(`/updatecontent/${title}`);
  };

  return (
    <CenteredContainer>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <main>
          <Heading4
            text={"Your Notes"}
            variant={"h4"}
            style={{ color: "#00695f", textAlign: "center", fontSize: "1.5rem" }}
          />
          <div style={{ padding: "20px" }}>
            {noteData.length > 0 ? (
              noteData.map((note, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <Button
                    onClick={() => handleNoteClick(note.title)}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    style={{
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      display: "block",
                    }}
                  >
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography variant="h6" style={{ fontWeight: "bold" }}>
                          {note.title}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" style={{ fontStyle: "italic" }}>
                          Author: {note.author}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" style={{ marginTop: "10px" }}>
                          <strong>Content:</strong> {note.content}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Button>
                  <hr />
                </div>
              ))
            ) : (
              <p>No notes found.</p>
            )}
          </div>
        </main>
      </ThemeProvider>
    </CenteredContainer>
  );
};

export default GetNotesByEmail;
