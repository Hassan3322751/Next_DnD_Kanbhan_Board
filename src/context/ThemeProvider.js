"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { setTheme } from "@/store/themeSlice";

// Centralized theme configuration
const themes = {
  light: {
    "--color-primary": "#3B82F6",
    "--color-secondary": "#1E40AF",
    "--color-background": "#F9FAFB",
    "--color-text": "#111827",
  },
  dark: {
    "--color-primary": "#1E3A8A",
    "--color-secondary": "#1E40AF",
    "--color-background": "#111827",
    "--color-text": "#F9FAFB",
  },
};

// Create a custom MUI theme using our centralized theme values
const createMuiThemeCustom = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: themes[mode]["--color-primary"] },
      secondary: { main: themes[mode]["--color-secondary"] },
      background: { default: themes[mode]["--color-background"] },
      text: { primary: themes[mode]["--color-text"] },
    },
  });

export default function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme) || "light";

  // On mount, read the persisted theme from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light";
      dispatch(setTheme(savedTheme));

      // Apply Tailwind CSS classes and set global CSS variables
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      document.documentElement.classList.toggle("light", savedTheme === "light");
      Object.entries(themes[savedTheme]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [dispatch]);

  // Whenever theme changes, update localStorage and global CSS variables
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.classList.toggle("light", theme === "light");
      Object.entries(themes[theme]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [theme]);

  return (
    <MUIThemeProvider theme={createMuiThemeCustom(theme)}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}



// "use client";

// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setTheme } from "@/store/themeSlice"; // Make sure to import your action from the theme slice
// import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";

// const lightTheme = createTheme({ palette: { mode: "light" } });
// const darkTheme = createTheme({ palette: { mode: "dark" } });

// export default function ThemeProvider({ children }) {
//   const dispatch = useDispatch();
//   const theme = useSelector((state) => state.theme.theme) || "light";

//   // On mount, get persisted theme from localStorage and update the store
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedTheme = localStorage.getItem("theme") || "light";
//       dispatch(setTheme(storedTheme));
//       document.documentElement.classList.remove("light", "dark");
//       document.documentElement.classList.add(storedTheme);
//     }
//   }, [dispatch]);

//   // Update localStorage and DOM classes whenever the theme changes
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("theme", theme);
//       document.documentElement.classList.remove("light", "dark");
//       document.documentElement.classList.add(theme);
//     }
//   }, [theme]);

//   return (
//     <MUIThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
//       <CssBaseline />
//       {children}
//     </MUIThemeProvider>
//   );
// }