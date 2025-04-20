"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";

export const ProjectCard = ({ id, name, description, createdAt, handleDelete, handleEdit }) => {
  const theme = useSelector((state) => state.theme.theme);
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  return (
    <Card
      className={`w-80 shadow-lg transition-all duration-300 p-2 rounded-xl border 
        ${theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}
    >
      <CardContent>
        <Link href={`/project/${id}`} className="no-underline">
          <Typography variant="h6" className="font-semibold truncate">
            {name}
          </Typography>
          <Typography variant="body2" className="text-gray-500 truncate">
            {description}
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            {createdAt}
          </Typography>
        </Link>
        <div className="flex justify-end">
          <IconButton onClick={openMenu} className="text-gray-500">
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
            <MenuItem onClick={() => { handleEdit(id); closeMenu(); }}>Edit</MenuItem>
            <MenuItem onClick={() => { handleDelete(id); closeMenu(); }} className="text-red-500">Delete</MenuItem>
          </Menu>
        </div>
      </CardContent>
    </Card>
  );
};