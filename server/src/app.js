const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const programRoutes = require('./routes/programRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'API is working',
  });
});
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});