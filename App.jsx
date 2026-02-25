import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Trash2, Plus } from "lucide-react";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const API = "http://localhost:3002/todos";

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() })
      });
      const data = await res.json();
      setTodos([...todos, data]);
      setTitle("");
    } catch (err) {
      console.error("Failed to add todo:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "PUT" });
      const updated = await res.json();
      setTodos(todos.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("Failed to toggle todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  const filtered = todos.filter(todo => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  };

  return (
    <div style={styles.root}>
      <style>{cssStyles}</style>

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.h1}>My Tasks</h1>
          <p style={styles.subtitle}>Stay focused and organized</p>
        </div>

        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statNumber}>{stats.total}</div>
            <div style={styles.statLabel}>Total</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>{stats.active}</div>
            <div style={styles.statLabel}>Active</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>{stats.completed}</div>
            <div style={styles.statLabel}>Done</div>
          </div>
        </div>

        <div style={styles.filters}>
          {["all", "active", "completed"].map(f => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                ...(filter === f ? styles.filterBtnActive : {})
              }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={addTodo} style={styles.inputSection}>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Add a new task..."
              maxLength={80}
              style={styles.input}
            />
            <button 
              type="submit" 
              style={{
                ...styles.addBtn,
                ...(loading || !title.trim() ? styles.addBtnDisabled : {})
              }} 
              disabled={loading || !title.trim()}
            >
              <Plus size={18} style={{ marginRight: '0.5rem' }} />
              Add
            </button>
          </div>
        </form>

        <div style={styles.todosContainer}>
          {filtered.length === 0 ? (
            <div style={styles.emptyState}>
              <p>
                {todos.length === 0
                  ? "No tasks yet. Create one to get started! ✨"
                  : `No ${filter} tasks. Great job! 🎉`}
              </p>
            </div>
          ) : (
            <ul style={styles.todosList}>
              {filtered.map((todo, index) => (
                <li
                  key={todo.id}
                  style={{
                    ...styles.todoItem,
                    ...(todo.completed ? styles.todoItemCompleted : {})
                  }}
                >
                  <button
                    style={styles.todoCheckbox}
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={`Toggle task: ${todo.title}`}
                  >
                    {todo.completed ? (
                      <CheckCircle2 size={24} color="#60a5fa" />
                    ) : (
                      <Circle size={24} color="#60a5fa" />
                    )}
                  </button>
                  <span
                    style={{
                      ...styles.todoText,
                      ...(todo.completed ? styles.todoTextCompleted : {})
                    }}
                    onClick={() => toggleTodo(todo.id)}
                    title={todo.title}
                  >
                    {todo.title}
                  </span>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteTodo(todo.id)}
                    aria-label={`Delete task: ${todo.title}`}
                  >
                    <Trash2 size={18} color="#f87171" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const cssStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    color: #e2e8f0;
    background: #0f172a;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  input:focus {
    outline: none;
  }

  button:focus {
    outline: none;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1.5rem 1rem !important;
    }

    .header h1 {
      font-size: 2rem !important;
    }

    .input-wrapper {
      flex-direction: column !important;
    }

    .add-btn {
      width: 100% !important;
      justify-content: center !important;
    }

    .stats {
      gap: 1.5rem !important;
    }
  }
`;

const styles = {
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideDown 0.6s ease-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
    animation: 'slideDown 0.6s ease-out',
  },
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#94a3b8',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '2rem',
    animation: 'slideUp 0.6s ease-out 0.2s both',
  },
  stat: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '1.75rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginTop: '0.25rem',
  },
  filters: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    animation: 'slideUp 0.6s ease-out 0.3s both',
  },
  filterBtn: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    color: '#94a3b8',
    borderRadius: '0.5rem',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: 500,
  },
  filterBtnActive: {
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    borderColor: '#3b82f6',
    color: 'white',
  },
  inputSection: {
    marginBottom: '2rem',
  },
  inputWrapper: {
    display: 'flex',
    gap: '0.75rem',
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))',
    padding: '1rem',
    borderRadius: '0.75rem',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    backdropFilter: 'blur(10px)',
    animation: 'slideUp 0.6s ease-out 0.1s both',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#e2e8f0',
    fontSize: '1rem',
    fontFamily: 'inherit',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1.25rem',
    background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  addBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  todosContainer: {
    flex: 1,
    animation: 'slideUp 0.6s ease-out 0.4s both',
  },
  todosList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5))',
    border: '1px solid rgba(100, 116, 139, 0.2)',
    borderRadius: '0.5rem',
    transition: 'all 0.3s ease',
    animation: 'scaleIn 0.4s ease-out',
  },
  todoItemCompleted: {
    opacity: 0.6,
  },
  todoCheckbox: {
    flexShrink: 0,
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  todoText: {
    flex: 1,
    fontSize: '1rem',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.3s ease',
    color: '#e2e8f0',
  },
  todoTextCompleted: {
    textDecoration: 'line-through',
    color: '#64748b',
  },
  deleteBtn: {
    flexShrink: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: 0,
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#64748b',
  },
};

export default App;
