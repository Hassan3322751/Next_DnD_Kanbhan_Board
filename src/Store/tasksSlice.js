import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { 
    updateTaskStage as updateTaskStageApi,
    updateTaskOrder as updateTaskOrderApi,
    getTasksByStage as getTasksByStageApi,
    addTask as addTaskApi, deleteTask as deleteTaskApi, getTask as getTaskApi, patchTask as patchTaskApi
 } from '../services/tasks'; // Adjust the import based on your API service

// Async thunk for updating task stage
export const updateTaskStage = createAsyncThunk('tasks/updateTaskStage', async (
    { taskId, sourceStageId, destinationStageId, newIndex }
) => {
    let response = {};
    updateTaskStageApi(taskId, destinationStageId, newIndex);
    response = {...response, taskId, sourceStageId, destinationStageId, newIndex}
    return response; // Assuming the response contains the updated task
});

// Async thunk for updating task order
export const updateTaskOrder = createAsyncThunk('tasks/updateTaskOrder', async (
    { taskId, sourceStageId, srcNewTasksOrder, newIndex }
) => {
    let response = {taskId, sourceStageId, newTasksOrder: srcNewTasksOrder, newIndex}
    updateTaskOrderApi(taskId, srcNewTasksOrder);
    return response; // Assuming the response contains the updated task
});

export const getTasksByStage = createAsyncThunk('tasks/getTasksByStage', async ({ stages, page }) => {

    let singleColumnTasks = await Promise.all(
        stages.map(async (stage, index) => {
            let singleColumnTasks = {
                stageId: '',
                stageName: '',
                tasks: [],
                hasMore: false,
                currentPage: 1,
            };

            let res = await getTasksByStageApi((stage._id), page);

            singleColumnTasks.stageId = stage._id;
            singleColumnTasks.stageName = stage.name;
            singleColumnTasks.tasks = res.tasks;
            singleColumnTasks.hasMore = res.hasMore;
            singleColumnTasks.currentPage = res.currentPage;
            
            return singleColumnTasks
        })
    )

    return singleColumnTasks
});

export const loadMoreTasks = createAsyncThunk('tasks/loadMoreTasks', async ({ id }, {getState}) => {
    const { tasks } = getState().tasksData;

    // Use map to create an array of promises
    let res = {};

    await Promise.all(
        tasks.map(async (tasksObj) => {
            const { stageId, hasMore, currentPage } = tasksObj;

            if (stageId === id && hasMore) {
                res = await getTasksByStageApi(stageId, +currentPage + 1);
                return
            }
        })
    );
    res = {...res, stageId: id}

    return res; // Return the array of results
});

export const addTask = createAsyncThunk('tasks/addTask', async ({ task, id }) => {
    const res = await addTaskApi(task, id);
    return res; // Assuming the response contains the added task
});

// Async thunk for deleting a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async ({taskId, stageId}) => {
    await deleteTaskApi(taskId);
    return {taskId, stageId}; // Return the ID of the deleted task
});

// Async thunk for getting a task
export const getTask = createAsyncThunk('tasks/getTask', async (taskId) => {
    const response = await getTaskApi(taskId);
    return response; // Assuming the response contains the task
});

// Async thunk for updating a task
export const patchTask = createAsyncThunk('tasks/patchTask', async ({stageId, newTask}) => {
    const response = patchTaskApi(newTask);
    return {stageId, patchedTask: newTask}; // Assuming the response contains the updated task
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        tasksSliceLoading: false,
        tasksSliceError: null,
    },
    reducers: {
        resetTasks: (state) => {
            state.tasks = [];
            state.hasMore = true;
        },
        updateTaskOrder: async(state, action) => {
            const { sourceStageId, newTasksOrder } = action.payload;
            const sourceColumnIndex = state.tasks.findIndex(tasksObj => tasksObj.stageId === sourceStageId);
            
            // Create a new array for updated tasks based on newTasksOrder
            const updatedTasks = newTasksOrder.map(taskId => {
                return current(state).tasks[sourceColumnIndex].tasks.find(task => task._id === taskId);
            });
            
            // Create a new state object to avoid direct mutation
            const newTasks = current(state.tasks).map((tasksObj, index) => {
                if (tasksObj.stageId === sourceStageId) {
                    // Create a new tasks array with the updated order
                    return {
                        ...tasksObj,
                        tasks: updatedTasks // Assign the reordered tasks
                    };
                }
                return tasksObj; // Return the original tasksObj for other stages
            });
            state.tasks = newTasks 
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateTaskStage.fulfilled, (state, action) => {
                const {taskId, sourceStageId, destinationStageId, newIndex} = action.payload;
                let targetTask = null;
                let sourceColumIndex = null;

                current(state.tasks).forEach((tasksObj, index) => {

                    if(tasksObj.stageId === sourceStageId){
                        let filteredTasks = tasksObj.tasks.filter((task) =>{
                            if(task._id === taskId){
                                targetTask = task
                            }
                            return task._id !== taskId
                        })
                        state.tasks[index].tasks = filteredTasks
                    }
                    else if(tasksObj.stageId === destinationStageId){
                        sourceColumIndex = index
                    }
                })
                state.tasks[sourceColumIndex].tasks.splice(newIndex, 0, targetTask);
            })    
            .addCase(updateTaskOrder.fulfilled, (state, action) => {
                tasksSlice.caseReducers.updateTaskOrder(state, action);
            })
            .addCase(getTasksByStage.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTasksByStage.fulfilled, (state, action) => {
                state.tasks = action.payload ? action.payload : state.tasks
                state.loading = false;
            })
            .addCase(getTasksByStage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(loadMoreTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadMoreTasks.fulfilled, (state, action) => {
                const {tasks, stageId, hasMore, currentPage} = action.payload
                
                action.payload && state.tasks.map((tasksObj, index) =>{
                    if(tasksObj.stageId === stageId){
                        const updateTasks = [...current(state.tasks[index].tasks), ...tasks]

                        state.tasks[index].tasks = updateTasks; // Add the new task to the tasks array
                        state.tasks[index].hasMore = hasMore; // Add the new task to the tasks array
                        state.tasks[index].currentPage = currentPage; // Add the new task to the tasks array
                    }  
                });

                state.loading = false;
            })
            .addCase(loadMoreTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const newTask = action.payload;
                const targetStageId = newTask.stageId;

                state.tasks.find((tasksObj, index) => {
                    if(tasksObj.stageId === targetStageId){
                        state.tasks[index].tasks.push(newTask); // Add the new task to the tasks array
                    }
                   return
                })
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const {taskId, stageId} = action.payload;
                
                state.tasks.find((tasksObj, index) => {
                    if(tasksObj.stageId === stageId){
                        state.tasks[index].tasks = state.tasks[index].tasks.filter(task => task._id !== taskId); // Add the new task to the tasks array
                    }
                   return
                })
            })
            .addCase(getTask.fulfilled, (state, action) => {
                // const index = state.tasks.findIndex(task => task._id === action.payload._id);
                // if (index !== -1) {
                //     state.tasks[index] = action.payload; // Update the task in the state
                // }
            })
            .addCase(patchTask.fulfilled, (state, action) => {
                const {stageId, patchedTask} = action.payload;
                
                state.tasks.find((tasksObj, index) => {
                    if(tasksObj.stageId === stageId){
                        state.tasks[index].tasks.find((task, tIndex) => task._id === patchedTask._id && state.tasks[index].tasks.splice(tIndex, 1, patchedTask)); // Add the new task to the tasks array
                    }
                   return
                })
            });
    },
});

export const { } = tasksSlice.actions; // Export any additional actions if needed
export default tasksSlice.reducer;