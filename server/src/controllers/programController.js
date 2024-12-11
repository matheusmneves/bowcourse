const pool = require('../config/db');

exports.getPrograms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM programs');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProgram = async (req, res) => {
  const { program_code, name, description, term, start_date, end_date, fees } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO programs (program_code, name, description, term, start_date, end_date, fees) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [program_code, name, description, term, start_date, end_date, fees]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProgram = async (req, res) => {
  const { id } = req.params;
  const { program_code, name, description, term, start_date, end_date, fees } = req.body;

  try {
    const result = await pool.query(
      `UPDATE programs 
       SET program_code = $1, name = $2, description = $3, term = $4, start_date = $5, end_date = $6, fees = $7 
       WHERE id = $8 RETURNING *`,
      [program_code, name, description, term, start_date, end_date, fees, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProgram = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};