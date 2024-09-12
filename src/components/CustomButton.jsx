import { Pressable, View } from 'react-native';
import React from 'react';
import { themeStyles, globalStyle } from '../styles/globalStyles';
import CustomText from './CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../utils/themesUtil';

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
 * @param textSize - use text size from fontSize.js
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
    case 'tertiary':
      buttonTheme = themeStyles().tertiaryButton;
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
      {icon && !iconEnd && <View style={{ marginRight: 8 }}>{icon}</View>}
      <CustomText weight="bold" style={[buttonTheme, { fontSize: textSize }]}>
        {children}
      </CustomText>
      {icon && iconEnd && <View style={{ marginRight: 8 }}>{icon}</View>}
    </Pressable>
  );
};

// custom button for back button
// 
/**
 * A customizable back button component.
 * 
 * @param navigation - need to pass the navigation props in parameter
 * @param float - true(default)/false - float left top.
 * @param showBg - true(default)/false - show background.
 * @param onPressFc- The function to execute when trigger onPress. (default is goBack())
 */
export const BackButton = ({
  navigation,
  float = true,
  showBg = true,
  onPressFc = () => navigation.goBack(),
  ...props
}) => {
  const themeStyle = themeStyles().tertiaryButton;
  const { theme } = useTheme();

  return (
    <Pressable
      style={[
        float ? globalStyle.backFloatButton : '',
        globalStyle.backButton,
        themeStyle,
        !showBg && { backgroundColor: 'transparent' },
      ]}
      {...props}
      onPress={onPressFc}>
      <Ionicons name="arrow-back-outline" size={26} style={{color: theme.primaryBG}} />
    </Pressable>
  );
};

export const NaviagteMapButton = ({
  navigation,
  float = true,
  showBg = true,
  data,
  onPressFc = () => navigation.navigate('map', { data }),
  ...props
}) => {
  const themeStyle = themeStyles().bwButton2;
  const { theme } = useTheme();

  return (
    <Pressable
      style={[
        float ? globalStyle.rTopFloatButton : '',
        globalStyle.backButton,
        themeStyle,
        !showBg && { backgroundColor: 'transparent' },
      ]}
      {...props}
      onPress={onPressFc}>
      <Ionicons name="navigate-circle-outline" size={26} color={themeStyle.primary} style={{color: theme.primaryBG}} />
    </Pressable>
  );
};


/**
 * Floating Action Button (FAB)
 *
 * @param {string} theme - primary, secondary, tertiary, danger
 * @param {React.Element} icon - Icon component to render inside the button
 * @param {function} onPress - Function to execute when button is pressed
 * @param {boolean} visible - Visibility of the FAB button (default true)
 * @returns - FAB UI component
 */
export const FabButton = ({ theme, icon, onPress, visible = true, style, ...props }) => {
  if (!visible) return null;

  let buttonTheme;
  switch (theme) {
    case 'primary':
      buttonTheme = themeStyles().primaryButton;
      break;
    case 'secondary':
      buttonTheme = themeStyles().secondaryButton;
      break;
    case 'tertiary':
      buttonTheme = themeStyles().tertiaryButton;
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
    <Pressable style={[globalStyle.fab, buttonTheme, style]} onPress={onPress} {...props}>
      {icon ? (
        <View>{icon}</View>
      ) : (
        <Ionicons name="add-outline" size={26} color={buttonTheme.color} />
      )}
    </Pressable>
  );
};

export default CustomButton;
