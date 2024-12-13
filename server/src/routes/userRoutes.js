const express = require('express');
const { signup, login } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
// If you have an isAdmin middleware, import it as well:
// const { isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
const pool = require('../config/db');

router.post('/signup', signup); 
router.post('/login', login); 

router.get('/dashboard', authenticateToken, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.id}` });
});

router.get('/programs', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT p.id, p.program_code, p.name, p.description, p.term, p.start_date, p.end_date, p.fees
             FROM programs p
             JOIN users_programs up ON up.program_id = p.id
             WHERE up.user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No programs found for this user' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/courses', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT c.id, c.course_code, c.name, c.description, c.term, c.start_date, c.end_date, c.program_id
             FROM courses c
             JOIN users_courses uc ON uc.course_id = c.id
             WHERE uc.user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No courses found for this user' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.birthday, u.username, u.role, u.program_id, 
                    p.name AS program_name, p.description AS program_description
             FROM users u
             LEFT JOIN programs p ON p.id = u.program_id
             WHERE u.id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = result.rows[0];

        const responseData = {
          id: userData.id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          phone: userData.phone,
          birthday: userData.birthday,
          username: userData.username,
          role: userData.role,
          program_id: userData.program_id,
          program: userData.program_name ? {
            name: userData.program_name,
            description: userData.program_description
          } : null
        };

        res.status(200).json(responseData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /messages: Student sends a message to admin
router.post('/messages', authenticateToken, async (req, res) => {
    const { subject, message } = req.body;
    const studentId = req.user.id;

    if (!subject || !message) {
        return res.status(400).json({ error: 'Subject and message are required.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO messages (student_id, admin_id, subject, message, status, sent_at)
             VALUES ($1, NULL, $2, $3, 'open', NOW()) RETURNING *`,
            [studentId, subject, message]
        );

        res.status(201).json({ message: 'Message sent successfully', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /admin/messages: Admin fetches all messages with optional filters
// Assuming you have isAdmin middleware:
router.get('/admin/messages', authenticateToken, /*isAdmin,*/ async (req, res) => {
    const { name, subject, status } = req.query;

    let query = `
        SELECT m.id, m.subject, m.message, m.status, m.sent_at,
               u.first_name || ' ' || u.last_name AS student_name,
               u.email AS student_email
        FROM messages m
        JOIN users u ON u.id = m.student_id
        WHERE 1=1
    `;

    const values = [];

    if (name) {
        values.push(`%${name}%`);
        query += ` AND (u.first_name || ' ' || u.last_name) ILIKE $${values.length}`;
    }

    if (subject) {
        values.push(`%${subject}%`);
        query += ` AND m.subject ILIKE $${values.length}`;
    }

    if (status) {
        values.push(status);
        query += ` AND m.status = $${values.length}`;
    }

    query += ` ORDER BY m.sent_at DESC`;

    try {
        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /admin/messages/:id/resolve: Admin marks a message as resolved
router.put('/admin/messages/:id/resolve', authenticateToken, /*isAdmin,*/ async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE messages SET status = 'resolved' WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found.' });
        }

        res.status(200).json({ message: 'Message resolved successfully', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;