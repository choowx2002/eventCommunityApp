import {Pressable, View} from 'react-native';
import React from 'react';
import {themeStyles, globalStyle} from '../styles/globalStyles';
import CustomText from './CustomText';

// Example
//  <CustomButton
//  icon ={<Ionicons name="search-outline" color={theme.text} size={fontSizes.title} />}
//  theme = 'primary'
//  fontSize = {fontSizes.title}
//  iconEnd = {true}
// >123</CustomButton>

/**
 * custom button - children should be text only
 * 
 * @param {string} theme - bw(default), primary, secondary, danger
 * @param {React.Element} icon - Icon component to render inside the button
 * @param {boolean} iconEnd - Icon placement end if true
 * @param fontSize - use text size from fontSize.js
 * @returns - button ui
 */
const CustomButton = ({
  theme,
  fontSize,
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
    case 'bw':
    default:
      buttonTheme = themeStyles().bwButton;
  }
  return (
    <Pressable style={[buttonTheme, globalStyle.Button, style]} {...props}>
      {icon && !iconEnd && <View style={{marginRight: 8}}>{icon}</View>}
      <CustomText weight="bold" style={[buttonTheme, {fontSize: fontSize}]}>
        {children}
      </CustomText>
      {icon && iconEnd && <View style={{marginRight: 8}}>{icon}</View>}
    </Pressable>
  );
};

export default CustomButton;
