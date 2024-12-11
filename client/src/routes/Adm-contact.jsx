import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Stack, Button, Divider, Input, Select, Option } from '@mui/joy';

function AdmContact() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    subject: '',
    status: '',
  });

  // Fetch tickets from localStorage on component mount
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('tickets')) || [];
    setMessages(storedMessages);
    setFilteredMessages(storedMessages);
  }, []);

  // Handle resolve action
  const handleResolve = (id) => {
    const updatedMessages = messages.map((message) =>
      message.id === id ? { ...message, status: 'resolved' } : message
    );
    setMessages(updatedMessages);
    localStorage.setItem('tickets', JSON.stringify(updatedMessages));
    applyFilters(updatedMessages); // Update the filtered list
  };

  // Handle input change for filters
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    applyFilters(messages, { ...filters, [name]: value });
  };

  // Apply filters based on the current filter values
  const applyFilters = (messages, updatedFilters = filters) => {
    const filtered = messages.filter((message) => {
      return (
        (updatedFilters.name === '' || message.name.toLowerCase().includes(updatedFilters.name.toLowerCase())) &&
        (updatedFilters.subject === '' || message.subject.toLowerCase().includes(updatedFilters.subject.toLowerCase())) &&
        (updatedFilters.status === '' || message.status === updatedFilters.status)
      );
    });
    setFilteredMessages(filtered);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography level="h2" component="h1" sx={{ mb: 3 }} align="center">
        Admin - Student Messages
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Input
          name="name"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleInputChange}
          sx={{ flex: 1 }}
        />
        <Input
          name="subject"
          placeholder="Filter by Subject"
          value={filters.subject}
          onChange={handleInputChange}
          sx={{ flex: 1 }}
        />
        <Select
          name="status"
          value={filters.status}
          onChange={(e) => handleInputChange({ target: { name: 'status', value: e.target.value } })}
          placeholder="Filter by Status"
          sx={{ flex: 1 }}
        >
          <Option value="">All</Option>
          <Option value="open">Open</Option>
          <Option value="resolved">Resolved</Option>
        </Select>
      </Box>

      {/* Message list */}
      {filteredMessages.length > 0 ? (
        filteredMessages.map((message) => (
          <Card
            key={message.id}
            variant="outlined"
            sx={{
              mb: 3,
              p: 3,
              border: '1px solid',
              borderColor: message.status === 'resolved' ? 'green' : 'gray',
            }}
          >
            <Stack spacing={2}>
              <Typography level="h4" sx={{ fontWeight: 'bold' }}>
                {message.subject}
              </Typography>
              <Typography level="body2">
                <strong>Name:</strong> {message.name}
              </Typography>
              <Typography level="body2">
                <strong>Email:</strong> {message.email}
              </Typography>
              <Typography level="body2">
                <strong>Date:</strong> {message.date}
              </Typography>
              <Divider />
              <Typography level="body2">
                <strong>Message:</strong> {message.message}
              </Typography>
              <Divider />
              <Typography level="body2" color={message.status === 'resolved' ? 'success' : 'danger'}>
                <strong>Status:</strong> {message.status}
              </Typography>

              {message.status !== 'resolved' && (
                <Button onClick={() => handleResolve(message.id)} variant="solid" color="primary">
                  Mark as Resolved
                </Button>
              )}
            </Stack>
          </Card>
        ))
      ) : (
        <Typography level="body1" align="center">
          No messages found.
        </Typography>
      )}
    </Box>
  );
}

export default AdmContact;