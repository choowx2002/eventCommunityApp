import {Pressable, View} from 'react-native';
import React from 'react';
import {themeStyles, globalStyle} from '../styles/globalStyles';
import CustomText from './CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    <Pressable style={[buttonTheme, globalStyle.Button, style]} {...props}>
      {icon && !iconEnd && <View style={{marginRight: 8}}>{icon}</View>}
      <CustomText weight="bold" style={[buttonTheme, {fontSize: textSize}]}>
        {children}
      </CustomText>
      {icon && iconEnd && <View style={{marginRight: 8}}>{icon}</View>}
    </Pressable>
  );
};

// custom button for back button
// need to pass the navigation props in parameter
export const BackButton = ({
  navigation,
  float = true,
  showBg = true,
  ...props
}) => {
  const themeStyle = themeStyles().bwButton2;

  return (
    <Pressable
      style={[
        float ? globalStyle.backFloatButton : '',
        globalStyle.backButton,
        themeStyle,
        !showBg && {backgroundColor: 'transparent'},
      ]}
      {...props}
      onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={26} color={themeStyle.color} />
    </Pressable>
  );
};

export default CustomButton;
