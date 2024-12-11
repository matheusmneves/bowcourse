// src/pages/Profile.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Stack } from '@mui/joy';

function Profile() {
  const { user } = useAuth();

  const localUsers = JSON.parse(localStorage.getItem('users')) || [];
  
  const loggedInUser = localUsers.find((u) => u.username === user?.username);

  return (
    <Box sx={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
      <Typography level="h1" sx={{ marginBottom: '16px' }}>
        Profile
      </Typography>

      {user && user.role === 'student' && loggedInUser ? (
        <Stack spacing={2}>
          <Typography level="body1">
            <strong>Name:</strong> {loggedInUser.firstName} {loggedInUser.lastName}
          </Typography>
          <Typography level="body1">
            <strong>Email:</strong> {loggedInUser.email}
          </Typography>
          <Typography level="body1">
            <strong>Phone:</strong> {loggedInUser.phone}
          </Typography>
          <Typography level="body1">
            <strong>Birthday:</strong> {loggedInUser.birthday}
          </Typography>
          <Typography level="body1">
            <strong>Department:</strong> {loggedInUser.department}
          </Typography>
          <Typography level="body1">
            <strong>Program:</strong> {loggedInUser.program}
          </Typography>
        </Stack>
      ) : (
        <Typography level="body1">
          You need to be logged in as a student to view this page.
        </Typography>
      )}
    </Box>
  );
}

export default Profile;