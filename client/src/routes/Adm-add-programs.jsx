import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Button, Stack, Divider, Input } from '@mui/joy';
import { useAuth } from '../context/AuthContext';

function formatDate(dateString) {
  const date = new Date(dateString);

  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function AdmAddPrograms() {
  const { token } = useAuth();
  const [programData, setProgramData] = useState({
    program_code: '',
    name: '',
    description: '',
    term: '',
    start_date: '',
    end_date: '',
    fees: ''
  });
  
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetchPrograms();
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

  const handleChange = (e) => {
    setProgramData({ ...programData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(programData)
      });

      if (!response.ok) {
        throw new Error('Failed to add program');
      }

      const newProgram = await response.json();
      setPrograms([...programs, newProgram]);
      setProgramData({
        program_code: '',
        name: '',
        description: '',
        term: '',
        start_date: '',
        end_date: '',
        fees: ''
      });

      alert('Program added successfully!');
    } catch (error) {
      console.error('Error adding program:', error);
      alert('Failed to add program');
    }
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography level="h1" sx={{ marginBottom: '16px' }}>Add New Program</Typography>
      <form onSubmit={handleSubmit}>
        <Card sx={{ padding: '16px', marginBottom: '24px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <Stack spacing={2}>
            <Input
              type="text"
              name="program_code"
              placeholder="Program Code"
              value={programData.program_code}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              type="text"
              name="name"
              placeholder="Program Name"
              value={programData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              type="text"
              name="description"
              placeholder="Program Description"
              value={programData.description}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              type="text"
              name="term"
              placeholder="Term (e.g. Winter)"
              value={programData.term}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              type="date"
              name="start_date"
              placeholder="Start Date"
              value={programData.start_date}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              type="date"
              name="end_date"
              placeholder="End Date"
              value={programData.end_date}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              type="number"
              name="fees"
              placeholder="Fees (CAD)"
              value={programData.fees}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button type="submit" variant="solid" fullWidth>
              Add Program
            </Button>
          </Stack>
        </Card>
      </form>

      <Typography level="h2" sx={{ marginBottom: '16px' }}>Added Programs</Typography>
      {programs.length > 0 ? (
        programs.map((program, index) => (
          <Card
            key={index}
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
                {program.program_code} - {program.name}
              </Typography>
              <Typography level="body-sm" sx={{ marginBottom: '8px' }}>
                {program.description}
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box sx={{ flex: 1, paddingLeft: '16px' }}>
              <Stack direction="row" spacing={2}>
                <Typography level="body2"><strong>Term:</strong> {program.term}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                <Typography level="body2"><strong>Start Date:</strong> {formatDate(program.start_date)}</Typography>
                <Typography level="body2"><strong>End Date:</strong> {formatDate(program.end_date)}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                <Typography level="body2"><strong>Fees:</strong> {program.fees}</Typography>
              </Stack>
            </Box>
          </Card>
        ))
      ) : (
        <Typography>No programs available</Typography>
      )}
    </Box>
  );
}

export default AdmAddPrograms;