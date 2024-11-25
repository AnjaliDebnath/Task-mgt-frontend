import React, { useState, useEffect } from "react";
import { backendApi } from "../config";
import { Link } from "react-router-dom";
import Add_icon from ".././assets/icons/add-icon.svg";
import Default_user_icon from ".././assets/icons/default-user-icon.svg";
import Navbar from "./Navbar";
// Ensure `ProjectForm` is imported if you are using it
import ProjectForm from "./ProjectFrom"; // Placeholder, ensure this file exists

export default function Dashboard({
  taskCount,
  setTaskCount,
  token,
  setToken,
}) {
  const [showProjects, setShowProjects] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projects, setProjects] = useState([]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${backendApi}/api/v1/projects`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err.message);
      }
    };

    if (token) fetchProjects(); // Only fetch if token exists
  }, [token]);

  return (
    <>
      <div className="p-0 sm:p-2 flex w-full gap-3">
        {/* Navbar */}
        <Navbar token={token} setToken={setToken} />

        {/* Main content */}
        <div className="min-h-screen flex flex-col w-full items-center bg-transparent">
          {/* Top bar */}
          <div className="flex justify-between items-center w-full p-2 bg-white rounded-3xl border border-gray-300">
            {/* Search Box */}
            <div className="flex min-w-[50%]">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-1 border placeholder:text-xs border-gray-300 bg-gray-medium rounded-3xl w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300"
              />
            </div>

            {/* Add Task button */}
            <div className="flex gap-4">
              <button
                className="bg-primary text-white py-1 px-2 text-sm rounded-xl border-black-all hover:bg-blue-600 transition duration-300"
                onClick={() => setShowProjectForm(!showProjectForm)}
              >
                <div className="flex items-center gap-1">
                  <img
                    src={Add_icon}
                    className="aspect-square w-6"
                    alt="add icon"
                  />
                  <span>Add Project</span>
                </div>
              </button>

              <div className="rounded-full flex cursor-pointer">
                <img
                  src={Default_user_icon}
                  className="aspect-square w-9"
                  alt="user icon"
                />
              </div>
            </div>
          </div>

          {/* Greeting Section */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-semibold text-gray-800 p-5">
              Hello user, you have{" "}
              <span className="font-bold">{taskCount}</span> tasks remaining
            </h2>
          </div>

          {/* Show Project Form */}
          {showProjectForm && <ProjectForm token={token} setProjects={setProjects} />}

          {/* Project List */}
          <div className="w-full md:pl-10 md:mt-4 mt-8">
            <h3 className="text-xl font-semibold mb-4">Your Projects:</h3>
            <ul className="md:flex flex-wrap project-list">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <li
                    key={project._id}
                    className="project-item md:max-w-[30%] h-44 rounded overflow-y-auto shadow-lg m-4 bg-white"
                  >
                    <div className="px-6 py-4">
                      <p className="font-bold text-xl mb-2">{project.name}</p>
                      <p className="text-gray-700 text-base">
                        {project.description}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-700 text-center">
                  No projects added yet.
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
