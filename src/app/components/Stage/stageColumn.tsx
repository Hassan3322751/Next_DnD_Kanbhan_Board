
import TaskCard from "../Task/TaskCard";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, deleteTask, getTask, patchTask, loadMoreTasks } from "@/Store/tasksSlice"; // Adjust the import based on your store structure
import DropArea from "../DropArea/DropArea";

import { Button, Typography } from "@mui/material";
import { Delete, AddCircle } from "@mui/icons-material";

import TaskModal from "@/components/tasks/addTaskModal"


const StageColumn = ({ id, tasks, stages, title, handleDelete, activeCard, setActiveCard, stageData,
    onDrop, hasMore 
}) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: null });

    const loadMore = () => {
        dispatch(loadMoreTasks({id}))
    };

    const handleTaskDelete = async (taskId) => {
        dispatch(deleteTask(taskId));
    };

    const handleTaskEdit = async (taskId) => {
        const task = await dispatch(getTask(taskId)).unwrap();
        setNewTask(task);
        setIsModalOpen(true);
    };

    const updateTask = async () => {
        dispatch(patchTask({stageId: id, newTask}));
        setIsModalOpen(false);
        setNewTask({ title: "", description: "", dueDate: null });
    };

    const handleAddTask = async () => {
        dispatch(addTask({ task: newTask, id: id }));
        setIsModalOpen(false);
        setNewTask({ title: "", description: "", dueDate: null });
    };

    return (
        <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4 w-full md:w-80">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <Typography variant="h6" className="text-gray-900 dark:text-white font-semibold">{title}</Typography>
                <Button onClick={() => handleDelete(id)} variant="outlined" color="error" size="small" startIcon={<Delete />}>
                    Delete
                </Button>
            </div>
            
            <Button 
                variant="contained" 
                startIcon={<AddCircle />} 
                onClick={() => setIsModalOpen(true)} 
                className="w-full">
                Add Task
            </Button>

            <DropArea onDrop={() => onDrop({ id, index: 0 }, { activeCard })} />
            
            {tasks && tasks.map((task, index) => (
                <React.Fragment key={task._id}>
                    <TaskCard
                        key={index}
                        index={index}
                        id={task._id}
                        stageId={id}
                        title={task.title}
                        description={task.description}
                        dueDate={task.dueDate}
                        handleTaskDelete={handleTaskDelete}
                        handleTaskEdit={handleTaskEdit}
                        setActiveCard={setActiveCard}
                    />
                    <DropArea onDrop={() => onDrop({ id, index: index + 1 }, { activeCard })} />
                </React.Fragment>
            ))}
            
            {hasMore && (
                <Button 
                    onClick={loadMore} 
                    variant="contained" 
                    color="primary" 
                    className="w-full">
                    Load More
                </Button>
            )}

            <TaskModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            newTask={newTask}
            setNewTask={setNewTask}
            handleAddTask={handleAddTask}
            updateTask={updateTask}
            />
        </section>
    );
};

export default StageColumn;