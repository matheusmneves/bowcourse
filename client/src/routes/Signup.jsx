import React, { useState } from "react";
import { Grid, Card, CardContent, Input, Button, Box, Typography, Stack, Divider } from "@mui/joy";
import api from "../api"; // Ensure the API configuration file is properly set up

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate the form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.birthday) newErrors.birthday = "Birthday is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Step 1: Register the user
      await api.post("/users/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        birthday: formData.birthday,
        role: "student", // Always set role to "student"
      });

      setSuccessMessage("User registered successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthday: "",
        username: "",
        password: "",
      });
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ apiError: error.response.data.error });
      } else {
        setErrors({ apiError: "An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography level="h4" component="h1" align="center" sx={{ mb: 2 }}>
          Sign Up
        </Typography>
        <Divider />
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  fullWidth
                />
                {errors.firstName && (
                  <Typography level="body2" color="danger" sx={{ mt: 1 }}>
                    {errors.firstName}
                  </Typography>
                )}
              </Grid>

              <Grid xs={12} sm={6}>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  fullWidth
                />
                {errors.lastName && (
                  <Typography level="body2" color="danger" sx={{ mt: 1 }}>
                    {errors.lastName}
                  </Typography>
                )}
              </Grid>

              <Grid xs={12} sm={6}>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                />
                {errors.email && (
                  <Typography level="body2" color="danger" sx={{ mt: 1 }}>
                    {errors.email}
                  </Typography>
                )}
              </Grid>

              <Grid xs={12} sm={6}>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                />
                {errors.phone && (
                  <Typography level="body2" color="danger" sx={{ mt: 1 }}>
                    {errors.phone}
                  </Typography>
                )}
              </Grid>

              <Grid xs={12} sm={6}>
                <Input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  fullWidth
                />
                {errors.birthday && (
                  <Typography level="body2" color="danger" sx={{ mt: 1 }}>
                    {errors.birthday}
                  </Typography>
                )}
              </Grid>

              <Grid xs={12} sm={6}>
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  fullWidth
                />
                {errors.username && (
                  <Typography level="body2" color="danger" sx={{ mt: 1 }}>
                    {errors.username}
                  </Typography>
                )}
              </Grid>

              <Grid xs={12} sm={6}>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
                />
                {errors.password && (
                  <Typography level="body2" color="danger" sx={{ mt: 1 }}>
                    {errors.password}
                  </Typography>
                )}
              </Grid>
            </Grid>

            {errors.apiError && (
              <Typography level="body2" color="danger" sx={{ mt: 2 }}>
                {errors.apiError}
              </Typography>
            )}

            {successMessage && (
              <Typography level="body2" color="success" sx={{ mt: 2 }}>
                {successMessage}
              </Typography>
            )}

            <Stack sx={{ mt: 3 }}>
              <Button type="submit" fullWidth variant="solid" color="primary" disabled={loading}>
                {loading ? "Processing..." : "Sign Up"}
              </Button>
            </Stack>
          </CardContent>
        </form>
      </Card>
    </Box>
  );
};

export default Signup;