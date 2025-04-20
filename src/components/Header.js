"use client"

import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/store/themeSlice";
import Link from "next/link";

const Header = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.54)", // Semi-transparent white
        backdropFilter: "blur(10px)", // Frosted glass effect
        color: theme === "dark" ? "#fff" : "#111827", // Text color based on theme
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Custom shadow
      }}
    >
      <Toolbar className="flex justify-between items-center px-4">
        <Typography variant="h6" className="font-semibold">
          Kanban Board
        </Typography>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-blue-500 transition duration-200">
            Home
          </Link>
          <Link href="/projects" className="hover:text-blue-500 transition duration-200">
            Projects
          </Link>
          <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
            {theme === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;


// "use client";

// import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
// import { Brightness4, Brightness7 } from "@mui/icons-material";
// import { useDispatch, useSelector } from "react-redux"
// import { toggleTheme } from "@/store/themeSlice";
// import Link from "next/link";

// const Header = () => {
//   const dispatch = useDispatch();
//   const theme = useSelector((state) => state.theme.theme);

//   return (
//     <AppBar position="static" className="bg-white dark:bg-gray-900">
//       <Toolbar className="flex justify-between">
//         <Typography variant="h6" className="text-primary dark:text-white">
//           Kanban Board
//         </Typography>
//         <div className="flex items-center gap-4">
//           <Link href="/" className="text-gray-900 dark:text-white">Home</Link>
//           <Link href="/projects" className="text-gray-900 dark:text-white">Projects</Link>
//           <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
//             {theme === "dark" ? <Brightness7 /> : <Brightness4 />}
//           </IconButton>
//         </div>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;

