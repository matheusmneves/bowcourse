import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Stack, Divider } from '@mui/joy';
import { useAuth } from '../context/AuthContext';

function formatDate(dateString) {
    const date = new Date(dateString);
  
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

function AdmStudentList() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users/students', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography level="h1" sx={{ marginBottom: '16px' }}>
        Student List
      </Typography>
      {students.length > 0 ? (
        students.map((student) => (
          <Card
            key={student.id}
            variant="outlined"
            sx={{
              marginBottom: '24px',
              padding: '16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <Typography level="h2" sx={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              {student.first_name} {student.last_name}
            </Typography>
            <Typography level="body2"><strong>Email:</strong> {student.email}</Typography>
            <Typography level="body2"><strong>Program:</strong> {student.program_name || 'None'}</Typography>

            <Divider sx={{ marginY: '16px' }} />

            <Typography level="h3" sx={{ marginBottom: '8px' }}>Enrolled Courses:</Typography>
            {student.courses.length > 0 ? (
              student.courses.map((course) => (
                <Stack key={course.id} spacing={1} sx={{ marginBottom: '8px' }}>
                  <Typography level="body2"><strong>{course.course_code}:</strong> {course.name}</Typography>
                  <Typography level="body-sm">{course.description}</Typography>
                  <Typography level="body-sm"><strong>Term:</strong> {course.term}, <strong>Start:</strong> {formatDate(course.start_date)}, <strong>End:</strong> {formatDate(course.end_date)}</Typography>
                </Stack>
              ))
            ) : (
              <Typography>No courses enrolled</Typography>
            )}
          </Card>
        ))
      ) : (
        <Typography>No students found.</Typography>
      )}
    </Box>
  );
}

export default AdmStudentList;