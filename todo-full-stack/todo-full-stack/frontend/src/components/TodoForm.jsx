import React, { useEffect, useState } from "react";

const initialState = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: ""
};

function TodoForm({ onSubmit, editingTodo, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTodo) {
      setForm({
        title: editingTodo.title || "",
        description: editingTodo.description || "",
        priority: editingTodo.priority || "medium",
        dueDate: editingTodo.dueDate
          ? new Date(editingTodo.dueDate).toISOString().slice(0, 10)
          : ""
      });
    } else {
      setForm(initialState);
    }
  }, [editingTodo]);

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.title.trim().length < 2) {
      setError("Title must contain at least 2 characters.");
      return;
    }

    try {
      setSaving(true);
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || null
      });
      if (!editingTodo) setForm(initialState);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span>{editingTodo ? "EDIT TASK" : "NEW TASK"}</span>
        <h2>{editingTodo ? "Update task" : "Create a task"}</h2>
      </div>

      {error && <div className="form-error">{error}</div>}

      <label>
        Task title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Finish assignment"
          maxLength="120"
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add some details..."
          rows="4"
          maxLength="500"
        />
      </label>

      <div className="form-row">
        <label>
          Priority
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Due date
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="form-actions">
        {editingTodo && (
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="primary-btn" disabled={saving}>
          {saving ? "Saving..." : editingTodo ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
}

export default TodoForm;
