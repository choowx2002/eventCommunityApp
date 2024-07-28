import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomText from './CustomText';
import fontSizes from '../types/fontSize';
import {useTheme} from '../utils/themesChecker';
import Ionicons from 'react-native-vector-icons/Ionicons';



// by using the details passed from tab nav we get the page name, 
// what to show or what not to show such as search button/create events and more
const CustomHeader = ({headerDetails}) => {
  const {theme} = useTheme();
  return (
    <View style={[styles.headerContainer, {backgroundColor: theme.background}]}>
      <CustomText
        style={[styles.headerTitle]}
        weight="bold">
        {headerDetails.headerName}
      </CustomText>

      <View style={styles.rightIconsContainer}>
        <Ionicons name="search-outline" color={theme.text} size={26} />
        <Ionicons name="add-circle-outline" color={theme.text} size={26} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rightIconsContainer:{
    flexDirection: 'row',
    gap: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: fontSizes.header,
  },
});

export default CustomHeader;
