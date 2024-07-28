import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import TabNavigationComponent from './src/navigator/TabNavigationComponent';
import {getData, setValue} from './src/utils/storageHelper';
import {ThemeProvider} from './src/utils/themesChecker';
import { SafeAreaView } from 'react-native';
import { screens } from './src/types/screensConfig';

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

  if (isFirstTime === null) {
    return null;
  }

  return (
    <ThemeProvider>
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isFirstTime ? 'welcome' : 'main'}>
            <Stack.Screen name="welcome" component={WelcomeScreen} options={{headerShown: false}} />
            <Stack.Screen name="main" component={TabNavigationComponent} options={{headerShown: false}} />
            {screens.map(({ name, component, options }) => (
              <Stack.Screen
                key={name}
                name={name}
                component={component}
                options={options}
              />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </ThemeProvider>
  );
};
export default App;
