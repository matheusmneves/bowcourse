import React, { useState, useEffect } from 'react';
import { Box, Typography, Input, Textarea, Button, Card, Stack } from '@mui/joy';
import { useAuth } from '../context/AuthContext';

function Contact() {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch the user's profile data from /me to pre-fill name and email
    const fetchUserProfile = async () => {
      if (user && token) {
        try {
          const response = await fetch('http://localhost:5001/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setFormData((prev) => ({
              ...prev,
              name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : prev.name,
              email: data.email || prev.email,
            }));
          } else {
            console.log('Could not fetch user profile data or incomplete user info.');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };

    fetchUserProfile();
  }, [user, token]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5001/api/users/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSuccessMessage('Your message has been sent successfully!');
      setErrors({});
      setFormData((prevData) => ({
        ...prevData,
        subject: '',
        message: '',
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setErrors({ global: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography level="h4" component="h1" align="center" sx={{ mb: 2 }}>
          Contact Admin
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Your Name"
              onChange={handleInputChange}
              fullWidth
            />

            <Input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Your Email"
              onChange={handleInputChange}
              fullWidth
            />

            <Input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleInputChange}
              fullWidth
            />
            {errors.subject && (
              <Typography level="body2" color="danger">
                {errors.subject}
              </Typography>
            )}

            <Textarea
              name="message"
              placeholder="Your message"
              value={formData.message}
              onChange={handleInputChange}
              minRows={4}
              fullWidth
            />
            {errors.message && (
              <Typography level="body2" color="danger">
                {errors.message}
              </Typography>
            )}

            {errors.global && (
              <Typography level="body2" color="danger">
                {errors.global}
              </Typography>
            )}

            <Button type="submit" fullWidth variant="solid" color="primary">
              Send Message
            </Button>

            {successMessage && (
              <Typography level="body2" color="success" sx={{ mt: 2 }}>
                {successMessage}
              </Typography>
            )}
          </Stack>
        </form>
      </Card>
    </Box>
  );
}

export default Contact;