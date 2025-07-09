// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: '', status: '', dueDate: '' });
  const [filter, setFilter] = useState('All');

  const API_BASE = 'http://localhost:5000/api/tasks';

  // Load tasks from backend
  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Error fetching tasks:', err));
  }, []);

  const handleOpen = (task = null) => {
    setEditingTask(task);
    setForm(task || { title: '', status: 'Pending', dueDate: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTask(null);
    setForm({ title: '', status: '', dueDate: '' });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingTask) {
        const res = await fetch(`${API_BASE}/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === updated.id ? updated : task))
        );
      } else {
        const res = await fetch(API_BASE, {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const newTask = await res.json();
        setTasks((prev) => [...prev, newTask]);
      }
      handleClose();
    } catch (err) {
      console.error('Error submitting task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleFilterChange = (e, newFilter) => {
    if (newFilter) setFilter(newFilter);
  };

 const getStatusColor = (status) => {
  if (!status || typeof status !== 'string') return 'default';

  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'in progress':
      return 'info';
    default:
      return 'default';
  }
};

  const filteredTasks =
    filter === 'All' ? tasks : tasks.filter((task) => task.status === filter);

  const getCountByStatus = (status) =>
    tasks.filter((task) => task.status === status).length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        📋 Taskify Dashboard – Your Daily To-Do Manager
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f1f8e9' }}>
            <Typography variant="h6">✅ Completed</Typography>
            <Typography variant="h4">{getCountByStatus('Completed')}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="h6">⏳ In Progress</Typography>
            <Typography variant="h4">{getCountByStatus('In Progress')}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#ffebee' }}>
            <Typography variant="h6">🕐 Pending</Typography>
            <Typography variant="h4">{getCountByStatus('Pending')}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <ToggleButtonGroup
          color="primary"
          value={filter}
          exclusive
          onChange={handleFilterChange}
        >
          <ToggleButton value="All">All</ToggleButton>
          <ToggleButton value="Pending">Pending</ToggleButton>
          <ToggleButton value="In Progress">In Progress</ToggleButton>
          <ToggleButton value="Completed">Completed</ToggleButton>
        </ToggleButtonGroup>

        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          + Add New Task
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f4f6f8' }}>
            <TableRow>
              <TableCell><strong>Task</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No tasks under <strong>{filter}</strong> filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <Chip label={task.status} color={getStatusColor(task.status)} />
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" onClick={() => handleOpen(task)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(task.id)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                label="Task Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                fullWidth
                select
                SelectProps={{ native: true }}
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingTask ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;
