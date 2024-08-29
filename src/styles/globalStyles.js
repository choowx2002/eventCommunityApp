import {StyleSheet} from 'react-native';
import {useTheme} from '../utils/themesUtil';
import fontSizes from '../types/fontSize';

// for the style that will change by theme
export const themeStyles = () => {
  const {theme} = useTheme();
  return StyleSheet.create({
    bwButton: {
      backgroundColor: theme.text,
      color: theme.cardBackground,
    },
    bwButton2: {
      backgroundColor: theme.cardBackground,
      color: theme.text,
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
  backFloatButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  backButton: {
    borderRadius: 50,
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingRight: 10,
  },
  smallText: {
    fontSize: fontSizes.small
  },
  centerText:{
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.xxlarge,
    lineHeight: 30,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
