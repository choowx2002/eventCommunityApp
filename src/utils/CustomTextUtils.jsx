import React from 'react';
import { Text, StyleSheet } from 'react-native';
import {getFontFamily} from './CustomFonts'

const CustomText = ({ children, weight, style, ...props }) => {
  return (
    <Text style={[getFontFamily(weight), style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
