"use client"

import React, { useEffect, useState } from "react"
import { ProjectCard } from "@/app/components/projectCard";

import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, removeProject, createProject } from '@/Store/projectsSlice';

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = (id) => {
      dispatch(removeProject(id));
  };

  const handleAddProject = () => {
    dispatch(createProject(newProject));
    setIsModalOpen(false);
    setNewProject({ name: "", description: "" });
  };

  return (
    <React.Fragment>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="bg-blue-500 text-white p-2 rounded"
      >
          Add Project
      </button>
      <div className="projects" style={{display: 'flex', flexWrap: 'wrap'}}>
        {
          projects.map((project: any, index: number) => (
            <div key={index}>
              <ProjectCard
                key={index}
                id={project._id}
                name={project.name}
                description={project.description}
                createdAt={project.createdAt}
                handleDelete={handleDelete}
              />
            </div>
          ))
        }

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Add New Task</h2>

              <input
                type="text"
                placeholder="Task name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="border p-2 w-full mb-4"
              />

              <textarea
                placeholder="Task Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="border p-2 w-full mb-4"
              ></textarea>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white p-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button onClick={handleAddProject} className="bg-blue-500 text-white p-2 rounded">
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default Projects