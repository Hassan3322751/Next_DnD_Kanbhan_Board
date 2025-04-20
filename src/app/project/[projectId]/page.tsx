"use client"

import React, { useState, useEffect } from "react";
import StageColumn from "@/app/components/Stage/stageColumn";
import { useDispatch, useSelector } from "react-redux";
import { Button, Paper, Skeleton, Typography } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

import { addStage, deleteStage, fetchProject, setStageTasksOrder } from "@/Store/projectSlice";
import { updateTaskOrder, updateTaskStage } from "@/Store/tasksSlice";
import StageColumnSkeleton from "@/skeletons/stageColumnSkelton"
import StageModal from "@/components/stageColumn/modal"

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

    const theme = useSelector((state) => state.theme.theme);
    const isDarkMode = theme === "dark";
    
    useEffect(() => {
      dispatch(fetchProject({id, dispatch}))
    }, [id]);
    
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
          let srcStageIndex = null
          let destStageIndex = null
          
          const sourceStage = newStages.find((stage, index) => {
            if(stage._id === activeCard.stageId){
                srcStageIndex = index
                return stage._id === activeCard.stageId
            }
          });
          
          // const destinationStage = newStages.find((stage) => stage._id === destination.id);
          const destinationStage = newStages.find((stage, index) => {
            if(stage._id === destination.id){
                destStageIndex = index
                return stage._id === destination.id
            }
          });

          const sourceTaskIds = Array.from(sourceStage.taskIds);
          const destinationTaskIds = Array.from(destinationStage.taskIds);

          if (activeCard.stageId === destination.id) {
            const [movedTaskId] = sourceTaskIds.splice(activeCard.stageIndex, 1);
            if(destination.index > activeCard.stageIndex){
              sourceTaskIds.splice(destination.index - 1, 0, movedTaskId);
            } else{
              sourceTaskIds.splice(destination.index, 0, movedTaskId);
            }
          } else {
            const [movedTaskId] = sourceTaskIds.splice(activeCard.stageIndex, 1);
            destinationTaskIds.splice(destination.index, 0, movedTaskId);
          }

          // Call handleDragEnd to update the backend
          handleDragEnd(activeCard.cardId, sourceStage._id, destination.id, destination.index, 
          sourceTaskIds, srcStageIndex, destinationTaskIds, destStageIndex);

      } catch (error) {
          console.error("Failed to update task stage:", error);
      }
  };

  const handleDragEnd = async (taskId, sourceStageId, destinationStageId,
    newIndex, srcNewTasksOrder, srcStageIndex, destNewTasksOrder, destStageIndex
  ) => {
      try {
          if (sourceStageId !== destinationStageId) {
            dispatch(updateTaskStage({ taskId, sourceStageId, destinationStageId, newIndex }));
            dispatch(setStageTasksOrder({srcStageIndex, srcNewTasksOrder, destStageIndex, destNewTasksOrder}))
          } else {
            dispatch(updateTaskOrder({ taskId, sourceStageId, srcNewTasksOrder, newIndex }));
            dispatch(setStageTasksOrder({srcStageIndex, srcNewTasksOrder}))
          }
      } catch (error) {
          console.error("Failed to update task stage/order in backend:", error);
      }
  };

    return(
        <React.Fragment>
           <div className="p-4 space-y-4">
            {/* Project Details */}
            <Paper
      elevation={isDarkMode ? 8 : 4}
      className={`p-6 rounded-2xl transition-all duration-300 
        ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"} 
        shadow-lg backdrop-blur-lg border border-gray-300/10 dark:border-gray-800/50`}
      sx={{
        backdropFilter: "blur(10px)", // Frosted glass effect
      }}
    >
      <>
        <Typography variant="h6" className="font-semibold opacity-80">
          Project - {id || <Skeleton variant="text" width="50%" height={40} />}
        </Typography>

        <Typography variant="h5" className="font-bold">
          {project?.name || <Skeleton variant="text" width="50%" height={40} />}
        </Typography>

        <Typography variant="body1" className="opacity-70">
          {project?.description || <Skeleton variant="text" width={"40%"} height={40} className="mt-2" />}
        </Typography>

        <Typography variant="body2" className="text-sm opacity-60 mt-2">
          Task ID: {activeCard?.cardId || "No Active Task"}
        </Typography>
      </>
    </Paper>

            {/* Add Stage Button */}
            <Button
                variant="contained"
                startIcon={<AddCircleOutline />}
                onClick={() => setIsModalOpen(true)}
                disabled={loading}
                className="!bg-blue-500 hover:!bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition"
            >
                Add Stage
            </Button>

            {/* Stages */}
            <div className="stages flex flex-wrap gap-4 mt-4">
                {(loading || stages?.length) ? (
                    tasks.map((task, index) => (
                        <StageColumn
                            key={index}
                            stages={stages}
                            id={task.stageId}
                            title={task.stageName}
                            handleDelete={handleDelete}
                            setActiveCard={setActiveCard}
                            activeCard={activeCard}
                            stageData={stages}
                            tasks={task.tasks}
                            onDrop={onDrop}
                            hasMore={task.hasMore}
                        />
                    ))
                ) : (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <StageColumnSkeleton key={idx} />
                  ))
                )}
            </div>

            <StageModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              stageName={newStage}
              setStageName={setNewStage}
              handleSubmit={handleAddStage}
            />
        </div>
        </React.Fragment>
    ) 
};

export default Project;