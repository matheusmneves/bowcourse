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
        // Fetch registered program
        const registeredProgramResponse = await fetch(`http://localhost:5001/api/users/programs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (registeredProgramResponse.ok) {
          const program = await registeredProgramResponse.json();
          setMyProgram(program);
        }

        // Fetch all programs
        const availableProgramsResponse = await fetch('http://localhost:5001/api/programs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!availableProgramsResponse.ok) {
          throw new Error('Failed to fetch available programs');
        }

        const programs = await availableProgramsResponse.json();

        // Exclude the registered program from available programs
        const filteredPrograms = programs.filter((program) => program.id !== myProgram?.id);
        setAllPrograms(filteredPrograms);
      } catch (error) {
        console.error('Error fetching programs:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [user, token, myProgram]);

  const handleRegister = async (programId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/programs/subscribe/${programId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to register for the program');
      }

      const program = await response.json();
      setMyProgram(program.program); // Update the registered program

      // Update available programs
      setAllPrograms(allPrograms.filter((program) => program.id !== programId));

      alert('Successfully registered for the program');
    } catch (error) {
      console.error('Error registering for program:', error);
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