import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { themeColors } from "./colors";

const platformFonts = {
  system:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  default: "Open Sans, system-ui, Avenir, Helvetica, Arial, sans-serif",
  windows: "Segoe UI, Arial, sans-serif",
  ios: '-apple-system, BlinkMacSystemFont, "San Francisco", Arial, sans-serif',
  android: "Roboto, Arial, sans-serif",
  macos:
    '-apple-system, BlinkMacSystemFont, "San Francisco", Arial, sans-serif',
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export function ThemeProvider({ children }) {
  const [colorScheme, setColorScheme] = useState(() => {
    return localStorage.getItem("colorScheme") || "light";
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem("primaryColor") || "maroon";
  });

  const [platform, setPlatform] = useState(() => {
    return localStorage.getItem("platform") || "default";
  });

  const [fontSize, setFontSize] = useState(() => {
    const storedFontSize = localStorage.getItem("fontSize");
    return storedFontSize ? parseInt(storedFontSize, 10) : 16;
  });

  useEffect(() => {
    localStorage.setItem("colorScheme", colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    localStorage.setItem("primaryColor", primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    localStorage.setItem("platform", platform);
  }, [platform]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  const toggleColorScheme = (value) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };

  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
  };

  const currentColors = themeColors[primaryColor] || themeColors.ocean;

  const theme = useMemo(
    () =>
      createTheme({
        primaryColor: "primary",
        colors: {
          primary: currentColors.primary,
          secondary: currentColors.secondary,
          accent: currentColors.accent,
          success: currentColors.success,
          warning: currentColors.warning,
          error: currentColors.error,
        },
        defaultRadius: "md",
        fontFamily: platformFonts[platform] || platformFonts.default,
        fontSizes: {
          xs: `${fontSize * 0.625}px`,
          sm: `${fontSize * 0.75}px`,
          md: `${fontSize * 0.875}px`,
          lg: `${fontSize}px`,
          xl: `${fontSize * 1.125}px`,
        },
        components: {
          Button: {
            defaultProps: {
              color: "primary",
            },
          },
          ActionIcon: {
            defaultProps: {
              color: "primary",
            },
          },
          NavLink: {
            defaultProps: {
              color: "primary",
            },
          },
        },
      }),
    [currentColors, platform, fontSize],
  );

  const value = {
    colorScheme,
    primaryColor,
    toggleColorScheme,
    changePrimaryColor,
    currentColors,
    platform,
    setPlatform,
    fontSize,
    changeFontSize,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
        <Notifications />
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
}
