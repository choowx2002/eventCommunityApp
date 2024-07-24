import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import colors from '../types/colors';

const ThemeContext = createContext({
  theme: colors.light,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const initialTheme = Appearance.getColorScheme() === 'dark' ? colors.dark : colors.light;
  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = () => {
    setTheme(prevTheme =>
      prevTheme === colors.light ? colors.dark : colors.light
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
