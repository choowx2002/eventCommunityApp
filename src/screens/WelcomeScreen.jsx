import React, { useState } from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import PagerView from 'react-native-pager-view';
import CustomText from '../components/CustomText';
import fontSizes from '../types/fontSize';
import { useTheme } from '../utils/themesUtil';
import CustomButton from '../components/CustomButton';
import { setValue } from '../utils/storageHelperUtil';

const WelcomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (e) => {
    setCurrentPage(e.nativeEvent.position);
  };

  const indicators = (totalPages) => (
    <View style={styles.indicatorContainer}>
      {[...Array(totalPages)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            currentPage === index ? { backgroundColor: theme.primaryBG } : { backgroundColor: theme.tertiaryText },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.Container, { backgroundColor: theme.background }]}>
      <PagerView style={styles.pagerView} initialPage={0} onPageSelected={handlePageChange}>
        {/* First Page: Welcome Message and Theme Toggler */}
        <View key="1" style={styles.page}>
          <Pressable style={styles.rightTop} onPress={() => navigation.replace('main', { screen: 'Home' })}>
            <CustomText style={styles.skipText}>Skip</CustomText>
          </Pressable>
          <CustomText style={[styles.Title]} weight="semiBoldItalic">
            Welcome To Event Community Application
          </CustomText>
          <CustomButton
            onPress={() => {
              setValue('theme', theme.isDarkMode ? 'light' : 'dark').then(() => {
                toggleTheme();
              });
            }}
            style={{ marginTop: 20, width: '50%' }}
            theme="primary"
          >
            Change Theme
          </CustomButton>
        </View>

        {/* Second Page: Image and Description */}
        <View key="2" style={styles.page}>
          <Pressable style={styles.rightTop} onPress={() => navigation.replace('main', { screen: 'Home' })}>
            <CustomText style={styles.skipText}>Skip</CustomText>
          </Pressable>
          <Image source={require('../assets/images/welcomescreen.jpg')} style={styles.image} resizeMode="cover" />
          <CustomText style={[styles.Descriptions]}>
            Join a vibrant community where events come to life. Explore local and global events, share your experiences,
            and connect with others who share your passions. Together, we make every event memorable!
          </CustomText>
        </View>

        {/* Third Page: Create Account, Login or Skip */}
        <View key="3" style={styles.page}>
          <CustomText style={[styles.Title]} weight="bold">
            Get Started!
          </CustomText>
          <CustomButton
            onPress={() => navigation.navigate('signup')}
            style={{ marginTop: 20, width: '50%' }}
            theme="primary"
          >
            Create Account
          </CustomButton>
          <CustomButton
            onPress={() => navigation.navigate('login')}
            style={{ marginTop: 20, width: '50%' }}
            theme="secondary"
          >
            Login
          </CustomButton>
          <Pressable style={styles.rightTop} onPress={() => navigation.replace('main', { screen: 'Home' })}>
            <CustomText style={styles.skipText}>Skip</CustomText>
          </Pressable>
        </View>
      </PagerView>

      {indicators(3)}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagerView: {
    flex: 1,
    width: '100%',
  },
  page: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    flex: 1,
  },
  Title: {
    textAlign: 'center',
    fontSize: fontSizes.xxxlarge,
    marginBottom: 20,
  },
  Descriptions: {
    textAlign: 'center',
    fontSize: fontSizes.body,
    marginTop: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  skipText: {
    marginTop: 20,
    fontSize: fontSizes.body,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  rightTop: { top: 0, right: '10%', position: 'absolute' },
});

export default WelcomeScreen;
