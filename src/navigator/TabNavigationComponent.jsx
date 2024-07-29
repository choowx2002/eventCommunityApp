import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import CustomHeader from '../components/CustomHeader';
import {useTheme} from '../utils/themesChecker';

const Tab = createBottomTabNavigator();

const App = () => {
  const {theme} = useTheme();
  //list out the things in bottom tab
  const menuItems = [
    {
      screenName: 'HomeStack',
      iconName: 'home',
      component: HomeScreen,
      headerName: 'Home',
    },
    {
      screenName: 'Events',
      iconName: 'planet',
      component: HomeScreen,
      headerName: 'Events',
    },
    {
      screenName: 'Notifications',
      iconName: 'notifications',
      component: HomeScreen,
      headerName: 'Notifications',
    },
    {
      screenName: 'Profile',
      iconName: 'person',
      component: HomeScreen,
      headerName: 'Profile',
    },
  ];

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.background,
          elevation: 0,
        },
        header: ({route}) => {
          // using custom header for diff tabs screen
          const item = menuItems.find(menu => menu.screenName === route.name);
          return <CustomHeader headerDetails={item} />;
        },
      }}>
      {/* literate the menu items and show in bottom tab */}
      {menuItems.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.screenName}
          component={item.component}
          options={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: theme.primary,
            tabBarIcon: ({color}) => (
              <Ionicons name={item.iconName} color={color} size={26} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default App;
