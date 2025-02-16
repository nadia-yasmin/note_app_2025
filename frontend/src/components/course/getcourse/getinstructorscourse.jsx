// import toast from "react-toastify"
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axiosInstance";
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom"
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import { Toast } from "react-toastify/dist/components";
const Getinstructorscourse = () => {
    const showSuccessAlert = (message) => {
        Swal.fire({
          title: "Success",
          text: message,
          icon: "success",
        });
      };
    
      const showErrorAlert = (errorMessage) => {
        Swal.fire({
          title: "Error",
          html: errorMessage,
          icon: "error",
        });
      };
  const [courseData, setCourseData] = useState([]);
const navigate= useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = localStorage.getItem('userdata');
        if (!userDataString) {
          console.error("User data not found in local storage");
          return;
        }
        const userData = JSON.parse(userDataString);
        console.log("userData", userData._id);
        const response = await axiosInstance.post('/getinstructorscourse', {
          instructorId: userData._id,
        });
        if (!response.data.data) {
          showErrorAlert(response.data.message);
          return;
        }
        console.log("response",response)
        setCourseData(response.data.data.courses);
        console.log("response", response);
      } catch (error) {
        console.error("Error fetching data:", error);
        showErrorAlert(error.message)
      }
    };

    fetchData();
  }, []);

  const deleteCourse = async (courseId) => {
    try {

      const response = await axiosInstance.delete(`/deletecourse?courseId=${courseId}`,{ data: { courseId } });
      // toast.success(response.data);
      console.log("Course deleted successfully", response);
    } catch (error) {
      console.error("Could not delete course:", error);
    }
  };
  
  const handleDelete = (courseId) => {
    deleteCourse(courseId);
    console.log(`Delete clicked for course at index ${courseId}`);
  };
  
  const handleEdit = (courseId) => {
    navigate(`/updatecourse/${courseId}`)
    console.log(`Edit clicked for course at index ${courseId}`);
  };

  const handleAddCourse = () => {
   navigate("/addcourse")
  };
  
  const handleAddLesson = (courseId) => {
    navigate(`/addlesson/${courseId}`)
   };
   const handleShowLesson = (courseId) => {
    navigate( `/instructorlessons/${courseId}`)
   };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', marginBottom: "800px" }}>
      <Typography variant="h4" component="div" gutterBottom>
        Courses
      </Typography>
      {courseData ? (
      <div style={{ position: 'relative' }}>
        <List dense sx={{ width: '100%', maxWidth: 800, border: '1px solid #ddd', borderRadius: '8px' }}>
          {courseData.map((course, index) => {
            const labelId = `list-item-label-${index}`;
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar alt={`Avatar for ${course.title}`} src={course.image} />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={course.title} />
                  <IconButton onClick={() => handleDelete(course._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(course._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleAddLesson(course._id)}>
                    <AddIcon />
                  </IconButton>
                  {/* Link to navigate to /instructorlessons with courseId as a query parameter */}
                  {/* <Link to={`/instructorlessons?courseId=${course._id}`}> */}
                    <IconButton onClick={() => handleShowLesson(course._id)}>
                      <ArrowForwardIcon />
                    </IconButton>
                  {/* </Link> */}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <IconButton sx={{ position: 'absolute', top: '0px', right: '5px', marginTop: '-40px' }} onClick={handleAddCourse}>
          <AddIcon />
        </IconButton>
      </div>): (
      <Typography variant="body1" gutterBottom>
        Your login has expired. Please log in again.
      </Typography>
    )}
    </Container>
  );
};

export default Getinstructorscourse;
