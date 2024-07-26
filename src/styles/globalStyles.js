import {StyleSheet} from 'react-native';
import {useTheme} from '../utils/ThemesChecker';


// for the style that will change by theme
export const themeStyles = () => {
  const {theme} = useTheme();
  return StyleSheet.create({
    bwButton:{
        backgroundColor: theme.text,
        color: theme.background,
    },
    primaryButton: {
      backgroundColor: theme.primary,
      color: theme.text,
    },
    secondaryButton: {
      backgroundColor: theme.secondary,
      color: theme.text,
    },
    dangerButton: {
      backgroundColor: theme.dangerBg,
      color: theme.dangerText,
    },
    textColor: {
      color: theme.text,
    },
  });
};


// for the style that can global use and should not use for color or fontsize
export const globalStyle = StyleSheet.create({
  Button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 10,
  },
});
