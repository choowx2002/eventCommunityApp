import React, {useEffect, useState} from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import TabNavigationComponent from './src/navigator/TabNavigationComponent';
import {getData, setValue} from './src/utils/StorageHelper';
import { ThemeProvider } from './src/utils/ThemesChecker';

const Stack = createStackNavigator();

const App = () => {
  const [isFirstTime, setIsFirstTime] = useState(null);

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
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={isFirstTime? 'welcome' : 'main'}>
          <Stack.Screen name="welcome" component={WelcomeScreen} />
          <Stack.Screen name="main" component={TabNavigationComponent} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};
export default App;
