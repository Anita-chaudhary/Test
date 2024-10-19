import { useState } from "react";
import styles from "../styles/Home.module.css";

const initialTodos = [
  { id: 1, title: "Task One", priority: "high", isCompleted: false },
  { id: 2, title: "Task Two", priority: "low", isCompleted: false },
];

export default function Home() {
  const [todos, setTodos] = useState(initialTodos);
  const [editableTask, setEditableTask] = useState({});
  const [currentTask, setCurrentTask] = useState({
    title: "",
    priority: "low",
  });

  const addNewTask = (task) => {
    setTodos([...todos, { ...task, id: todos.length + 1, isCompleted: false }]);
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  const completeToggle = (item) => {
    setEditableTask(item);
    setTodos(
      todos.map((t) =>
        t.id === item.id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  };

  const editTask = (task) => {
    setCurrentTask(task);
    setEditableTask(task);
  };

  const updateTask = (updateId) => {
    setTodos(
      todos.map((task) => (task.id === updateId ? { ...currentTask } : task))
    );
    setEditableTask(null);
  };

  const handleChange = (event) => {
    setCurrentTask({
      ...currentTask,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (currentTask.id) {
      updateTask(currentTask.id);
    } else {
      addNewTask(currentTask);
    }
    setCurrentTask({ title: "", priority: "low" });
  };

  const priorityObj = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const sortedTodos = [...todos]
    .sort((a, b) => priorityObj[b.priority] - priorityObj[a.priority])
    .sort((a, b) => a.isCompleted - b.isCompleted);

  return (
    <>
      <div className={styles.container}>
        <h1 style={{ textAlign: "center" }}>Task Management App</h1>
        {sortedTodos.map((item, ind) => {
          return (
            <div
              key={item.id}
              className={styles.taskList}
              style={{
                textDecoration: item.isCompleted ? "line-through" : "none",
              }}
            >
              <h4
                style={{
                  color:
                    item.priority == "high"
                      ? "red"
                      : item.priority == "medium"
                      ? "orange"
                      : "green",
                }}
              >
                {ind + 1} - Title: {item.title}
              </h4>
              <div className="title_div">
                <div className={styles.priority} style={{ padding: "16px" }}>
                  Priority: {item.priority}
                </div>
                <button
                  style={{ margin: "16px" }}
                  onClick={() => editTask(item)}
                >
                  Edit
                </button>
                <button
                  style={{ margin: "16px" }}
                  onClick={() => deleteTask(item.id)}
                >
                  Delete
                </button>
                <button
                  style={{ marginInline: "16px", minWidth: "110px" }}
                  onClick={() => completeToggle(item)}
                >
                  {item.isCompleted ? "Undo" : "Mark Complete"}
                </button>
              </div>
            </div>
          );
        })}
        {/***********FORM FOR INPUT VALUES **************/}
        <form onSubmit={(e) => submitForm(e)} className={styles.taskForm}>
          <h2 style={{ textAlign: "center" }}>Input Form</h2>
          <input
            type="text"
            onChange={(event) => handleChange(event)}
            name="title"
            placeholder="Task title"
            value={currentTask.title}
            required
            className={styles.inputText}
          />
          <select
            onChange={handleChange}
            name="priority"
            className={styles.selectPriority}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button type="submit" className={styles.submitButton}>
            {currentTask.id ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      initialTodos,
    },
  };
}
