import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import TaskForm from "../components/TaskForm";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

export default function Home({ initialTasks }) {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load tasks from localStorage or initialTasks on mount
  useEffect(() => {
    const storedTasks =
      JSON.parse(localStorage.getItem("tasks")) || initialTasks;
    setTasks(storedTasks);
  }, [initialTasks]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "linear-gradient(to right, rgba(255,0,0,0.1), rgba(255,0,0,1), rgba(255,0,0,0.5))"; // Red gradient with 3 stops
      case "medium":
        return "linear-gradient(to right, rgba(255,255,0,0.1), rgba(255,255,0,1), rgba(255,255,0,0.5))"; // Yellow gradient
      case "low":
        return "linear-gradient(to right, rgba(0,255,0,0.1), rgba(0,255,0,1), rgba(0,255,0,0.5))"; // Green gradient
      default:
        return "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,1), rgba(255,255,255,0.5))"; // Default white gradient
    }
  };

  // Sort tasks by priority (High > Medium > Low)
  const sortTasksByPriority = (tasksToSort) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return [...tasksToSort].sort((a, b) => {
      if (a?.completed !== b?.completed) {
        return a?.completed ? 1 : -1; // completed tasks go to the bottom
      }
      return priorityOrder[a?.priority] - priorityOrder[b?.priority];
    });
  };

  const handleOpenModal = () => {
    setEditTask(null);
    setShowModal(true);
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditTask(null);
  };

  const handleSubmit = (task) => {
    if (!task?.title.trim()) {
      Swal.fire({
        title: "Error",
        text: "Task title is required.",
        icon: "error",
      });
      return;
    }

    const isDuplicate = tasks?.some(
      (t) =>
        t?.title.toLowerCase() === task?.title.toLowerCase() && t !== editTask
    );
    if (isDuplicate) {
      Swal.fire({
        title: "Error",
        text: "Task with this title already exists.",
        icon: "error",
      });
      return;
    }

    let updatedTasks;
    if (editTask) {
      updatedTasks = tasks?.map((t) =>
        t?.id === editTask?.id ? { ...task, id: editTask?.id } : t
      );
      Swal.fire({
        title: "Success",
        text: "Task updated successfully.",
        icon: "success",
      });
    } else {
      updatedTasks = [...tasks, { ...task, id: uuidv4(), completed: false }];
      Swal.fire({
        title: "Success",
        text: "Task added successfully.",
        icon: "success",
      });
    }

    setTasks(sortTasksByPriority(updatedTasks)); // Always sort by priority after changes
    setShowModal(false);
  };

  const deleteTask = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTasks = tasks?.filter((t) => t?.id !== id);
        setTasks(sortTasksByPriority(updatedTasks)); // Re-sort after deletion
        Swal.fire({
          title: "Success",
          text: "Task deleted successfully.",
          icon: "success",
        });
      }
    });
  };

  const toggleCompletion = (id) => {
    const updatedTasks = tasks?.map((task) =>
      task?.id === id ? { ...task, completed: !task?.completed } : task
    );
    setTasks(sortTasksByPriority(updatedTasks)); // Re-sort after updating completion status
  };

  const filteredTasks = tasks?.filter((task) =>
    task?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Task Management</h1>

      <div className="d-flex flex-column flex-md-row justify-content-end gap-2 mb-2">
        <div
          className="responsive-max-width position-relative"
        >
          <Form.Control
            type="text"
            placeholder="Search tasks..."
            className="pr-40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Clear Button */}
          {searchTerm && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x-circle"
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                width: "20px",
                height: "20px",
                color: "gray",
              }}
              onClick={() => setSearchTerm("")} // Clear the search input
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          )}
        </div>
        <Button
          className="border border-none bg-dark"
          onClick={handleOpenModal}
        >
          Add Task
        </Button>
      </div>

      {/* Task List */}
      <ul className="list-group mb-4 task-container">
        {filteredTasks?.length === 0 ? (
          <li className="list-group-item text-center">No tasks found.</li>
        ) : (
          sortTasksByPriority(filteredTasks)?.map((task) => (
            <li
              key={task?.id}
              className={`list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center ${
                task?.completed ? "list-group-item-success" : ""
              }`}
              style={{ backgroundImage: getPriorityColor(task?.priority) }}
            >
              <div className="flex-grow-1 min-w-0 custom-max-width-70">
                <h4>{task?.title}</h4>
                <p className="task-description">{task?.description}</p>
              </div>

              <div className="d-flex gap-2">
                <div className="toggle-pill">
                  <span
                    className={`toggle-option ${
                      !task.completed ? "selected" : ""
                    }`}
                    onClick={() => toggleCompletion(task?.id)}
                  >
                    Pending
                  </span>
                  <input
                    type="checkbox"
                    className="form-check-input toggle-checkbox"
                    id={`flexSwitchCheckDefault${task?.id}`}
                    checked={task?.completed}
                    onChange={() => toggleCompletion(task?.id)}
                  />
                  <span
                    className={`toggle-option ${
                      task?.completed ? "selected" : ""
                    }`}
                    onClick={() => toggleCompletion(task?.id)}
                  >
                    Completed
                  </span>
                </div>

                <Button
                  className="btn btn-sm border border-none actionBtn"
                  onClick={() => handleEditClick(task)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="black"
                    className="bi bi-pencil-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.854.146a.5.5 0 0 1 .632-.058l.07.058 2.5 2.5a.5.5 0 0 1 .058.632l-.058.07-10 10a.5.5 0 0 1-.233.131l-.07.019-5 1a.5.5 0 0 1-.615-.615l.019-.07 1-5a.5.5 0 0 1 .131-.232l.058-.07 10-10zM11.207 2L3 10.207V13h2.793L14 4.793 11.207 2z" />
                  </svg>
                </Button>

                <Button
                  className="btn btn-sm border border-none actionBtn"
                  onClick={() => deleteTask(task?.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="red"
                    className="bi bi-trash-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.5 1a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1H15a1 1 0 0 1 0 2h-1v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3H1a1 1 0 0 1 0-2h1.5zm2.118 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h6.764a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H4.618zm1.5 1.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
                  </svg>
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Modal for Adding/Editing Tasks */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editTask ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm
            editTask={editTask}
            setEditTask={setEditTask}
            handleSubmit={handleSubmit}
            handleClose={handleClose}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

// Fetch tasks with server-side rendering
export async function getServerSideProps() {
  const initialTasks = [
    {
      id: uuidv4(),
      title: "Task 1",
      description: "This is task 1",
      priority: "high",
      completed: false,
    },
    {
      id: uuidv4(),
      title: "Task 2",
      description: "This is task 2",
      priority: "medium",
      completed: false,
    },
    {
      id: uuidv4(),
      title: "Task 3",
      description: "Complete the documentation",
      priority: "low",
      completed: true,
    },
    {
      id: uuidv4(),
      title: "Task 4",
      description: "Fix bugs in the application",
      priority: "high",
      completed: false,
    },
    {
      id: uuidv4(),
      title: "Task 5",
      description: "Prepare presentation for client meeting",
      priority: "medium",
      completed: true,
    },
    {
      id: uuidv4(),
      title: "Task 6",
      description: "Implement the new feature",
      priority: "high",
      completed: false,
    },
    {
      id: uuidv4(),
      title: "Task 7",
      description: "Update the library dependencies",
      priority: "low",
      completed: false,
    },
    {
      id: uuidv4(),
      title: "Task 8",
      description: "Conduct a code review for pull requests",
      priority: "medium",
      completed: false,
    },
    {
      id: uuidv4(),
      title: "Task 9",
      description: "Design new UI components",
      priority: "high",
      completed: true,
    },
    {
      id: uuidv4(),
      title: "Task 10",
      description: "Research new technologies for the project",
      priority: "medium",
      completed: false,
    },
  ];
  return {
    props: {
      initialTasks,
    },
  };
}
