const express = require('express');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { getPrograms, addProgram, updateProgram, deleteProgram } = require('../controllers/programController');
const router = express.Router();
const pool = require('../config/db');

// Get all programs
router.get('/', getPrograms);

// Admin routes
router.post('/', authenticateToken, isAdmin, addProgram);
router.put('/:id', authenticateToken, isAdmin, updateProgram);
router.delete('/:id', authenticateToken, isAdmin, deleteProgram);

// Subscribe to a program
router.post('/subscribe/:id', authenticateToken, async (req, res) => {
    const { id: programId } = req.params;
    const userId = req.user.id;

    try {
        // Ensure the user is not subscribed to another program
        const existingSubscription = await pool.query(
            'SELECT * FROM users_programs WHERE user_id = $1',
            [userId]
        );

        if (existingSubscription.rows.length > 0) {
            return res.status(400).json({ error: 'You are already subscribed to a program. Unsubscribe first.' });
        }

        // Insert the new subscription
        await pool.query(
            `INSERT INTO users_programs (user_id, program_id) 
             VALUES ($1, $2)`,
            [userId, programId]
        );

        // Fetch the full program details to return to the frontend
        const programDetails = await pool.query(
            'SELECT * FROM programs WHERE id = $1',
            [programId]
        );

        if (programDetails.rows.length === 0) {
            return res.status(404).json({ error: 'Program not found after subscription.' });
        }

        const subscribedProgram = programDetails.rows[0];

        res.status(201).json({
            message: 'Subscribed to program successfully',
            program: subscribedProgram
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Unsubscribe from a program
router.delete('/unsubscribe/:id', authenticateToken, async (req, res) => {
    const { id: programId } = req.params;
    const userId = req.user.id;

    try {
        // Remove courses tied to this program from the user
        await pool.query(
            'DELETE FROM users_courses WHERE course_id IN (SELECT id FROM courses WHERE program_id = $1)',
            [programId]
        );

        const result = await pool.query(
            `DELETE FROM users_programs WHERE user_id = $1 AND program_id = $2 RETURNING *`,
            [userId, programId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'You are not subscribed to this program' });
        }

        res.status(200).json({ message: 'Unsubscribed from program successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;