import React from "react";
function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const dueText = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString()
    : null;

  return (
    <article className={todo.completed ? "todo-card completed" : "todo-card"}>
      <button
        className={todo.completed ? "check checked" : "check"}
        onClick={() => onToggle(todo._id)}
        aria-label="Toggle task completion"
      >
        {todo.completed ? "✓" : ""}
      </button>

      <div className="todo-content">
        <div className="todo-topline">
          <h3>{todo.title}</h3>
          <span className={`priority ${todo.priority}`}>{todo.priority}</span>
        </div>

        {todo.description && <p>{todo.description}</p>}

        <div className="todo-meta">
          <span>{todo.completed ? "Completed" : "In progress"}</span>
          {dueText && <span>Due {dueText}</span>}
        </div>
      </div>

      <div className="todo-actions">
        <button onClick={() => onEdit(todo)} title="Edit task">Edit</button>
        <button className="delete" onClick={() => onDelete(todo._id)} title="Delete task">
          Delete
        </button>
      </div>
    </article>
  );
}

export default TodoItem;
