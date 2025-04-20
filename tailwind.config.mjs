/** @type {import('tailwindcss').Config} */
export default {
    darkMode:"class",
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          foreground: "var(--color-foreground)",
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          background: "var(--color-background)",
          text: "var(--color-text)",
        },
      },
    },
    plugins: [],
  };
  