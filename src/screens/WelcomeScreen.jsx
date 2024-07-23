import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import CustomText from '../components/CustomText';
import colors from '../types/colors';
import fontSizes from '../types/fontSize';

const WelcomeScreen = ({ navigation }) => {
  // Initialize state to manage the theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Determine current theme colors
  const currentColors = colors[isDarkMode ? 'dark' : 'light'];

  return (
    <View
      style={[
        styles.Container,
        { backgroundColor: currentColors.background }
      ]}
    >
      <View style={{ verticalAlign: 'middle', height: '50%', marginHorizontal: '10%' }}>
        <CustomText
          style={[styles.Title, { color: currentColors.text }]}
          weight="semiBoldItalic"
        >
          Welcome To EMC
        </CustomText>
        <CustomText
          style={[styles.Descriptions, { color: currentColors.text }]}
        >
          Join a vibrant community where events come to life. Explore local and
          global events, share your experiences, and connect with others who
          share your passions. Together, we make every event memorable!
        </CustomText>
      </View>

      <Pressable
        style={[styles.Button, { backgroundColor: currentColors.secondary }]}
        onPress={() => navigation.replace('main', { screen: 'Profile' })}
      >
        <CustomText
          style={[styles.ButtonText, { color: currentColors.text }]}
          weight="bold"
        >
          CONTINUE
        </CustomText>
      </Pressable>

      {/* Toggle Theme Button */}
      <Pressable
        style={[styles.ToggleButton, { backgroundColor: currentColors.primary }]}
        onPress={toggleTheme}
      >
        <CustomText
          style={[styles.ToggleButtonText, { color: currentColors.text }]}
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </CustomText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    textAlign: 'center',
    fontSize: fontSizes.title,
    marginBottom: 20,
  },
  Descriptions: {
    fontSize: fontSizes.body,
  },
  ButtonText: {
    textAlign: 'center',
    fontSize: fontSizes.button,
  },
  Button: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 10,
  },
  ToggleButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  ToggleButtonText: {
    fontSize: fontSizes.body,
  },
});

export default WelcomeScreen;
