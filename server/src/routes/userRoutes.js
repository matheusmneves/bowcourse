const express = require('express');
const { signup, login } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
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

module.exports = router;