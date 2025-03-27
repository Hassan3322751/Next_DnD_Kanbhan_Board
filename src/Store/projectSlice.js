"use client"

import { getProject as getProjectApi  } from '@/services/projects';
import { getStage as getStageApi, addStage as addStageApi, deleteStage as deleteStageApi } from '@/services/stages.js';
import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';

export const fetchProject = createAsyncThunk('projects/fetchProject', async (projectId) => {
    let projectData = {
        project: {},
        stages: []
    }
    // const dispatch = useDispatch()
    try {
        const response = await getProjectApi(projectId);
        projectData.project = response;

        if (response.stages && Array.isArray(response.stages)) {
            const stagePromises = response.stages.map(stageId => getStageApi(stageId));
            const stageData = await Promise.all(stagePromises);
            // console.log(stageData)
            projectData.stages = stageData;
            return projectData
        } else {
            projectData.stages = [];
            return projectData
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

export const addStage = createAsyncThunk('projects/addStage', async ({ stageName, projectId }) => {
    const response = await addStageApi(stageName, projectId);
    return response; // Assuming the response contains the added stage
});

export const deleteStage = createAsyncThunk('projects/deleteStage', async (stageId) => {
    await deleteStageApi(stageId);
    return stageId; // Return the ID of the deleted stage
});

export const projectSlice = createSlice({
    name: 'project',
    initialState: {
        project: {},
        stages: [],
        loading: false,
        error: null,
    },
    reducers: {
        setStages: (state, action) => {
            state.stages = action.payload;
        },
        setStageTasksOrder: (state, action) => {
            const {stageIndex, newTasksOrder} = action.payload;

            const newOrder = state.stages[stageIndex].taskIds.forEach((taskId, index) => {
                taskId = newTasksOrder[index]
            })
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProject.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload.project;
                state.stages = action.payload.stages;
            })
            .addCase(fetchProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addStage.fulfilled, (state, action) => {
                state.stages.push(action.payload); // Add the new stage to the stages array
            })
            .addCase(deleteStage.fulfilled, (state, action) => {
                state.stages = state.stages.filter(stage => stage._id !== action.payload); // Remove the deleted stage
            });
    },
});

export const selectProject = (state) => state.project.project;
export const {setStages, setStageTasksOrder} = projectSlice.actions

export const projectReducer = projectSlice.reducer;