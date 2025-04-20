"use client";

import { Paper, Skeleton, Box } from "@mui/material";

const StageColumnSkeleton = () => {
  return (
    <Paper className="w-80 p-4 rounded-lg shadow-md" elevation={3}>
      {/* Header skeleton */}
      <Box className="flex justify-between items-center mb-2">
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="circular" width={30} height={30} />
      </Box>
      {/* Add Task button skeleton */}
      <Skeleton variant="rectangular" width="100%" height={40} className="mb-4" />
      {/* Drop area skeleton */}
      <Skeleton variant="rectangular" width="100%" height={60} className="mb-4" />
      {/* Simulated list of tasks skeletons */} 
      {Array.from({ length: 3 }).map((_, idx) => (
        <Box key={idx} className="mb-2">
          <Skeleton variant="rectangular" width="100%" height={50} />
        </Box>
      ))}
    </Paper>
  );
};

export default StageColumnSkeleton;
