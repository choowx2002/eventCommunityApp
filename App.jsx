import React, {useEffect, useState} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import TabNavigationComponent from './src/navigator/TabNavigationComponent';
import {getData} from './src/utils/storageHelperUtil';
import {ThemeProvider} from './src/utils/themesUtil';
import {SafeAreaView} from 'react-native';
import {screens} from './src/types/screensConfig';
import Toast from 'react-native-toast-message';
import { initSQLiteDB } from './src/services/sqliteServices';
import { getHostName } from './src/services/api';

const Stack = createStackNavigator();

const App = () => {
  const [isFirstTime, setIsFirstTime] = useState(null);
  const navigationRef = useNavigationContainerRef();
  useEffect(() => {
    const checkFirstTime = async () => {
      const isLogin = await getData('userData');
      if (isLogin === null) {
        initSQLiteDB();//initialize sqlite table
        console.log(getHostName())
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
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName={isFirstTime ? 'welcome' : 'main'}>
            <Stack.Screen
              name="welcome"
              component={WelcomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="main"
              component={TabNavigationComponent}
              options={{headerShown: false}}
            />
            {screens.map(({name, component, options}) => (
              <Stack.Screen
                key={name}
                name={name}
                component={component}
                options={options}
              />
            ))}
          </Stack.Navigator>
          <Toast
            onPress={() => {
              Toast.hide();
              navigationRef.navigate('main', {screen: 'Notifications'});
            }}
          />
        </NavigationContainer>
      </SafeAreaView>
    </ThemeProvider>
  );
};
export default App;
