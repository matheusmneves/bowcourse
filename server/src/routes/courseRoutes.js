const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getCourses, addCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const router = express.Router();
const pool = require('../config/db');

router.get('/', getCourses); // Public
router.post('/', authenticateToken, addCourse); // Admin
router.put('/:id', authenticateToken, updateCourse); // Admin
router.delete('/:id', authenticateToken, deleteCourse); // Admin
router.post('/subscribe/:id', authenticateToken, async (req, res) => {
    const { id: courseId } = req.params;
    const userId = req.user.id;
  
    try {
      const programCheck = await pool.query(
        `SELECT p.id AS program_id 
         FROM courses c 
         JOIN programs p ON c.program_id = p.id
         JOIN users_programs up ON up.program_id = p.id
         WHERE c.id = $1 AND up.user_id = $2`,
        [courseId, userId]
      );
  
      if (programCheck.rows.length === 0) {
        return res.status(400).json({ error: 'You must be subscribed to the program to enroll in this course' });
      }
  
      const result = await pool.query(
        `INSERT INTO users_courses (user_id, course_id) 
         VALUES ($1, $2) 
         ON CONFLICT DO NOTHING RETURNING *`,
        [userId, courseId]
      );
  
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Already subscribed to this course' });
      }
  
      res.status(201).json({ message: 'Subscribed to course successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
router.delete('/unsubscribe/:id', authenticateToken, async (req, res) => {
    const { id: courseId } = req.params;
    const userId = req.user.id;
  
    try {
      const result = await pool.query(
        `DELETE FROM users_courses WHERE user_id = $1 AND course_id = $2 RETURNING *`,
        [userId, courseId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'You are not subscribed to this course' });
      }
  
      res.status(200).json({ message: 'Unsubscribed from course successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;