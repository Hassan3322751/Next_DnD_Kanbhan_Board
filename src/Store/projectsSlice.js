"use client"

// store/projectsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addProject, getProjects, deleteProject } from '../services/projects.js';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
    const projects = await getProjects();
    return projects;
});

export const removeProject = createAsyncThunk('projects/removeProject', async (id) => {
    await deleteProject(id);
    return id;
});

export const createProject = createAsyncThunk('projects/createProject', async (newProject) => {
    const addedProject = await addProject(newProject);
    return addedProject;
});

export const projectsSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(removeProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(project => project._id !== action.payload);
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
            });
    },
});

export const selectProjects = (state) => state.projects.projects;

export const projectsReducer = projectsSlice.reducer;