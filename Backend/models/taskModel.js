import pool from '../config/db.js';

// CREATE
export const createTask = async ({ title, status, dueDate }) => {
  const result = await pool.query(
    'INSERT INTO tasks (title, status, due_date) VALUES ($1, $2, $3) RETURNING *',
    [title, status, dueDate]
  );
  return result.rows[0];
};

// READ
export const getAllTasks = async () => {
  const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
  return result.rows;
};

// UPDATE
export const updateTask = async (id, { title, status, dueDate }) => {
  const result = await pool.query(
    'UPDATE tasks SET title = $1, status = $2, due_date = $3 WHERE id = $4 RETURNING *',
    [title, status, dueDate, id]
  );
  return result.rows[0];
};

// DELETE
export const deleteTask = async (id) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
};
