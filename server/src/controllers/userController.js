const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.signup = async (req, res) => {
  const { 
    first_name, 
    last_name, 
    email, 
    phone, 
    birthday, 
    program_id, 
    username, 
    password, 
    role = 'student'
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Data being inserted: ', first_name, last_name, email, phone, birthday, program_id, username, hashedPassword, role);
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, birthday, program_id, username, password, role) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [first_name, last_name, email, phone, birthday, program_id, username, hashedPassword, role]
    );
    res.status(201).json(result.rows[0]);
    console.log('User signed up:', username);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user: { id: user.id, username: user.username, role: user.role } });
    
    if(user.role === 'admin'){
      console.log('Admin logged in:', user.username);
    }
    console.log('User logged in:', user.username);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};