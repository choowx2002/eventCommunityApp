import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import EventsDetails from '../screens/events/EventsDetails'; // Import your DetailsScreen
import EventsList from '../screens/events/EventsList';

const Stack = createStackNavigator();

// home stack is use to show the screen that will route from home screen
// contain homeScreen, eventDetails, and EventList
// maybe will add more later

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false}}/>
      <Stack.Screen name="eDetails" component={EventsDetails} />
      <Stack.Screen name="eList" component={EventsList} />
    </Stack.Navigator>
  );
};

export default HomeStack;