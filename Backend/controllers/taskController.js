import { pool } from '../config/db.js';

// GET all tasks
export const getTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD a new task
export const addTask = async (req, res) => {
  const { title, status, dueDate } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, status, due_date, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [title, status, dueDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE task
export const editTask = async (req, res) => {
  const { id } = req.params;
  const { title, status, dueDate } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET title = $1, status = $2, due_date = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [title, status, dueDate, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE task
export const removeTask = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
