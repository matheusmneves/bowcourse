import React from 'react';
import { Box, Typography, Button, AspectRatio, Link } from '@mui/joy';
import bvcCampusImage from '../assets/bvc-campus.png';

function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '32px',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '500px',
          paddingRight: '16px',
        }}
      >
        <Typography level="body2" color="primary" sx={{ fontWeight: 'bold' }}>
          Explore our Programs
        </Typography>

        <Typography
          level="h1"
          sx={{
            fontSize: { xs: 'clamp(1.5rem, 5vw, 2.5rem)', sm: '3rem' },
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginTop: '16px',
            marginBottom: '16px',
          }}
        >
          Join Bow Valley for Your Future in Tech
        </Typography>

        <Typography level="body1" sx={{ marginBottom: '24px' }}>
          Kickstart your career by enrolling in one of our industry-recognized programs today. Whether you are looking for a diploma or a post-diploma, we have the right program for you.
        </Typography>

        <Button color="primary" size="lg" component={Link} href="/signup">
          New student? Sign Up
        </Button>

        <Typography level="body-sm" sx={{ marginTop: '16px' }}>
          Already a student?{' '}
          <Link href="/login" sx={{ fontWeight: 'bold' }}>
            Sign in
          </Link>
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '500px',
        }}
      >
        <AspectRatio ratio="1/1" sx={{ maxWidth: '100%' }}>
          <img
            src={bvcCampusImage} 
            alt="Software Development"
            style={{ borderRadius: '8px' }}
          />
        </AspectRatio>
      </Box>
    </Box>
    
  );
}

export default Home;