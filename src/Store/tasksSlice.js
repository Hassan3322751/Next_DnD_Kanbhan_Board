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
    { taskId, sourceStageId, newTasksOrder, newIndex }
) => {
    let response = {taskId, sourceStageId, newTasksOrder, newIndex}
    updateTaskOrderApi(taskId, newTasksOrder);
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

// export const getTasksByStage = createAsyncThunk('tasks/getTasksByStage', async ({ stages, page }) => {
//     let finalTasks = []
    
//     let singleColumnTasks = await Promise.all(
//         stages.map(async (stage, index) => {
//             let singleColumnTasks = {
//                 stageId: '',
//                 stageName: '',
//                 tasks: []
//             };

//             let tasks = await Promise.all(
//                 stage.taskIds.map(async (taskId, index) => {
//                     const task = await getTaskApi(taskId, page);
//                     return task
//                 })
//             )
//             singleColumnTasks.stageId = stage._id;
//             singleColumnTasks.stageName = stage.name;
//             singleColumnTasks.tasks = tasks;
            
//             return singleColumnTasks
//             // finalTasks.push(singleColumnTasks)
//         })
//     )
//     // console.log(singleColumnTasks)

//     return singleColumnTasks
//     // return response; // Assuming the response contains tasks and hasMore
// });

// Async thunk for adding a task

export const addTask = createAsyncThunk('tasks/addTask', async ({ task, stageId }) => {
    const response = await addTaskApi(task, stageId);
    return response; // Assuming the response contains the added task
});

// Async thunk for deleting a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
    await deleteTaskApi(taskId);
    return taskId; // Return the ID of the deleted task
});

// Async thunk for getting a task
export const getTask = createAsyncThunk('tasks/getTask', async (taskId) => {
    const response = await getTaskApi(taskId);
    return response; // Assuming the response contains the task
});

// Async thunk for updating a task
export const patchTask = createAsyncThunk('tasks/patchTask', async (task) => {
    const response = await patchTaskApi(task);
    return response; // Assuming the response contains the updated task
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
                state.tasks[sourceColumIndex].tasks.splice(newIndex, 0, targetTask !== null && targetTask);
            })
            .addCase(updateTaskOrder.fulfilled, (state, action) => {
                // Update the task order in the state if needed
                const updatedTask = action.payload;
                const {taskId, sourceStageId, newIndex} = updatedTask

                let targetTask = {};
                let taskIndex = null;
                let sourceColumIndex = null;

                current(state.tasks).forEach((tasksObj, index) => {

                    if(tasksObj.stageId === sourceStageId){

                        tasksObj.tasks.map((task, taskInd) =>{
                            if(task._id === taskId){
                                targetTask = task
                                sourceColumIndex = index
                                taskIndex = taskInd
                            }
                            return task._id !== taskId
                        })
                        return
                    }
                })
                state.tasks[sourceColumIndex].tasks.splice(taskIndex, 1);
                state.tasks[sourceColumIndex].tasks.splice(newIndex, 0, targetTask !== null && targetTask);
            })
            .addCase(getTasksByStage.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTasksByStage.fulfilled, (state, action) => {
                action.payload && action.payload.map((tasksObj, index) =>{
                  state.tasks.push(tasksObj)  
                });
                state.loading = false;

                // console.log("state Tasks: ")
                // console.log(current(state.tasks))

                // state.hasMore = action.payload.hasMore;
            })
            .addCase(getTasksByStage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload); // Add the new task to the tasks array
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(task => task._id !== action.payload); // Remove the deleted task
            })
            .addCase(getTask.fulfilled, (state, action) => {
                action.payload && state.tasks.push(action.payload);
                // const index = state.tasks.findIndex(task => task._id === action.payload._id);
                // if (index !== -1) {
                //     state.tasks[index] = action.payload; // Update the task in the state
                // }
            })
            .addCase(patchTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task._id === action.payload._id);
                if (index !== -1) {
                    state.tasks[index] = action.payload; // Update the task in the state
                }
            });
    },
});

export const { } = tasksSlice.actions; // Export any additional actions if needed
export default tasksSlice.reducer;