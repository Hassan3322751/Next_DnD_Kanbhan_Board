"use client";

import { Card, CardContent, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert, Delete, Edit } from "@mui/icons-material";
import { useState } from "react";

const TaskCard = ({ id, stageId, index, title, description, dueDate, handleTaskDelete, handleTaskEdit, setActiveCard }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      className={`transition-all ${
        isDragging ? "shadow-2xl scale-105" : "shadow-lg"
      } bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl p-5 cursor-grab hover:shadow-2xl hover:scale-105 duration-200`}
      draggable
      onDragStart={() => {
        setActiveCard({ stageId, stageIndex: index, cardId: id });
        setIsDragging(true);
      }}
      onDragEnd={() => {
        setActiveCard({ stageId: null, stageIndex: null, cardId: null });
        setIsDragging(false);
      }}
    >
      <CardContent className="space-y-4 relative">

        <div className="flex justify-between items-center">
          <Typography variant="h6" className="font-bold text-lg">
            {title}
          </Typography>
          
          <IconButton onClick={handleMenuOpen} className="text-gray-500 dark:text-gray-400">
            <MoreVert />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            className="rounded-lg shadow-xl"
          >
            <MenuItem
              onClick={() => {
                handleTaskEdit(id);
                handleMenuClose();
              }}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Edit fontSize="small" className="mr-2 text-blue-500" /> Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleTaskDelete({ taskId: id, stageId });
                handleMenuClose();
              }}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-red-500"
            >
              <Delete fontSize="small" className="mr-2" /> Delete
            </MenuItem>
          </Menu>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard