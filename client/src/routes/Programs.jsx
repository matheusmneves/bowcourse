import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, Card, Divider } from '@mui/joy';
import api from '../api'; // Make sure the `api.js` file is correctly configured

// Utility function to format currency values
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value);
};

// Utility function to format dates into a user-friendly format (e.g., DD/MM/YYYY)
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }; // Example: January 1, 2024
  return new Date(dateString).toLocaleDateString('en-CA', options);
};

function Programs() {
  // State to store program data
  const [programsData, setProgramsData] = useState([]);
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to handle errors
  const [error, setError] = useState(null);

  // Fetch programs from the backend when the component is mounted
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await api.get('/programs'); // Adjust the endpoint as per your backend
        setProgramsData(response.data); // Update the state with API response
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Unable to load programs at this moment. Please try again later.');
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchPrograms();
  }, []); // Dependency array ensures this runs only on component mount

  // Show loading message while fetching data
  if (isLoading) {
    return (
      <Box sx={{ padding: '16px' }}>
        <Typography>Loading programs...</Typography>
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

  // Render the list of programs
  return (
    <Box sx={{ padding: '16px' }}>
      <Typography level="h1" sx={{ marginBottom: '16px' }}>Available Programs</Typography>

      {programsData.length > 0 ? (
        programsData.map((program) => (
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
                <Typography level="body2"><strong>Term:</strong> {program.term}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                <Typography level="body2"><strong>Start Date:</strong> {formatDate(program.start_date)}</Typography>
                <Typography level="body2"><strong>End Date:</strong> {formatDate(program.end_date)}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                <Typography level="body2"><strong>Fees:</strong> {formatCurrency(program.fees)}</Typography>
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

export default Programs;