"use client"

import React, { useState, useEffect } from "react";
import StageColumn from "@/app/components/Stage/stageColumn";
import { useDispatch, useSelector } from "react-redux";
import { addStage, deleteStage, fetchProject, setStages, setStageTasksOrder } from "@/Store/projectSlice";
import { getTasksByStage, updateTaskOrder, updateTaskStage } from "@/Store/tasksSlice";

// import { useRouter } from 'next/router';

const Project = ({
  params
}:{
  params: { projectId: string }
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStage, setNewStage] = useState({ name: "" });
    const [currentPage, setCurrentPage] = useState(1);

    const [activeCard, setActiveCard] = useState({
      stageId: null,
      stageIndex: null,
      cardId: null,
    })

    const dispatch = useDispatch()
    const unwrappedParams = React.use(params);
    const id = unwrappedParams.projectId;

    const projectData = useSelector((data) => data.projectData);
    const {project, stages, loading, error}= projectData;
    
    useEffect(() => {
        if (stages?.length) {
            dispatch(getTasksByStage({ stages, page: currentPage }));
        } else{
            dispatch(fetchProject(id))
        }
    }, [id, stages, dispatch]);
    
    const tasksData = useSelector((data) => data.tasksData);
    const {tasks, tasksSliceLoading, tasksSliceError} = tasksData;

    const handleAddStage = () => {  
      if (newStage.name.trim() === "") return;

      dispatch(addStage({ stageName: newStage.name, projectId: id }));
      setIsModalOpen(false);
      setNewStage({ name: "" });
    };

    const handleDelete = (stageId) => {
        dispatch(deleteStage(stageId));
    };

    const onDrop = async (destination, source) => {
      const { activeCard } = source;
      console.log(destination, source)
      if (!destination) return;

      if (
          activeCard.stageId === destination.id &&
          activeCard.stageIndex === destination.index 
      ) {
          return;
      } else if (
          activeCard.stageId === destination.id &&
          destination.index === activeCard.stageIndex + 1
      ) {
          return;
      }
      try {
          const newStages = [...stages]; // Use stages from Redux store
          let stageIndex = null
          
          const sourceStage = newStages.find((stage, index) => {
            if(stage._id === activeCard.stageId){
                stageIndex = index
                return stage._id === activeCard.stageId
            }
          });
          
          const destinationStage = newStages.find((stage) => stage._id === destination.id);

          const sourceTaskIds = Array.from(sourceStage.taskIds);
          const destinationTaskIds = Array.from(destinationStage.taskIds);

          if (activeCard.stageId === destination.id) {
            const [movedTaskId] = sourceTaskIds.splice(activeCard.stageIndex, 1);
            sourceTaskIds.splice(destination.index, 0, movedTaskId);
          } else {
            const [movedTaskId] = sourceTaskIds.splice(activeCard.stageIndex, 1);
            destinationTaskIds.splice(destination.index, 0, movedTaskId);
          }

          // Call handleDragEnd to update the backend
          handleDragEnd(activeCard.cardId, sourceStage._id, destination.id, destination.index, sourceTaskIds, stageIndex);

      } catch (error) {
          console.error("Failed to update task stage:", error);
      }
  };

  const handleDragEnd = async (taskId, sourceStageId, destinationStageId, newIndex, newTasksOrder, stageIndex) => {
      try {
          if (sourceStageId !== destinationStageId) {
              await dispatch(updateTaskStage({ taskId, sourceStageId, destinationStageId, newIndex }));
          } else {
              await dispatch(setStageTasksOrder({stageIndex, newTasksOrder}))
              await dispatch(updateTaskOrder({ taskId, sourceStageId, newTasksOrder, newIndex }));
          }
      } catch (error) {
          console.error("Failed to update task stage/order in backend:", error);
      }
  };

    if (loading || tasksSliceLoading) {
        return <p>Loading...</p>;
    }

    return(
        <React.Fragment>
            <p>Project - {id}</p>
            <p>Project Name - {project && project.name}</p>
            <p>Project Description - {project && project.description}</p>
            <p>Task Id - {activeCard.cardId}</p>
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-blue-500 text-white p-2 rounded"
            >
                Add Stage
            </button>
            <div className="stages" style={{display: 'flex'}}>
            
            {
              (!tasksSliceLoading && tasks) && tasks.map((task, index) => {
                // console.log(task)
                // tasks && 
                return(
                  //   stage={stage}
                <StageColumn
                  key={index} 
                  stages={stages}
                  id={task.stageId}
                  title={tasks.stageName}
                  handleDelete={handleDelete}
                  setActiveCard={setActiveCard}
                  activeCard={activeCard}
                  stageData={stages}
                  tasks={task.tasks}
                  // moveTask={moveTask}
                  // updateOrder={updateOrder}
                  onDrop={onDrop}
                />
              )
              }
            )
            }
            {/* {
              stages && stages.map((stage, index) => stage && (
                <StageColumn
                  key={index} 
                  stage={stage}
                  stages={stages}
                  id={stage._id}
                  title={stage.name}
                  handleDelete={handleDelete}
                  setActiveCard={setActiveCard}
                  activeCard={activeCard}
                  stageData={stages}
                  // moveTask={moveTask}
                  // updateOrder={updateOrder}
                  onDrop={onDrop}
                />
              ))
            } */}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-bold mb-4">Add New Stage</h2>

                    <input
                        type="stage"
                        placeholder="Stage name"
                        value={newStage.name}
                        onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                        className="border p-2 w-full mb-4"
                    />

                    <div className="flex justify-end">
                        <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-400 text-white p-2 rounded mr-2"
                        >
                        Cancel
                        </button>
                        <button onClick={handleAddStage} className="bg-blue-500 text-white p-2 rounded">
                            Add Stage
                        </button>
                    </div>
                    </div>
                </div>
                )}
            </div>
        </React.Fragment>
    ) 
};

export default Project;