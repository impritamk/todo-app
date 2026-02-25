const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// In-memory storage
let todos = [];
let nextId = 1;

// Get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Create a new todo
app.post("/todos", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required and must be a non-empty string" });
  }

  const todo = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos.push(todo);
  res.status(201).json(todo);
});

// Toggle todo completion status
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === parseInt(id));

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todo.completed = !todo.completed;
  res.json(todo);
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = todos.length;

  todos = todos.filter(t => t.id !== parseInt(id));

  if (todos.length === initialLength) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json({ message: "Todo deleted successfully" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
