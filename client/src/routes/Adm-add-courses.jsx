import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Input, Grid, Card } from '@mui/joy';

function AddCourse() {
  const [courseData, setCourseData] = useState({
    name: '',
    code: '',
    term: '',
    startDate: '',
    endDate: '',
    description: '', // Campo de descrição
  });
  const [courses, setCourses] = useState([]);

  // Carrega os cursos existentes no localStorage ao montar o componente
  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
    setCourses(storedCourses);
  }, []);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica se o curso já existe pelo código
    const courseExists = courses.find(course => course.code === courseData.code);
    if (courseExists) {
      alert('A course with this code already exists.');
      return;
    }

    // Adiciona o novo curso e salva no localStorage
    const updatedCourses = [...courses, { ...courseData, id: Date.now() }];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));

    // Limpa o formulário após a submissão
    setCourseData({
      name: '',
      code: '',
      term: '',
      startDate: '',
      endDate: '',
      description: '', // Limpa o campo de descrição
    });

    alert('Course added successfully!');
  };

  return (
    <Box sx={{ padding: '16px', maxWidth: '800px', margin: 'auto' }}>
      <Typography level="h1" sx={{ marginBottom: '16px' }}>Add New Course</Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Input
              type="text"
              name="code"
              placeholder="Course Code"
              value={courseData.code}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
            <Input
              type="date"
              name="startDate"
              value={courseData.startDate}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Input
              type="date"
              name="endDate"
              value={courseData.endDate}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
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

          <Grid item xs={12}>
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
            <Grid item xs={12} key={course.id}>
              <Card variant="outlined" sx={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography level="h2">{course.code}: {course.name}</Typography>
                  <Typography>{course.term} - {course.startDate} to {course.endDate}</Typography>
                  <Typography>{course.description}</Typography> {/* Exibe a descrição */}
                </Box>
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