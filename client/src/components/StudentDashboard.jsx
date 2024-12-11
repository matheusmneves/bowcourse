import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Card, Button } from '@mui/joy';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function StudentDashboard() {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [registeredProgram, setRegisteredProgram] = useState(null);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      let programError = false;
      let courseError = false;

      try {
        // Fetch registered program
        const programResponse = await api.get('/users/programs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (programResponse.data) {
          setRegisteredProgram(programResponse.data);
        }
      } catch (err) {
        console.error('Error fetching program:', err);
        programError = true;
      }

      try {
        // Fetch registered courses
        const coursesResponse = await api.get('/users/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (coursesResponse.data) {
          setRegisteredCourses(coursesResponse.data);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        courseError = true;
      }

      if (programError && courseError) {
        setError('Failed to load your registered data. Please try again later.');
      }
    };

    fetchData();
  }, [token]);

  const handleRemoveProgram = async (programId) => {
    try {
      await api.delete(`/programs/unsubscribe/${programId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegisteredProgram(null);
    } catch (err) {
      console.error('Error removing program:', err);
      setError('Failed to remove the program. Please try again later.');
    }
  };

  const handleRemoveCourse = async (courseId) => {
    try {
      await api.delete(`/courses/unsubscribe/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegisteredCourses((prev) => prev.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error('Error removing course:', err);
      setError('Failed to remove the course. Please try again later.');
    }
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography level="h1">Student Dashboard</Typography>

      {/* Registered Program */}
      <Card variant="outlined" sx={{ padding: '16px', marginBottom: '24px' }}>
        <Typography level="h2">Registered Program</Typography>
        {registeredProgram ? (
          <Box>
            <Typography><strong>Code:</strong> {registeredProgram.program_code}</Typography>
            <Typography><strong>Name:</strong> {registeredProgram.name}</Typography>
            <Typography><strong>Description:</strong> {registeredProgram.description}</Typography>
            <Button
              variant="soft"
              color="danger"
              sx={{ marginTop: '8px' }}
              onClick={() => handleRemoveProgram(registeredProgram.id)}
            >
              Remove Program
            </Button>
          </Box>
        ) : (
          <Typography>No program registered yet.</Typography>
        )}
      </Card>

      {/* Registered Courses */}
      <Card variant="outlined" sx={{ padding: '16px', marginBottom: '24px' }}>
        <Typography level="h2">Registered Courses</Typography>
        {registeredCourses.length > 0 ? (
          <Stack spacing={2}>
            {registeredCourses.map((course) => (
              <Box key={course.id}>
                <Typography><strong>Code:</strong> {course.course_code}</Typography>
                <Typography><strong>Name:</strong> {course.name}</Typography>
                <Typography><strong>Description:</strong> {course.description}</Typography>
                <Button
                  variant="soft"
                  color="danger"
                  onClick={() => handleRemoveCourse(course.id)}
                >
                  Remove Course
                </Button>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography>No courses registered yet.</Typography>
        )}
      </Card>
    </Box>
  );
}

export default StudentDashboard;