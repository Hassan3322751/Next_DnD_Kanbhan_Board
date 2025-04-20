"use client"

import { getProject as getProjectApi  } from '@/services/projects';
import { getStage as getStageApi, addStage as addStageApi, deleteStage as deleteStageApi } from '@/services/stages.js';
import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { getTasksByStage } from './tasksSlice';

export const fetchProject = createAsyncThunk('projects/fetchProject', async ({id, dispatch}) => {
    let projectData = {
        project: {},
        stages: []
    }
    let projectId = id;
    // const dispatch = useDispatch()
    try {
        const response = await getProjectApi(projectId);
        projectData.project = response;

        function fetchStage(){
            if (projectData.stages && projectData.stages.length) {
                dispatch(getTasksByStage({ stages: projectData.stages, page: 1 })); // Adjust page as needed
            }
        }

        if (response.stages && Array.isArray(response.stages)) {
            const stagePromises = response.stages.map(stageId => getStageApi(stageId));
            const stageData = await Promise.all(stagePromises);
            // console.log(stageData)
            projectData.stages = stageData;
            fetchStage()
            return projectData
        } else {
            projectData.stages = [];
            fetchStage()
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
            const { srcStageIndex, srcNewTasksOrder, destStageIndex, destNewTasksOrder } = action.payload;
        
            const updatedStages = state.stages.map((stage, index) => {
                if (index === srcStageIndex) {
                    // Update the source stage's taskIds
                    return {
                        ...stage,
                        taskIds: srcNewTasksOrder // Update taskIds with the new order for the source stage
                    };
                } else if (index === destStageIndex) {
                    // Update the destination stage's taskIds
                    return {
                        ...stage,
                        taskIds: destNewTasksOrder // Update taskIds with the new order for the destination stage
                    };
                }
                return stage; // Return the original stage if it's not being updated
            });
        
            return {
                ...state,
                stages: updatedStages // Update the stages in the state
            };
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
                state.stages = [...state.stages, action.payload]; // Add the new stage to the stages array
            })
            .addCase(deleteStage.fulfilled, (state, action) => {
                state.stages = current(state.stages).filter(stage => stage._id !== action.payload); // Remove the deleted stage
            });
    },
});

export const selectProject = (state) => state.project.project;
export const {setStages, setStageTasksOrder} = projectSlice.actions

export const projectReducer = projectSlice.reducer;