import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import fontSizes from '../types/fontSize';

const CustomHeader = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      <CustomText style={styles.headerTitle} weight="bold">{title}</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  headerTitle: {
    
    fontSize: fontSizes.header,
  },
});

export default CustomHeader;
