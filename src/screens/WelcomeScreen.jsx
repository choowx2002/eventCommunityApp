import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import CustomText from '../components/CustomText';
import fontSizes from '../types/fontSize';
import { useTheme } from '../utils/ThemesChecker';

const WelcomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <View
      style={[
        styles.Container,
        { backgroundColor: theme.background }
      ]}
    >
      <View style={{ verticalAlign: 'middle', height: '50%', marginHorizontal: '10%' }}>
        <CustomText
          style={[styles.Title, { color: theme.text }]}
          weight="semiBoldItalic"
        >
          Welcome To EMC
        </CustomText>
        <CustomText
          style={[styles.Descriptions, { color: theme.text }]}
        >
          Join a vibrant community where events come to life. Explore local and
          global events, share your experiences, and connect with others who
          share your passions. Together, we make every event memorable!
        </CustomText>
      </View>

      <Pressable
        style={[styles.Button, { backgroundColor: theme.secondary }]}
        onPress={() => navigation.replace('main', { screen: 'Home' })}
      >
        <CustomText
          style={[styles.ButtonText, { color: theme.text }]}
          weight="bold"
        >
          CONTINUE
        </CustomText>
      </Pressable>

      <Pressable
        style={[styles.ToggleButton, { backgroundColor: theme.primary }]}
        onPress={toggleTheme}
      >
        <CustomText
          style={[styles.ToggleButtonText, { color: theme.text }]}
        >
          Current Theme: {theme.text}
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
