import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '../components/CustomText';
import fontSizes from '../types/fontSize';
import {useTheme} from '../utils/themesUtil';
import CustomButton from '../components/CustomButton';
import { themeStyles } from '../styles/globalStyles';
import colors from '../types/colors';

const WelcomeScreen = ({navigation}) => {
  const {theme, toggleTheme} = useTheme();
  return (
    <View style={[styles.Container, {backgroundColor: theme.background}]}>
      <View
        style={{
          verticalAlign: 'middle',
          height: '50%',
          marginHorizontal: '10%',
        }}>
        <CustomText style={[styles.Title, {color: theme.description}]}>
          Welcome To EMC
        </CustomText>
        <CustomText style={[styles.Descriptions, {color: theme.description}]} >
          Join a vibrant community where events come to life. Explore local and
          global events, share your experiences, and connect with others who
          share your passions. Together, we make every event memorable!
        </CustomText>
      </View>

      <CustomButton
        onPress={() => navigation.replace('main', {screen: 'Home'})}
        style={{marginTop: 10, width: '50%'}}
        theme="primary">
        WELCOME
      </CustomButton>

      <CustomButton
        onPress={toggleTheme}
        style={{marginTop: 10}}
        theme="tertiary">
        Change Theme
      </CustomButton>
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
    fontSize: fontSizes.xxxlarge,
    marginBottom: 20,
  },
  Descriptions: {
    fontSize: fontSizes.body,
    textAlign: 'justify',
  },
});

export default WelcomeScreen;
