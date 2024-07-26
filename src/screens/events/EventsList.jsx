import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {hideTabBarAndHeader, showTabBarAndHeader} from '../../utils/NavigationUtils'

const EventsList = () => {
  const navigation = useNavigation();

  useEffect(() => {
    hideTabBarAndHeader(navigation);
    return () => {
      showTabBarAndHeader(navigation);
    };
  }, [navigation]);

  return (
    <View>
      <Text>EventsList</Text>
    </View>
  );
};

export default EventsList;
