import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Stack } from '@mui/joy';

function formatBirthday(dateString) {
  const date = new Date(dateString);

  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function Profile() {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the logged-in user's profile data once the component mounts
    const fetchProfile = async () => {
      if (!user || user.role !== 'student' || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        // Parse the JSON response
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, token]);

  if (loading) return <Typography>Loading profile...</Typography>;

  if (!user || user.role !== 'student') {
    return (
      <Box sx={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
        <Typography level="h1" sx={{ marginBottom: '16px' }}>
          Profile
        </Typography>
        <Typography level="body1">
          You need to be logged in as a student to view this page.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
        <Typography level="h1" sx={{ marginBottom: '16px' }}>
          Profile
        </Typography>
        <Typography level="body1" color="danger">
          {error}
        </Typography>
      </Box>
    );
  }

  // If we have profile data, display it
  return (
    <Box sx={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
      <Typography level="h1" sx={{ marginBottom: '16px' }}>
        Profile
      </Typography>

      {profileData ? (
        <Stack spacing={2}>
          {/* Displaying each piece of information about the user */}
          <Typography level="body1">
            <strong>Name:</strong> {profileData.firstName} {profileData.lastName}
          </Typography>
          <Typography level="body1">
            <strong>Email:</strong> {profileData.email}
          </Typography>
          <Typography level="body1">
            <strong>Phone:</strong> {profileData.phone}
          </Typography>
          <Typography level="body1">
            <strong>Birthday:</strong> {formatBirthday(profileData.birthday)}
          </Typography>
          <Typography level="body1">
            <strong>Username:</strong> {profileData.username}
          </Typography>
        </Stack>
      ) : (
        <Typography level="body1">
          No profile data available.
        </Typography>
      )}
    </Box>
  );
}

export default Profile;