import React from 'react';
import { Text } from 'react-native';
import {getFontFamily} from '../types/customFonts'
import { themeStyles } from '../styles/globalStyles';

/**
 * 
 * @param {string} weight -  regular(default), bold, italic, boldItalic, light, medium, semiBold, semiBoldItalic
 * @param {string} colors -  Description(default), text, background, cardBackground,primary, secondary, accent, dangerBg, dangerText
 * */
const CustomText = ({ children, weight, colors, style, ...props }) => {
  return (
    <Text style={[getFontFamily(weight), colors, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
