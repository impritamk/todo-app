// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    // Explicitly map _id to id for frontend compatibility
    const formattedTodos = todos.map(todo => ({
      _id: todo._id.toString(),
      id: todo._id.toString(),
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt
    }));
    res.json(formattedTodos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Create a new todo
app.post("/todos", async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  
  try {
    const todo = new Todo({ title: title.trim() });
    await todo.save();
    res.json({
      _id: todo._id.toString(),
      id: todo._id.toString(),
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Toggle todo completion
app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.json({
      _id: todo._id.toString(),
      id: todo._id.toString(),
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});
