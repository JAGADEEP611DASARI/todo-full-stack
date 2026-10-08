import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" }
});

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (filter !== "all") params.status = filter;
      if (search.trim()) params.search = search.trim();

      const response = await api.get("/todos", { params });
      setTodos(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchTodos, 250);
    return () => clearTimeout(timer);
  }, [filter, search]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    return { total, completed, active: total - completed };
  }, [todos]);

  const createTodo = async (data) => {
    try {
      const response = await api.post("/todos", data);
      setTodos((current) => [response.data.data, ...current]);
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Could not create task.");
    }
  };

  const updateTodo = async (id, data) => {
    try {
      const response = await api.put(`/todos/${id}`, data);
      setTodos((current) =>
        current.map((todo) => (todo._id === id ? response.data.data : todo))
      );
      setEditingTodo(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update task.");
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await api.patch(`/todos/${id}/toggle`);
      setTodos((current) =>
        current.map((todo) => (todo._id === id ? response.data.data : todo))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not change task status.");
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/todos/${id}`);
      setTodos((current) => current.filter((todo) => todo._id !== id));
      if (editingTodo?._id === id) setEditingTodo(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete task.");
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-inner">
          <div>
            <div className="brand">TASKFLOW</div>
            <h1>Get things done.</h1>
            <p>A clean REST API powered To-Do workspace.</p>
          </div>
          <div className="hero-badge">REST API • MongoDB</div>
        </div>
      </header>

      <main className="container">
        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card">
            <span>Active</span>
            <strong>{stats.active}</strong>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>
        </section>

        <section className="workspace">
          <aside className="sidebar">
            <TodoForm
              onSubmit={editingTodo ? (data) => updateTodo(editingTodo._id, data) : createTodo}
              editingTodo={editingTodo}
              onCancel={() => setEditingTodo(null)}
            />
          </aside>

          <section className="todo-panel">
            <div className="toolbar">
              <div className="filters">
                {["all", "active", "completed"].map((item) => (
                  <button
                    key={item}
                    className={filter === item ? "filter active" : "filter"}
                    onClick={() => setFilter(item)}
                  >
                    {item[0].toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>

              <input
                className="search"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {error && (
              <div className="error-box">
                {error}
                <button onClick={() => setError("")}>×</button>
              </div>
            )}

            {loading ? (
              <div className="state">Loading tasks...</div>
            ) : todos.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">✓</div>
                <h3>No tasks found</h3>
                <p>Add a task or change your filter/search.</p>
              </div>
            ) : (
              <div className="todo-list">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onEdit={setEditingTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>
            )}
          </section>
        </section>
      </main>

      <footer>TaskFlow • Full Stack REST API To-Do Application</footer>
    </div>
  );
}

export default App;
