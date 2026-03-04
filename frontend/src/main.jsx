import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

//Mantine Imports
//MantineProvider: theming and global styles
//ColorSchemeScript: manages light/dark mode preferences for serverside rendering
import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";

// Main Entry Point
createRoot(document.getElementById("root")).render(
  <>
    <ColorSchemeScript defaultColorScheme="auto" />
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </>,
);
