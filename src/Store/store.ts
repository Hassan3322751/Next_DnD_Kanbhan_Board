// store/index.js
"use client"

import { configureStore } from '@reduxjs/toolkit';
import {projectsReducer} from './projectsSlice';
import {projectReducer} from "./projectSlice"
import tasksReducer from "./tasksSlice"
import themeReducer from "./themeSlice";

const store = configureStore({
    reducer: {
        projects: projectsReducer,
        projectData: projectReducer,
        tasksData: tasksReducer,
        theme: themeReducer,
    },
});

export default store;