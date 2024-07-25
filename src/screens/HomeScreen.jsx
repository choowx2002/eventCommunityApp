import React from 'react';
import {View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../utils/ThemesChecker';
const HomeScreen = () => {
  const {theme} = useTheme();
  return (
    <View style={{backgroundColor: theme.background, height: '100%'}}>
      
    </View>
  );
};

export default HomeScreen;
