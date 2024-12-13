import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Button, Stack, Divider, Input } from '@mui/joy';
import { useAuth } from '../context/AuthContext';

function formatDate(dateString) {
  const date = new Date(dateString);

  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function AdminDashboard() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [editCourseId, setEditCourseId] = useState(null);
  const [editProgramId, setEditProgramId] = useState(null);
  const [editedCourse, setEditedCourse] = useState({});
  const [editedProgram, setEditedProgram] = useState({});

  useEffect(() => {
    fetchPrograms();
    fetchCourses();
  }, [token]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/programs');
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Delete Program
  const handleDeleteProgram = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/programs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setPrograms(programs.filter(p => p.id !== id));
      } else {
        console.error('Failed to delete program');
      }
    } catch (err) {
      console.error('Error deleting program:', err);
    }
  };

  // Edit Program
  const handleEditProgram = (id) => {
    const program = programs.find(p => p.id === id);
    setEditedProgram(program);
    setEditProgramId(id);
  };

  const handleSaveProgram = async () => {
    const { program_code, name, description, term, start_date, end_date, fees, id } = editedProgram;
    try {
      const response = await fetch(`http://localhost:5001/api/programs/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ program_code, name, description, term, start_date, end_date, fees })
      });

      if (response.ok) {
        const updated = await response.json();
        setPrograms(programs.map(p => p.id === id ? updated : p));
        setEditProgramId(null);
      } else {
        console.error('Failed to update program');
      }
    } catch (err) {
      console.error('Error updating program:', err);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setCourses(courses.filter(c => c.id !== id));
      } else {
        console.error('Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  // Edit Course
  const handleEditCourse = (id) => {
    const course = courses.find(c => c.id === id);
    setEditedCourse(course);
    setEditCourseId(id);
  };

  const handleSaveCourse = async () => {
    const { course_code, name, description, term, start_date, end_date, program_id, id } = editedCourse;
    try {
      const response = await fetch(`http://localhost:5001/api/courses/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ course_code, name, description, term, start_date, end_date, program_id })
      });

      if (response.ok) {
        const updated = await response.json();
        setCourses(courses.map(c => c.id === id ? updated : c));
        setEditCourseId(null);
      } else {
        console.error('Failed to update course');
      }
    } catch (err) {
      console.error('Error updating course:', err);
    }
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography level="h1" sx={{ marginBottom: '16px' }}>Admin Dashboard</Typography>

      {/* Programs Section */}
      <Box sx={{ marginBottom: '24px' }}>
        <Typography level="h2" sx={{ marginBottom: '16px' }}>Manage Programs</Typography>
        {programs.length > 0 ? (
          programs.map((program) => (
            <Card
              key={program.id}
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
                {editProgramId === program.id ? (
                  <>
                    <Input
                      value={editedProgram.program_code || ''}
                      onChange={(e) => setEditedProgram({ ...editedProgram, program_code: e.target.value })}
                      placeholder="Program Code"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={editedProgram.name || ''}
                      onChange={(e) => setEditedProgram({ ...editedProgram, name: e.target.value })}
                      placeholder="Name"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={editedProgram.description || ''}
                      onChange={(e) => setEditedProgram({ ...editedProgram, description: e.target.value })}
                      placeholder="Description"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={editedProgram.term || ''}
                      onChange={(e) => setEditedProgram({ ...editedProgram, term: e.target.value })}
                      placeholder="Term"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      type="date"
                      value={editedProgram.start_date || ''}
                      onChange={(e) => setEditedProgram({ ...editedProgram, start_date: e.target.value })}
                      placeholder="Start Date"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      type="date"
                      value={editedProgram.end_date || ''}
                      onChange={(e) => setEditedProgram({ ...editedProgram, end_date: e.target.value })}
                      placeholder="End Date"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      type="number"
                      value={editedProgram.fees || ''}
                      onChange={(e) => setEditedProgram({ ...editedProgram, fees: e.target.value })}
                      placeholder="Fees"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Button variant="solid" color="success" onClick={handleSaveProgram}>Save</Button>
                  </>
                ) : (
                  <>
                    <Typography level="h3" sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {program.program_code} - {program.name}
                    </Typography>
                    <Typography level="body-sm" sx={{ marginBottom: '8px' }}>
                      {program.description}
                    </Typography>
                    <Button variant="solid" onClick={() => handleEditProgram(program.id)}>Edit</Button>
                  </>
                )}
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ flex: 1, paddingLeft: '16px' }}>
                <Stack direction="row" spacing={2}>
                  <Typography level="body2"><strong>Term:</strong> {program.term}</Typography>
                  <Typography level="body2"><strong>Start Date:</strong> {formatDate(program.start_date)}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                  <Typography level="body2"><strong>End Date:</strong> {formatDate(program.end_date)}</Typography>
                  <Typography level="body2"><strong>Fees:</strong> {program.fees}</Typography>
                </Stack>
                <Button
                  variant="solid"
                  color="danger"
                  onClick={() => handleDeleteProgram(program.id)}
                  sx={{ marginTop: '16px' }}
                >
                  Delete Program
                </Button>
              </Box>
            </Card>
          ))
        ) : (
          <Typography>No programs available</Typography>
        )}
      </Box>

      <Divider />

      {/* Courses Section */}
      <Box sx={{ marginTop: '24px' }}>
        <Typography level="h2" sx={{ marginBottom: '16px' }}>Manage Courses</Typography>
        {courses.length > 0 ? (
          courses.map((course) => (
            <Card
              key={course.id}
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
                {editCourseId === course.id ? (
                  <>
                    <Input
                      value={editedCourse.course_code || ''}
                      onChange={(e) => setEditedCourse({ ...editedCourse, course_code: e.target.value })}
                      placeholder="Course Code"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={editedCourse.name || ''}
                      onChange={(e) => setEditedCourse({ ...editedCourse, name: e.target.value })}
                      placeholder="Name"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={editedCourse.description || ''}
                      onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
                      placeholder="Description"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={editedCourse.term || ''}
                      onChange={(e) => setEditedCourse({ ...editedCourse, term: e.target.value })}
                      placeholder="Term"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      type="date"
                      value={editedCourse.start_date || ''}
                      onChange={(e) => setEditedCourse({ ...editedCourse, start_date: e.target.value })}
                      placeholder="Start Date"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      type="date"
                      value={editedCourse.end_date || ''}
                      onChange={(e) => setEditedCourse({ ...editedCourse, end_date: e.target.value })}
                      placeholder="End Date"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      type="number"
                      value={editedCourse.program_id || ''}
                      onChange={(e) => setEditedCourse({ ...editedCourse, program_id: e.target.value })}
                      placeholder="Program ID"
                      sx={{ marginBottom: '8px' }}
                    />
                    <Button variant="solid" color="success" onClick={handleSaveCourse}>Save</Button>
                  </>
                ) : (
                  <>
                    <Typography level="h3" sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {course.course_code}: {course.name}
                    </Typography>
                    <Typography level="body-sm" sx={{ marginBottom: '8px' }}>
                      {course.description}
                    </Typography>
                    <Button variant="solid" onClick={() => handleEditCourse(course.id)}>Edit</Button>
                  </>
                )}
              </Box>

              <Divider orientation="vertical" flexItem />

              <Box sx={{ flex: 1, paddingLeft: '16px' }}>
                <Stack direction="row" spacing={2}>
                  <Typography level="body2"><strong>Term:</strong> {course.term}</Typography>
                  <Typography level="body2"><strong>Start Date:</strong> {formatDate(course.start_date)}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                  <Typography level="body2"><strong>End Date:</strong> {formatDate(course.end_date)}</Typography>
                  <Typography level="body2"><strong>Program ID:</strong> {course.program_id}</Typography>
                </Stack>
                <Button
                  variant="solid"
                  color="danger"
                  onClick={() => handleDeleteCourse(course.id)}
                  sx={{ marginTop: '16px' }}
                >
                  Delete Course
                </Button>
              </Box>
            </Card>
          ))
        ) : (
          <Typography>No courses available</Typography>
        )}
      </Box>
    </Box>
  );
}

export default AdminDashboard;