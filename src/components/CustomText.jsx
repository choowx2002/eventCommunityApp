import React from 'react';
import { Text } from 'react-native';
import {getFontFamily} from '../types/customFonts'
import { themeStyles } from '../styles/globalStyles';

/**
 * 
 * @param {string} weight -  regular(default), bold, italic, boldItalic, light, medium, semiBold, semiBoldItalic
 */
const CustomText = ({ children, weight, style, ...props }) => {
  return (
    <Text style={[getFontFamily(weight), themeStyles().textColor, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
