import React, { createContext, useState, useContext } from 'react';
import { Appearance } from 'react-native';
import colors from '../types/colors';
import { getData } from './storageHelperUtil';

// Create a ThemeContext with default values
const ThemeContext = createContext({
  theme: colors.light, // Default theme
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Determine the initial theme based on the device's color scheme
  const systemTheme = Appearance.getColorScheme() === 'dark' ? colors.dark : colors.light;
  let initialTheme = systemTheme;
  
  const [theme, setTheme] = useState(initialTheme);
  // Function to switch between light and dark themes
  const toggleTheme = async () => {
    const storedTheme = await getData('theme');
    if (storedTheme === 'dark') {
      setTheme(colors.dark);
    } else if (storedTheme === 'light') {
      setTheme(colors.light);
    } else {
      setTheme(systemTheme);
    }
  };

  // Provide the theme and toggle function to the context
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// Custom hook to use the ThemeContext easily in other components
export const useTheme = () => useContext(ThemeContext);
