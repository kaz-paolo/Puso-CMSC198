import { MantineProvider, createTheme } from '@mantine/core';
import { useState, useEffect, createContext, useContext } from 'react';
import { themeColors } from './colors';

const platformFonts = {
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  default: 'Open Sans, system-ui, Avenir, Helvetica, Arial, sans-serif',
  windows: 'Segoe UI, Arial, sans-serif',
  ios: '-apple-system, BlinkMacSystemFont, "San Francisco", Arial, sans-serif',
  android: 'Roboto, Arial, sans-serif',
  macos: '-apple-system, BlinkMacSystemFont, "San Francisco", Arial, sans-serif',
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

function generateColorShades(baseColor) {
  return [
    lighten(baseColor, 0.9),  //  lightest
    lighten(baseColor, 0.7),  
    lighten(baseColor, 0.5),  
    lighten(baseColor, 0.3),  
    lighten(baseColor, 0.15), 
    lighten(baseColor, 0.05), 
    baseColor,                // base
    darken(baseColor, 0.1),   
    darken(baseColor, 0.2), 
    darken(baseColor, 0.3),   // 9 - darkest
  ];
}

function lighten(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, 
    color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + Math.round(255 * amount))).toString(16)).substr(-2)
  );
}

function darken(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, 
    color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) - Math.round(255 * amount))).toString(16)).substr(-2)
  );
}

export function ThemeProvider({ children }) {
  const [colorScheme, setColorScheme] = useState(() => {
    return localStorage.getItem('colorScheme') || 'light';
  });
  
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('primaryColor') || 'ocean';
  });

  const [platform, setPlatform] = useState(() => {
    return localStorage.getItem('platform') || 'default';
  });

  useEffect(() => {
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    localStorage.setItem('platform', platform);
  }, [platform]);

  const toggleColorScheme = (value) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };

  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
  };

  const currentColors = themeColors[primaryColor] || themeColors.ocean;

  // Mantine theme configuration
  const theme = createTheme({
    primaryColor: 'brand',
    colors: {
      brand: generateColorShades(currentColors.primary),
    },
    defaultRadius: 'md',
    fontFamily: platformFonts[platform] || platformFonts.default,
    components: {
      Button: {
        defaultProps: {
          color: 'brand',
        },
      },
      ActionIcon: {
        defaultProps: {
          color: 'brand',
        },
      },
      NavLink: {
        defaultProps: {
          color: 'brand',
        },
      },
    },
  });

  const value = {
    colorScheme,
    primaryColor,
    toggleColorScheme,
    changePrimaryColor,
    currentColors,
    platform,
    setPlatform,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
}