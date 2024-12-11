import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Button, Stack, Divider, Input } from '@mui/joy';

function AdmAddPrograms() {
  const [programData, setProgramData] = useState({
    name: '',
    description: '',
    duration: '',
    term: '',
    startDate: '',
    endDate: '',
    feesDomestic: '',
    feesInternational: ''
  });
  
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const storedPrograms = JSON.parse(localStorage.getItem('programs')) || [];
    setPrograms(storedPrograms);
  }, []);

  const handleChange = (e) => {
    setProgramData({ ...programData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedPrograms = [...programs, { ...programData, id: programs.length + 1 }];
    setPrograms(updatedPrograms);
    localStorage.setItem('programs', JSON.stringify(updatedPrograms));

    setProgramData({
      name: '',
      description: '',
      duration: '',
      term: '',
      startDate: '',
      endDate: '',
      feesDomestic: '',
      feesInternational: ''
    });

    alert('Program added successfully!');
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography level="h1" sx={{ marginBottom: '16px' }}>Add New Program</Typography>
      <form onSubmit={handleSubmit}>
        <Card sx={{ padding: '16px', marginBottom: '24px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <Stack spacing={2}>
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
              name="duration"
              placeholder="Duration (e.g. 2 years)"
              value={programData.duration}
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
              name="startDate"
              placeholder="Start Date"
              value={programData.startDate}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              type="date"
              name="endDate"
              placeholder="End Date"
              value={programData.endDate}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              type="number"
              name="feesDomestic"
              placeholder="Fees for Domestic Students (CAD)"
              value={programData.feesDomestic}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              type="number"
              name="feesInternational"
              placeholder="Fees for International Students (CAD)"
              value={programData.feesInternational}
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

      {/* Exibição de programas adicionados */}
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
                {program.name}
              </Typography>
              <Typography level="body-sm" sx={{ marginBottom: '8px' }}>
                {program.description}
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box sx={{ flex: 1, paddingLeft: '16px' }}>
              <Stack direction="row" spacing={2}>
                <Typography level="body2"><strong>Duration:</strong> {program.duration}</Typography>
                <Typography level="body2"><strong>Term:</strong> {program.term}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                <Typography level="body2"><strong>Start Date:</strong> {program.startDate}</Typography>
                <Typography level="body2"><strong>End Date:</strong> {program.endDate}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                <Typography level="body2"><strong>Fees Domestic:</strong> {program.feesDomestic}</Typography>
                <Typography level="body2"><strong>Fees International:</strong> {program.feesInternational}</Typography>
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