import React, { useState, useEffect } from 'react';
import { Box, Typography, Input, Textarea, Button, Card, Stack } from '@mui/joy';
import { useAuth } from '../context/AuthContext'; // Ensure useAuth is imported

function Contact() {
  const { user } = useAuth();

  console.log('Logged in user:', user);


  const localUsers = JSON.parse(localStorage.getItem('users')) || [];

  const loggedInUser = localUsers.find((u) => u.username === user?.username);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user info on component mount
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
      setFormData((prevData) => ({
        ...prevData,
        name: loggedInUser.name,
        email: loggedInUser.email,
      }));
    }
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const existingMessages = JSON.parse(localStorage.getItem('tickets')) || [];

    const newTicket = {
      id: existingMessages.length + 1,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      date: new Date().toLocaleString(),
      status: 'open',
    };

    const updatedMessages = [...existingMessages, newTicket];
    localStorage.setItem('tickets', JSON.stringify(updatedMessages));

    setSuccessMessage('Your message has been sent successfully!');

    // Reset only subject and message, not name and email
    setFormData((prevData) => ({
      ...prevData,
      subject: '',
      message: '',
    }));
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
              readOnly
              fullWidth
              placeholder="Your Name"
              sx={{ backgroundColor: '#f0f0f0' }} // Optional: gray out the input to indicate it's not editable
            />

            <Input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              fullWidth
              placeholder="Your Email"
              sx={{ backgroundColor: '#f0f0f0' }} // Optional: gray out the input to indicate it's not editable
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
