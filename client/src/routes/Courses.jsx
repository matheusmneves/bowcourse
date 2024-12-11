import React, { useState, useEffect } from 'react';
import { Box, Typography, Input, Stack, Card, Divider, Grid } from '@mui/joy';
import api from '../api'; // Certifique-se de que o arquivo api.js está configurado corretamente

// Utility function to format dates into a user-friendly format
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Example: January 1, 2024
  return new Date(dateString).toLocaleDateString('en-CA', options);
};

function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses from the backend when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await api.get('/courses'); // Adjust the endpoint as per your backend
        setCourses(response.data); // Update state with API response
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Unable to load courses at this moment. Please try again later.');
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchCourses();
  }, []); // Dependency array ensures this runs only once when the component mounts

  // Filter courses based on search input
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading message while fetching data
  if (isLoading) {
    return (
      <Box sx={{ padding: '16px' }}>
        <Typography>Loading courses...</Typography>
      </Box>
    );
  }

  // Show error message if something goes wrong
  if (error) {
    return (
      <Box sx={{ padding: '16px' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography level="h1" sx={{ marginBottom: '16px' }}>Available Courses</Typography>

      <Input
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          padding: '8px',
          width: '100%',
          marginBottom: '16px',
        }}
      />

      {filteredCourses.length > 0 ? (
        <Grid container spacing={2}>
          {filteredCourses.map(course => (
            <Grid item xs={12} key={course.id}>
              <Card
                variant="outlined"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: '24px',
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <Box sx={{ flex: 1, paddingRight: '16px' }}>
                  <Typography level="h2" sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {course.course_code}: {course.name}
                  </Typography>
                  <Typography level="body-sm" sx={{ marginBottom: '8px' }}>
                    {course.description}
                  </Typography>
                </Box>

                <Divider orientation="vertical" flexItem />

                <Box sx={{ flex: 1, paddingLeft: '16px' }}>
                  <Stack direction="row" spacing={2}>
                    <Typography level="body2"><strong>Term:</strong> {course.term}</Typography>
                    <Typography level="body2"><strong>Start Date:</strong> {formatDate(course.start_date)}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                    <Typography level="body2"><strong>End Date:</strong> {formatDate(course.end_date)}</Typography>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No courses found.</Typography>
      )}
    </Box>
  );
}

export default Courses;