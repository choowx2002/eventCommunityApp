import {lazy} from 'react';
import SeacrhScreen from '../screens/events/SeacrhScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';

const EventsDetails = lazy(() => import('../screens/events/EventsDetails'));
const EventsList = lazy(() => import('../screens/events/EventsList'));

// Define the configuration for event-related screens
// The name of the screen for navigation
// The component to be rendered for this screen
// Additional options for the screen (if applicable) ,title, headerShown or others props
//
//App
// │
// ├── WelcomeScreen (fixed)
// │
// ├── Main (Tab Navigation)
// │   ├── Home Screen
// │   ├── Other Tab Screens 
// │
// └── Other Screens (if any)

export const screens = [
  {
    name: 'eDetails',
    component: EventsDetails,
    options: {
      title: 'Event Details',
      headerShown: false,
    },
  },
  {
    name: 'eList',
    component: EventsList,
    options: {},
  },
  {
    name: 'search',
    component: SeacrhScreen,
    options: {
      headerShown: false
    }
  },
  {
    name:'create',
    component: CreateEventScreen,
    options: {
      headerShown: false
    }
  }
];
