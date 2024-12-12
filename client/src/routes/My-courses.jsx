import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Button } from '@mui/joy';
import { useAuth } from '../context/AuthContext';

function MyCourses() {
  const { user, token } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      setError('User or token is not available');
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      try {
        // Fetch user's registered courses
        const myCoursesResponse = await fetch('http://localhost:5001/api/users/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });

        let myCoursesData = [];
        if (myCoursesResponse.ok) {
          myCoursesData = await myCoursesResponse.json();
          setMyCourses(myCoursesData);
        }

        // Fetch available courses, optionally filtered by the user's program
        const allCoursesUrl = user.program_id
          ? `http://localhost:5001/api/courses?programId=${user.program_id}`
          : 'http://localhost:5001/api/courses';

        const allCoursesResponse = await fetch(allCoursesUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!allCoursesResponse.ok) {
          throw new Error('Failed to fetch available courses');
        }

        const allCoursesData = await allCoursesResponse.json();

        // Filter out courses the user is already registered for
        const availableCourses = allCoursesData.filter(
          (course) => !myCoursesData.some((registered) => registered.id === course.id)
        );

        setAllCourses(availableCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, token]);

  const handleRegister = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/courses/subscribe/${courseId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        // After subscribing, refetch the user's registered courses to update the state
        const updatedCoursesResponse = await fetch('http://localhost:5001/api/users/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!updatedCoursesResponse.ok) {
          throw new Error('Failed to fetch updated registered courses');
        }

        const updatedCoursesData = await updatedCoursesResponse.json();
        setMyCourses(updatedCoursesData);

        // Remove the subscribed course from the available courses
        setAllCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));

        alert('Successfully registered for the course');
      } else {
        alert('Failed to register for the course');
      }
    } catch (error) {
      console.error('Error registering for the course:', error);
      alert('Failed to register for the course');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography level="h1">My Courses</Typography>

      <Typography level="h2">Registered Courses</Typography>
      {myCourses.length > 0 ? (
        myCourses.map((course) => (
          <Card key={course.id} variant="outlined" sx={{ marginBottom: '16px' }}>
            <Typography level="h2">{course.name}</Typography>
            <Typography>{course.description}</Typography>
          </Card>
        ))
      ) : (
        <Typography>No courses registered yet.</Typography>
      )}

      <Typography level="h2" sx={{ marginTop: '24px' }}>Available Courses</Typography>
      {allCourses.length > 0 ? (
        allCourses.map((course) => (
          <Card key={course.id} variant="outlined" sx={{ marginBottom: '16px' }}>
            <Typography level="h2">{course.name}</Typography>
            <Typography>{course.description}</Typography>
            <Button onClick={() => handleRegister(course.id)} variant="solid">
              Register
            </Button>
          </Card>
        ))
      ) : (
        <Typography>No available courses</Typography>
      )}
    </Box>
  );
}

export default MyCourses;