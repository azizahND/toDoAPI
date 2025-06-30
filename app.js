const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let todos = [
  {
    id: 1,
    title: "Belajar Cloud Computing",
    description: "Mengerjakan tugas besar komputasi awan",
    completed: false,
    dueDate: "2025-06-25",
    createdAt: "2025-06-16T13:00:00Z"
  },
  {
    id: 2,
    title: "Deploy Backend",
    description: "Deploy backend ke Google Cloud Platform",
    completed: false,
    dueDate: "2025-06-30",
    createdAt: "2025-06-16T14:00:00Z"
  }
];

let nextId = 3;

const successResponse = (message, data = null) => {
  return {
    status: "success",
    message: message,
    data: data
  };
};

const errorResponse = (message) => {
  return {
    status: "error",
    message: message
  };
};

app.get('/api/todos', (req, res) => {
  try {
    res.json(successResponse("Data retrieved successfully", todos));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error"));
  }
});

app.post('/api/todos', (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    
    // Validasi input
    if (!title || !description) {
      return res.status(400).json(errorResponse("Title and description are required"));
    }
    
    // Buat todo baru
    const newTodo = {
      id: nextId++,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    res.status(201).json(successResponse("To-do created successfully", newTodo));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error"));
  }
});

app.get('/api/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json(errorResponse("Invalid ID format"));
    }
    
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
      return res.status(404).json(errorResponse("To-do with the given ID not found"));
    }
    
    res.json(successResponse("Data retrieved successfully", todo));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error"));
  }
});

app.put('/api/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json(errorResponse("Invalid ID format"));
    }
    
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return res.status(404).json(errorResponse("To-do with the given ID not found"));
    }
    
    const { title, description, completed, dueDate } = req.body;
    
    if (title !== undefined) todos[todoIndex].title = title.trim();
    if (description !== undefined) todos[todoIndex].description = description.trim();
    if (completed !== undefined) todos[todoIndex].completed = Boolean(completed);
    if (dueDate !== undefined) todos[todoIndex].dueDate = dueDate;
    
    res.json(successResponse("To-do updated successfully", todos[todoIndex]));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error"));
  }
});

app.delete('/api/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json(errorResponse("Invalid ID format"));
    }
    
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return res.status(404).json(errorResponse("To-do with the given ID not found"));
    }
    
    const deletedTodo = todos.splice(todoIndex, 1)[0];
    res.json(successResponse("To-do deleted successfully", deletedTodo));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error"));
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json(errorResponse("Endpoint not found"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(errorResponse("Something went wrong!"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});