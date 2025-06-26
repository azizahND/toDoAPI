const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DATA_FILE = 'todos.json';

app.use(bodyParser.json());

// Helper function to read & write file
const readTodos = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeTodos = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// GET /todos - Get all todos
app.get('/api/todos', (req, res) => {
  const todos = readTodos();
  res.json({
    status: 'success',
    message: 'Data retrieved successfully',
    data: todos
  });
});

// GET /todos/:id - Get todo by ID
app.get('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({
      status: 'error',
      message: 'To-do with the given ID not found'
    });
  }
  res.json({
    status: 'success',
    message: 'Data retrieved successfully',
    data: todo
  });
});

// POST /todos - Create new todo
app.post('/api/todos', (req, res) => {
  const todos = readTodos();
  const { title, description, dueDate } = req.body;

  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    title,
    description,
    completed: false,
    dueDate,
    createdAt: new Date().toISOString()
  };

  todos.push(newTodo);
  writeTodos(todos);

  res.status(201).json({
    status: 'success',
    message: 'To-do created successfully',
    data: newTodo
  });
});

// PUT /todos/:id - Update todo by ID
app.put('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'To-do with the given ID not found'
    });
  }

  const updatedTodo = {
    ...todos[index],
    ...req.body
  };

  todos[index] = updatedTodo;
  writeTodos(todos);

  res.json({
    status: 'success',
    message: 'To-do updated successfully',
    data: updatedTodo
  });
});

// DELETE /todos/:id - Delete todo by ID
app.delete('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'To-do with the given ID not found'
    });
  }

  const deleted = todos.splice(index, 1)[0];
  writeTodos(todos);

  res.json({
    status: 'success',
    message: 'To-do deleted successfully',
    data: deleted
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
