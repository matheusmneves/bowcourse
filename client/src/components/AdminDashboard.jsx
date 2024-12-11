import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Button, Stack, Divider, Input } from '@mui/joy';

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [editCourseId, setEditCourseId] = useState(null);
  const [editProgramId, setEditProgramId] = useState(null);
  const [editedCourse, setEditedCourse] = useState({});
  const [editedProgram, setEditedProgram] = useState({});

  // Carregar cursos e programas do localStorage
  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
    const storedPrograms = JSON.parse(localStorage.getItem('programs')) || [];
    setCourses(storedCourses);
    setPrograms(storedPrograms);
  }, []);

  // Função para deletar um curso
  const handleDeleteCourse = (id) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
  };

  // Função para deletar um programa
  const handleDeleteProgram = (id) => {
    const updatedPrograms = programs.filter(program => program.id !== id);
    setPrograms(updatedPrograms);
    localStorage.setItem('programs', JSON.stringify(updatedPrograms));
  };

  // Função para editar um curso
  const handleEditCourse = (id) => {
    const course = courses.find(course => course.id === id);
    setEditedCourse(course);
    setEditCourseId(id);
  };

  // Função para editar um programa
  const handleEditProgram = (id) => {
    const program = programs.find(program => program.id === id);
    setEditedProgram(program);
    setEditProgramId(id);
  };

  // Função para salvar alterações do curso
  const handleSaveCourse = () => {
    const updatedCourses = courses.map(course => course.id === editCourseId ? editedCourse : course);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setEditCourseId(null);
  };

  // Função para salvar alterações do programa
  const handleSaveProgram = () => {
    const updatedPrograms = programs.map(program => program.id === editProgramId ? editedProgram : program);
    setPrograms(updatedPrograms);
    localStorage.setItem('programs', JSON.stringify(updatedPrograms));
    setEditProgramId(null);
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography level="h1" sx={{ marginBottom: '16px' }}>Admin Dashboard</Typography>

      {/* Gestão de Programas */}
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
                      value={editedProgram.name}
                      onChange={(e) => setEditedProgram({ ...editedProgram, name: e.target.value })}
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={editedProgram.description}
                      onChange={(e) => setEditedProgram({ ...editedProgram, description: e.target.value })}
                      sx={{ marginBottom: '8px' }}
                    />
                    <Button variant="solid" color="success" onClick={handleSaveProgram}>Save</Button>
                  </>
                ) : (
                  <>
                    <Typography level="h3" sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {program.name}
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
                  <Typography level="body2"><strong>Start Date:</strong> {program.startDate}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                  <Typography level="body2"><strong>End Date:</strong> {program.endDate}</Typography>
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

      {/* Gestão de Cursos */}
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
                      value={editedCourse.name}
                      onChange={(e) => setEditedCourse({ ...editedCourse, name: e.target.value })}
                      sx={{ marginBottom: '8px' }}
                    />
                    <Input
                      value={editedCourse.description}
                      onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
                      sx={{ marginBottom: '8px' }}
                    />
                    <Button variant="solid" color="success" onClick={handleSaveCourse}>Save</Button>
                  </>
                ) : (
                  <>
                    <Typography level="h3" sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {course.code}: {course.name}
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
                  <Typography level="body2"><strong>Start Date:</strong> {course.startDate}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                  <Typography level="body2"><strong>End Date:</strong> {course.endDate}</Typography>
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