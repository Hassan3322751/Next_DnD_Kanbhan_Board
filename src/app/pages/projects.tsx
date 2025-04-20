"use client"

import React, { useEffect, useState } from "react"
import { ProjectCard } from "@/app/components/projectCard";

import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, removeProject, createProject } from '@/Store/projectsSlice';
import { Button } from "@mui/material";

import ProjectModal from "@/components/projects/ProjectModal"

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
      <div className="p-4">
      <Button
      variant="contained"
      onClick={() => setIsModalOpen(true)}
      sx={{
        backgroundColor: "rgba(59, 130, 246, 0.7)", // Semi-transparent blue
        color: "#fff", // Text color
        borderRadius: "8px", // Rounded corners
        padding: "10px 20px", // Padding for a larger button
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow
        transition: "background-color 0.3s, transform 0.2s", // Smooth transition
        "&:hover": {
          backgroundColor: "rgba(37, 99, 235, 0.8)", // Darker shade on hover
          transform: "translateY(-2px)", // Lift effect on hover
        },
        "&:active": {
          transform: "translateY(0)", // Reset lift effect on click
        },
      }}
    >
      Add Project
    </Button>
        <div className="flex flex-wrap gap-4 mt-4">
        {
          projects.map((project: any, index: number) => (
              <ProjectCard
                key={index}
                id={project._id}
                name={project.name}
                description={project.description}
                createdAt={project.createdAt}
                handleDelete={handleDelete}
              />
          ))
        }
        </div>
      </div>

      <ProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectData={newProject}
        setProjectData={setNewProject}
        handleSubmit={handleAddProject}
      />

    </React.Fragment>
  )
}

export default Projects