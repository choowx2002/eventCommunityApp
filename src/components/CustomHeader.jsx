import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import fontSizes from '../types/fontSize';
import { useTheme } from '../utils/themesUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

/**
 * by using the details passed from tab nav we get the page name,
 * what to show or what not to show such as search button/create events and more
 */
const CustomHeader = ({ headerDetails }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
      <CustomText style={[styles.headerTitle]} weight="bold">
        {headerDetails.headerName}
      </CustomText>

      <View style={styles.rightIconsContainer}>
        {headerDetails.headerName === 'Notifications'? (
          // set custom header for notification screen 
          <Ionicons
            name="trash-outline"
            color={theme.text}
            size={26}
          />
         ): (headerDetails.headerName === 'Events')? (
          <Ionicons
            name="search-outline"
            color={theme.text}
            size={26}
            onPress={() => navigation.navigate('search')}
          />
         ): (
          <>
            <Ionicons
              name="search-outline"
              color={theme.text}
              size={26}
              onPress={() => navigation.navigate('search')}
            // onPress={() => navigation.navigate('personalEList',{listType: 'manage'})}
            />
            <Ionicons
              name="add-circle-outline"
              color={theme.text}
              size={26}
              onPress={() => navigation.navigate('create')}
            />
          </>
         )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rightIconsContainer: {
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
