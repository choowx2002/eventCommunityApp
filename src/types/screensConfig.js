import SearchScreen from '../screens/events/SearchScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import PersonalEventList from '../screens/events/PersonalEventList';
import ManageEventScreen from '../screens/events/ManageEventScreen';
import NewNotificationScreen from '../screens/manageTabs/NewNotificationScreen';
import MapView from '../screens/MapView';
import EventsDetails from '../screens/events/EventsDetails';
import NotificationDetailsScreen from '../screens/NotificationDetailsScreen.jsx';
import LoginScreen from '../screens/users/LoginScreen.jsx';
import SignupScreen from '../screens/users/SignupScreen.jsx';
import InterestsScreen from '../screens/users/InterestsScreen.jsx';
import ManageProfileScreen from '../screens/users/ManageProfileScreen.jsx';
import SettingsScreen from '../screens/users/SettingsScreen.jsx';

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
    name: 'search',
    component: SearchScreen,
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
  },
  {
    name:'personalEList',
    component: PersonalEventList,
    options:{
      headerShown: false
    },
  },
  {
    name:'manageEvent',
    component: ManageEventScreen,
    options:{
      headerShown: false
    },
  },
  {
    name:'newNotification',
    component: NewNotificationScreen,
    options:{
      headerShown: false
    },
  },
  {
    name:'map',
    component: MapView,
    options:{
      headerShown: false
    },
  },
  {
    name: 'notificationDetails',
    component: NotificationDetailsScreen,
    options: {
      title: 'Notification Details',
    },
  },
  {
    name: "login",
    component: LoginScreen,
    options: {
      headerShown: false
    },
  },
  {
    name: "signup",
    component: SignupScreen,
    options: {
      headerShown: false
    },
  },
  {
    name: "interests",
    component: InterestsScreen,
    options: {
      headerShown: false
    },
  },
  {
    name: "manageProfile",
    component: ManageProfileScreen,
    options: {
      headerShown: false
    },
  },
  {
    name: "settings",
    component: SettingsScreen,
    options: {
      headerShown: false
    },
  },
];
