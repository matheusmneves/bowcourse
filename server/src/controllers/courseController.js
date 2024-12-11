const pool = require('../config/db');

exports.getCourses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCourse = async (req, res) => {
  const { course_code, name, description, term, start_date, end_date, program_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO courses (course_code, name, description, term, start_date, end_date, program_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [course_code, name, description, term, start_date, end_date, program_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { course_code, name, description, term, start_date, end_date, program_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE courses 
       SET course_code = $1, name = $2, description = $3, term = $4, start_date = $5, end_date = $6, program_id = $7 
       WHERE id = $8 RETURNING *`,
      [course_code, name, description, term, start_date, end_date, program_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};