import { Pressable, View, StyleSheet } from 'react-native';
import React from 'react';
import { themeStyles, globalStyle } from '../styles/globalStyles';
import CustomText from './CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * Custom button - children should be text only.
 *
 * @param {string} theme - bw(default), primary, secondary, danger.
 * @param {React.Element} icon - Icon component to render inside the button.
 * @param {boolean} iconEnd - Icon placement at the end if true.
 * @param textSize - use text size from fontSize.js.
 * @returns - button UI.
 */
const CustomButton = ({
  theme,
  textSize,
  iconEnd = false,
  icon,
  children,
  style,
  ...props
}) => {
  let buttonTheme;
  switch (theme) {
    case 'primary':
      buttonTheme = themeStyles().primaryButton;
      break;
    case 'secondary':
      buttonTheme = themeStyles().secondaryButton;
      break;
    case 'danger':
      buttonTheme = themeStyles().dangerButton;
      break;
    case 'bw2':
      buttonTheme = themeStyles().bwButton2;
      break;
    case 'bw':
    default:
      buttonTheme = themeStyles().bwButton;
  }

  return (
    <Pressable style={[styles.button, buttonTheme, globalStyle.Button, style]} {...props}>
      {/* Icon at the start */}
      {icon && !iconEnd && <View style={styles.icon}>{icon}</View>}

      {/* Button text */}
      <CustomText weight="bold" style={[styles.text, { fontSize: textSize }]}>
        {children}
      </CustomText>

      {/* Icon at the end */}
      {icon && iconEnd && <View style={styles.icon}>{icon}</View>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    textAlign: 'center',
  },
});

export default CustomButton;