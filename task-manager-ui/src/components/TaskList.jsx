import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import TaskForm from "./TaskForm";
import { backendApi } from "../config";

function TaskList({ token, setTaskCount }) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${backendApi}/api/v1/projects`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        setProjects(data.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err.message);
      }
    };
    fetchProjects();
  }, [token]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${backendApi}/api/v1/tasks`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        setTasks(data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err.message);
      }
    };
    fetchTasks();
  }, [token]);

  // Update task count
  useEffect(() => {
    setTaskCount(tasks.filter((task) => task.status !== "Completed").length);
  }, [setTaskCount, tasks]);

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${backendApi}/api/v1/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: updatedTask.status } : task
          )
        );
      } else {
        console.error("Failed to update task status");
      }
    } catch (err) {
      console.error("Error updating task status:", err.message);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${backendApi}/api/v1/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      } else {
        console.error("Failed to delete task");
      }
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-100 py-5">
      {/* Add Task Button */}
      <button
        className={`p-3 px-10 mb-5 border text-white rounded-lg font-semibold text-xl transition duration-300 ${
          showTaskForm
            ? "bg-red-500 border-red-700 hover:bg-red-600"
            : "bg-blue-500 border-blue-700 hover:bg-blue-600"
        }`}
        onClick={() => setShowTaskForm(!showTaskForm)}
      >
        {showTaskForm ? "Close Task Form" : "Add New Task"}
      </button>

      {/* Task Form */}
      {showTaskForm && (
        <TaskForm
          token={token}
          projects={projects}
          setTasks={setTasks}
          setTaskCount={setTaskCount}
        />
      )}

      {/* Task List */}
      <div className="w-full max-w-4xl bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Your Tasks</h2>
        {tasks.length > 0 ? (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow border border-gray-200"
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {task.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Priority:{" "}
                    <span
                      className={`font-semibold ${
                        task.priority === "High"
                          ? "text-red-500"
                          : task.priority === "Medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Delete Task Button */}
                  <button
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>

                  {/* Status Button */}
                  <button
                    className={`px-4 py-2 text-white rounded-lg font-semibold ${
                      task.status === "Pending"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : task.status === "In Progress"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() =>
                      updateTaskStatus(
                        task._id,
                        task.status === "Pending"
                          ? "In Progress"
                          : task.status === "In Progress"
                          ? "Completed"
                          : "Pending"
                      )
                    }
                  >
                    {task.status}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">No tasks available</p>
        )}
      </div>

      {/* Go to Dashboard Button */}
      <div className="mt-8">
        <Link
          to="/dashboard"
          className="p-3 px-10 bg-blue-500 text-white rounded-lg shadow-lg font-semibold text-lg hover:bg-blue-600 transition duration-300"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default TaskList;
