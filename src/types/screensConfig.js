import {lazy} from 'react';

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
      headerShown: true,
    },
  },
  {
    name: 'eList',
    component: EventsList,
    options: {},
  },
];
