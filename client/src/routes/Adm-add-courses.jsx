import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Input, Grid, Card } from '@mui/joy';
import { useAuth } from '../context/AuthContext';

function formatDate(dateString) {
  const date = new Date(dateString);

  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function AddCourse() {
  const { token } = useAuth();
  const [courseData, setCourseData] = useState({
    course_code: '',
    name: '',
    description: '',
    term: '',
    start_date: '',
    end_date: '',
    program_id: ''
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        throw new Error('Failed to add course');
      }

      const newCourse = await response.json();
      setCourses([...courses, newCourse]);
      setCourseData({
        course_code: '',
        name: '',
        description: '',
        term: '',
        start_date: '',
        end_date: '',
        program_id: ''
      });
      alert('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course');
    }
  };

  return (
    <Box sx={{ padding: '16px', maxWidth: '800px', margin: 'auto' }}>
      <Typography level="h1" sx={{ marginBottom: '16px' }}>Add New Course</Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Input
              type="text"
              name="course_code"
              placeholder="Course Code"
              value={courseData.course_code}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <Input
              type="text"
              name="name"
              placeholder="Course Name"
              value={courseData.name}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <Input
              type="text"
              name="term"
              placeholder="Term"
              value={courseData.term}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <Input
              type="date"
              name="start_date"
              value={courseData.start_date}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <Input
              type="date"
              name="end_date"
              value={courseData.end_date}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid xs={12}>
            <Input
              type="text"
              name="description"
              placeholder="Course Description"
              value={courseData.description}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid xs={12}>
            <Input
              type="number"
              name="program_id"
              placeholder="Program ID"
              value={courseData.program_id}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>

          <Grid xs={12}>
            <Button type="submit" fullWidth>
              Add Course
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography level="h2" sx={{ marginTop: '24px' }}>Existing Courses</Typography>
      {courses.length > 0 ? (
        <Grid container spacing={2}>
          {courses.map(course => (
            <Grid xs={12} key={course.id}>
              <Card variant="outlined" sx={{ padding: '16px' }}>
                <Typography level="h2">{course.course_code}: {course.name}</Typography>
                <Typography>{course.term} - {formatDate(course.start_date)} to {formatDate(course.end_date)}</Typography>
                <Typography>{course.description}</Typography>
                <Typography>Program ID: {course.program_id}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography level="body1" sx={{ marginTop: '16px' }}>No courses available.</Typography>
      )}
    </Box>
  );
}

export default AddCourse;