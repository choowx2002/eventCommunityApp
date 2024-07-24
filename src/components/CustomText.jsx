import React from 'react';
import { Text } from 'react-native';
import {getFontFamily} from '../types/customFonts'

const CustomText = ({ children, weight, style, ...props }) => {
  return (
    <Text style={[getFontFamily(weight), style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
