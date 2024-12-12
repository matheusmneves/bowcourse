import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Button } from '@mui/joy';
import { useAuth } from '../context/AuthContext';

function MyPrograms() {
  const { user, token } = useAuth();
  const [allPrograms, setAllPrograms] = useState([]);
  const [myProgram, setMyProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      setError('User or token is not available');
      setLoading(false);
      return;
    }

    const fetchPrograms = async () => {
      try {
        // Fetch the currently registered program(s)
        const registeredProgramResponse = await fetch('http://localhost:5001/api/users/programs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        let registeredProgramData = null;
        if (registeredProgramResponse.ok) {
          const data = await registeredProgramResponse.json();
          // Handle the possibility that 'data' might be an array
          if (Array.isArray(data)) {
            if (data.length > 0) {
              registeredProgramData = data[0]; // Take the first program if array is not empty
            } else {
              registeredProgramData = null; // No programs registered
            }
          } else {
            // If data is not an array, assume it's a single object or null
            registeredProgramData = data || null;
          }
        }

        // Fetch all available programs
        const availableProgramsResponse = await fetch('http://localhost:5001/api/programs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!availableProgramsResponse.ok) {
          throw new Error('Failed to fetch available programs');
        }

        const programs = await availableProgramsResponse.json();

        // Filter out the currently registered program if one exists
        const filteredPrograms = registeredProgramData
          ? programs.filter((p) => p.id !== registeredProgramData.id)
          : programs;

        setMyProgram(registeredProgramData);
        setAllPrograms(filteredPrograms);
      } catch (error) {
        console.error('Error fetching programs:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [user, token]);

  const handleRegister = async (programId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/programs/subscribe/${programId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to register for the program');
      }

      const data = await response.json();
      const newRegisteredProgram = data.program;
      setMyProgram(newRegisteredProgram);

      // Update the available programs list by removing the just subscribed program
      setAllPrograms((prevPrograms) => prevPrograms.filter((p) => p.id !== newRegisteredProgram.id));

      alert('Successfully registered for the program');
    } catch (error) {
      console.error('Error registering for the program:', error);
      alert('Failed to register for the program');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography level="h1">My Programs</Typography>

      <Typography level="h2">Registered Program</Typography>
      {myProgram ? (
        <Card variant="outlined" sx={{ marginBottom: '16px' }}>
          <Typography level="h2">{myProgram.name}</Typography>
          <Typography>{myProgram.description}</Typography>
        </Card>
      ) : (
        <Typography>No program registered yet.</Typography>
      )}

      <Typography level="h2" sx={{ marginTop: '24px' }}>Available Programs</Typography>
      {allPrograms.length > 0 ? (
        allPrograms.map((program) => (
          <Card key={program.id} variant="outlined" sx={{ marginBottom: '16px' }}>
            <Typography level="h2">{program.name}</Typography>
            <Typography>{program.description}</Typography>
            <Button onClick={() => handleRegister(program.id)} variant="solid">
              Register
            </Button>
          </Card>
        ))
      ) : (
        <Typography>No available programs</Typography>
      )}
    </Box>
  );
}

export default MyPrograms;