import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Stack, Button, Divider, Input, Select, Option } from '@mui/joy';
import { useAuth } from '../context/AuthContext';

function AdmContact() {
  const { token, user } = useAuth();  
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    subject: '',
    status: '',
  });

  useEffect(() => {
    // Fetch messages from the backend if user is admin
    if (user && user.role === 'admin' && token) {
      fetchMessages();
    }
  }, [user, token]);

  const fetchMessages = async () => {
    const queryParams = new URLSearchParams();
    if (filters.name) queryParams.append('name', filters.name);
    if (filters.subject) queryParams.append('subject', filters.subject);
    if (filters.status) queryParams.append('status', filters.status);

    try {
      const response = await fetch(`http://localhost:5001/api/users/admin/messages?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
      setFilteredMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleResolve = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/admin/messages/${id}/resolve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to resolve message');
      }

      const updatedMessages = messages.map((msg) =>
        msg.id === id ? { ...msg, status: 'resolved' } : msg
      );
      setMessages(updatedMessages);
      applyFilters(updatedMessages, filters);
    } catch (error) {
      console.error('Error resolving message:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    applyFilters(messages, updatedFilters);
  };

  const applyFilters = (messageList, updatedFilters = filters) => {
    const filtered = messageList.filter((message) => {
      const studentName = message.student_name || ''; 
      const subj = message.subject || '';
      return (
        (updatedFilters.name === '' || studentName.toLowerCase().includes(updatedFilters.name.toLowerCase())) &&
        (updatedFilters.subject === '' || subj.toLowerCase().includes(updatedFilters.subject.toLowerCase())) &&
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

      {filteredMessages.length > 0 ? (
        filteredMessages.map((msg) => (
          <Card
            key={msg.id}
            variant="outlined"
            sx={{
              mb: 3,
              p: 3,
              border: '1px solid',
              borderColor: msg.status === 'resolved' ? 'green' : 'gray',
            }}
          >
            <Stack spacing={2}>
              <Typography level="h4" sx={{ fontWeight: 'bold' }}>
                {msg.subject}
              </Typography>
              <Typography level="body2">
                <strong>Name:</strong> {msg.student_name}
              </Typography>
              <Typography level="body2">
                <strong>Email:</strong> {msg.student_email}
              </Typography>
              <Typography level="body2">
                <strong>Date:</strong> {new Date(msg.sent_at).toLocaleString()}
              </Typography>
              <Divider />
              <Typography level="body2">
                <strong>Message:</strong> {msg.message}
              </Typography>
              <Divider />
              <Typography level="body2" color={msg.status === 'resolved' ? 'success' : 'danger'}>
                <strong>Status:</strong> {msg.status}
              </Typography>

              {msg.status !== 'resolved' && (
                <Button onClick={() => handleResolve(msg.id)} variant="solid" color="primary">
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