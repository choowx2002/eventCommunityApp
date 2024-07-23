/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import TabNavigationComponent from './src/navigator/TabNavigationComponent';
import {getData, setValue} from './src/utils/StorageHelper';

const Stack = createStackNavigator();

const App = () => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      const firstTime = await getData('isFirstTime');
      if (firstTime === null) {
        // await setValue('isFirstTime', false);
        setIsFirstTime(true);
      } else {
        setIsFirstTime(false);
      }
    };

    checkFirstTime();
  }, []);

  if(isFirstTime === null) {
    return null
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={isFirstTime? 'welcome' : 'main'}>
        <Stack.Screen name="welcome" component={WelcomeScreen} />
        <Stack.Screen name="main" component={TabNavigationComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
