import React, { useState, useEffect } from "react";
import "./App.css";
import "./design-system.css";

/*
  Four-screen todo app in a single file, uses only local state.
  Screens: TODO PAGE (default), ADD TODO, COMPLETED TASK, EDIT TODO.
  Minimalistic style using assets/design-system.css.
*/

// --- Icon SVGs as React components ---

const IconCheck = ({ filled = false, ...rest }) => (
  <svg width="24" height="24" fill="none" {...rest}>
    <circle
      cx="12"
      cy="12"
      r="11"
      stroke="#34c759"
      strokeWidth={filled ? "0" : "2"}
      fill={filled ? "#34c759" : "none"}
    />
    <path
      d="M8 12.5L11 15L16 10"
      stroke={filled ? "#fff" : "#34c759"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const IconDelete = (props) => (
  <svg width="24" height="24" stroke="#9395d3" fill="none" {...props}>
    <rect x="6" y="7" width="12" height="12" rx="3" stroke="#9395d3" strokeWidth="2" />
    <path d="M8 10v5M12 10v5M16 10v5" stroke="#9395d3" strokeWidth="2" />
    <rect x="9" y="3" width="6" height="4" rx="2" stroke="#9395d3" strokeWidth="2" />
  </svg>
);

const IconEdit = (props) => (
  <svg width="24" height="24" stroke="#ffd60a" fill="none" {...props}>
    <rect x="4" y="17" width="16" height="3" rx="1.5" stroke="#ffd60a" strokeWidth="2" />
    <path d="M16.13 4.87a2 2 0 012.83 2.83L9 17 5 18l1-4 10.13-10.13z" stroke="#ffd60a" strokeWidth="2" />
  </svg>
);

const IconBack = (props) => (
  <svg width="24" height="24" stroke="#9395d3" fill="none" {...props}>
    <path d="M15 19l-7-7 7-7" stroke="#9395d3" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconList = (props) => (
  <svg width="22" height="22" fill="none" {...props}>
    <rect x="4" y="6" width="14" height="2" rx="1" fill="#9395d3" />
    <rect x="4" y="10" width="14" height="2" rx="1" fill="#9395d3" />
    <rect x="4" y="14" width="14" height="2" rx="1" fill="#9395d3" />
  </svg>
);

const IconTick = (props) => (
  <svg width="22" height="22" fill="none" {...props}>
    <circle cx="11" cy="11" r="11" fill="#8b8787" />
    <path
      d="M6 12l4 4 6-6"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Minimal StatusBar (decorative only) ---
const StatusBar = () => (
  <div className="status-bar" style={{ height: 44 }} />
);

// --- AppBar with custom title and optional right icon ---
function AppBar({ title, right, back, onBack }) {
  return (
    <div className="appbar" style={{ position: "relative", width: "100%", minHeight: 118 }}>
      {back ? (
        <button className="button" style={{ minWidth: 40, marginRight: 8, marginLeft: -4, background: "none", boxShadow: "none" }} onClick={onBack} title="Back">
          <IconBack />
        </button>
      ) : null}
      <span className="heading-large" style={{ margin: "auto" }}>{title}</span>
      {right ? <span style={{ marginLeft: "auto" }}>{right}</span> : null}
    </div>
  );
}

// --- Tabs for All / Completed view on TODO PAGE ---
function TodoTabs({ selected, onTab }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <button
        className="button"
        style={{
          display: "flex",
          alignItems: "center",
          background: selected === "all" ? "var(--color-9395d3)" : "var(--color-d6d7ef)",
          color: selected === "all" ? "var(--color-ffffff)" : "var(--color-9395d3)"
        }}
        onClick={() => onTab("all")}
      >
        <span style={{ marginRight: 4 }}>
          <IconList />
        </span>
        <span className="label-light">All</span>
      </button>
      <button
        className="button"
        style={{
          display: "flex",
          alignItems: "center",
          background: selected === "completed" ? "var(--color-8b8787)" : "var(--color-d6d7ef)",
          color: selected === "completed" ? "var(--color-ffffff)" : "var(--color-8b8787)"
        }}
        onClick={() => onTab("completed")}
      >
        <span style={{ marginRight: 4 }}>
          <IconTick />
        </span>
        <span className="label-dark">Completed</span>
      </button>
    </div>
  );
}

// --- One Todo row with actions ---
function TodoItem({ todo, onComplete, onEdit, onDelete }) {
  const isCompleted = !!todo.completed;
  return (
    <div className="todo-bar" style={{ marginBottom: 0 }}>
      <div>
        <div className="todo-title" style={{ textDecoration: isCompleted ? "line-through" : "none" }}>{todo.title}</div>
        <div className="todo-subtitle" style={{ color: isCompleted ? "var(--color-d6d7ef)" : null }}>{todo.detail}</div>
      </div>
      <div className="flex flex-row" style={{ gap: 8 }}>
        {!isCompleted && (
          <button className="button" style={{ background: "none", color: "#34c759", boxShadow: "none" }} title="Complete" onClick={onComplete}>
            <IconCheck filled={false} />
          </button>
        )}
        <button className="button" style={{ background: "none", color: "#9395d3", boxShadow: "none" }} title="Delete" onClick={onDelete}>
          <IconDelete />
        </button>
        {!isCompleted && (
          <button className="button" style={{ background: "none", color: "#ffd60a", boxShadow: "none" }} title="Edit" onClick={onEdit}>
            <IconEdit />
          </button>
        )}
      </div>
    </div>
  );
}

// --- Floating Action Button for adding a todo ---
function AddFab({ onClick }) {
  return (
    <button className="button"
      aria-label="Add new Todo"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        width: 70,
        height: 70,
        borderRadius: 35,
        background: "var(--color-9395d3)",
        boxShadow: "var(--shadow-0)",
        fontSize: 32,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999
      }}
      onClick={onClick}
    >+</button>
  );
}

// --- Form for Add/Edit ---
// mode: 'add' or 'edit'
function TodoForm({ mode, todo, onSave, onCancel }) {
  const [title, setTitle] = useState(todo?.title || "");
  const [detail, setDetail] = useState(todo?.detail || "");

  useEffect(() => {
    setTitle(todo?.title || "");
    setDetail(todo?.detail || "");
  }, [todo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), detail: detail.trim() });
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <label className="input-title" htmlFor={mode === "add" ? "todo-title" : "todo-title-edit"}>Title</label>
        <input
          id={mode === "add" ? "todo-title" : "todo-title-edit"}
          className="input-underline"
          type="text"
          autoFocus
          value={title}
          placeholder="Enter task title"
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: 32 }}>
        <label className="input-title" htmlFor={mode === "add" ? "todo-detail" : "todo-detail-edit"}>Detail</label>
        <input
          id={mode === "add" ? "todo-detail" : "todo-detail-edit"}
          className="input-underline"
          type="text"
          value={detail}
          placeholder="Enter task detail"
          onChange={e => setDetail(e.target.value)}
        />
      </div>
      {mode === "add" ? (
        <button className="button" style={{ width: "100%", marginTop: 0 }} type="submit">ADD</button>
      ) : (
        <div style={{ display: "flex", gap: 16, marginTop: 0 }}>
          <button className="button" style={{ flex: "1 1 0%" }} type="submit">Update</button>
          <button className="button" style={{
            flex: "1 1 0%",
            background: "var(--color-d6d7ef)",
            color: "var(--color-9395d3)"
          }} type="button" onClick={onCancel}>Cancel</button>
        </div>
      )}
    </form>
  );
}

// --- PUBLIC_INTERFACE
function App() {
  // theme support for demonstration (not in Figma, but preserved from starter)
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // --- App logic state ---
  // 'todo' | 'add' | 'completed' | 'edit'
  const [screen, setScreen] = useState("todo");
  // Todos: { id, title, detail, completed }
  const [todos, setTodos] = useState([
    { id: 1, title: "Finish project", detail: "Finish the frontend code", completed: false },
    { id: 2, title: "Grocery shopping", detail: "Get apples, oranges, cereal", completed: false },
    { id: 3, title: "Read a book", detail: "At least 30 minutes!", completed: true }
  ]);
  // tab: 'all' or 'completed' -- for Todo Page
  const [tab, setTab] = useState("all");
  // Which todo is being edited?
  const [editTodo, setEditTodo] = useState(null);

  // Add Todo
  const handleAdd = (t) => {
    setTodos(prev => [
      ...prev,
      { id: prev.length ? Math.max(...prev.map(td => td.id)) + 1 : 1, title: t.title, detail: t.detail, completed: false }
    ]);
    setScreen("todo");
    setTab("all");
  };

  // Update Todo
  const handleUpdate = (t) => {
    setTodos(prev => prev.map(td =>
      td.id === editTodo.id ? { ...td, title: t.title, detail: t.detail } : td
    ));
    setScreen("todo");
    setTab("all");
    setEditTodo(null);
  };

  // Delete Todo
  const handleDelete = (id) => {
    setTodos(prev => prev.filter(td => td.id !== id));
    setScreen("todo");
    setEditTodo(null);
  };

  // Complete Todo
  const handleComplete = (id) => {
    setTodos(prev => prev.map(td =>
      td.id === id ? { ...td, completed: true } : td
    ));
  };

  // Prepare lists
  const shownTodos = screen === "completed"
    ? todos.filter(td => td.completed)
    : tab === "completed"
      ? todos.filter(td => td.completed)
      : todos;

  // --- Render screens ---
  let content = null;

  if (screen === "todo") {
    // TODO PAGE
    content = (
      <div
        style={{
          position: "absolute",
          top: 44 + 74, // status (44) + appbar (118)
          left: 0,
          width: "100%",
          padding: 16,
          boxSizing: "border-box",
          minHeight: "calc(100vh - 162px)",
          background: "var(--color-ffffff)"
        }}
      >
        {/* Tabs */}
        <TodoTabs
          selected={tab}
          onTab={t => {
            setTab(t);
            setScreen(t === "completed" ? "completed" : "todo");
          }}
        />
        {/* Todo List */}
        <div className="flex flex-col" style={{ gap: 16 }}>
          {shownTodos.length === 0 ? (
            <div style={{ color: "#8b8787", textAlign: "center", marginTop: 64, fontSize: 18 }}>
              No tasks{tab === "completed" ? " completed" : " yet"}.
            </div>
          ) : (
            shownTodos
              .filter(td => tab === "all" || td.completed)
              .map(td => (
                <TodoItem
                  key={td.id}
                  todo={td}
                  onComplete={() => handleComplete(td.id)}
                  onEdit={() => {
                    setEditTodo(td);
                    setScreen("edit");
                  }}
                  onDelete={() => handleDelete(td.id)}
                />
              ))
          )}
        </div>
        <AddFab onClick={() => setScreen("add")} />
      </div>
    );
  } else if (screen === "add") {
    // ADD TODO
    content = (
      <div style={{
        position: "absolute",
        top: 44 + 74,
        left: 0,
        width: "100%",
        padding: "32px 16px 0 16px",
        boxSizing: "border-box",
        minHeight: "calc(100vh - 162px)",
        background: "var(--color-ffffff)"
      }}>
        <TodoForm
          mode="add"
          onSave={handleAdd}
          onCancel={() => setScreen("todo")}
        />
      </div>
    );
  } else if (screen === "completed") {
    // COMPLETED TASK SCREEN (read-only)
    content = (
      <div style={{
        position: "absolute",
        top: 44 + 74,
        left: 0,
        width: "100%",
        padding: "32px 16px 0 16px",
        background: "var(--color-d6d7ef)",
        minHeight: "calc(100vh - 162px)"
      }}>
        {todos.filter(td => td.completed).length === 0 ? (
          <div style={{ color: "#8b8787", textAlign: "center", marginTop: 64, fontSize: 18 }}>
            No tasks completed.
          </div>
        ) : (
          todos.filter(td => td.completed).map(td => (
            <div className="todo-bar" style={{ marginTop: 0, marginBottom: 16 }} key={td.id}>
              <div>
                <div className="todo-title" style={{ textDecoration: "line-through" }}>{td.title}</div>
                <div className="todo-subtitle" style={{ color: "var(--color-d6d7ef)" }}>{td.detail}</div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  } else if (screen === "edit" && editTodo) {
    // EDIT TODO
    content = (
      <div style={{
        position: "absolute",
        top: 44 + 74,
        left: 0,
        width: "100%",
        padding: "32px 16px 0 16px",
        background: "var(--color-ffffff)",
        minHeight: "calc(100vh - 162px)"
      }}>
        <TodoForm
          mode="edit"
          todo={editTodo}
          onSave={handleUpdate}
          onCancel={() => {
            setScreen("todo");
            setEditTodo(null);
            setTab("all");
          }}
        />
      </div>
    );
  }

  // --- App bar logic ---
  let appbar = null;
  if (screen === "todo") {
    appbar = <AppBar title="TODO APP" />;
  } else if (screen === "add") {
    appbar = <AppBar title="Add Task" back onBack={() => setScreen("todo")} />;
  } else if (screen === "completed") {
    appbar = <AppBar title="Completed Task" back onBack={() => {
      setScreen("todo");
      setTab("all");
    }} />;
  } else if (screen === "edit") {
    appbar = <AppBar title="Edit Task" back onBack={() => {
      setScreen("todo");
      setEditTodo(null);
      setTab("all");
    }} />;
  }

  return (
    <div
      className="App bg-primary"
      style={{
        textAlign: "center",
        background: "var(--color-ffffff)",
        color: "var(--color-000000)",
        minHeight: "100vh",
        position: "relative",
        transition: "background-color 0.3s, color 0.3s"
      }}
    >
      {/* Theme Toggle as in template, optional for demo */}
      <button
        className="theme-toggle"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        style={{ zIndex: 2000 }}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      {/* Status Bar */}
      <StatusBar />
      {/* AppBar */}
      {appbar}
      {/* Content */}
      {content}
    </div>
  );
}

export default App;
