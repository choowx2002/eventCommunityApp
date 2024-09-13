// src/screens/ProfileScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Use icons from react-native-vector-icons
import { getUserById } from '../../services/userApi.service';
import CustomText from '../../components/CustomText';
import { format } from 'date-fns/format';
import { useTheme } from '../../utils/themesUtil';
import { getData } from '../../utils/storageHelperUtil';
import fontSizes from '../../types/fontSize';
import CustomButton from '../../components/CustomButton';

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [user, setUser] = useState();

  useEffect(() => {
    _getData();
  }, []);

  const _getData = () => {
    getData('userData').then((res) => {
      if (!res){
        return navigation.reset({
          index: 1,
          routes: [{ name: 'main' }, { name: 'login' }],
        });
      }
        
      getUserById(res.id).then((res) => {
        if (!res) return;
        console.log(res);
        if (res?.data?.user) setUser(res.data.user);
      });
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.userInfo}>
        <CustomText style={styles.userName}>
          {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Login Now'}{' '}
          {!user?.gender || user?.gender === 'prefer not to say' ? null : user?.gender === 'male' ? (
            <Icon name="gender-male" size={20} color="blue" />
          ) : (
            <Icon name="gender-female" size={20} color="pink" />
          )}
        </CustomText>
        {user?.birth && (
          <CustomText style={styles.userBirthday}>
            <Icon name="calendar" size={16} color={theme.tertiaryText} /> {format(user.birth, 'yyyy-MMM-dd')}
          </CustomText>
        )}
      </View>

      {/* Buttons for various profile options */}
      <CustomButton style={styles.button} onPress={() => navigation.navigate('personalEList', { listType: 'active' })}>
        Ongoing / Upcoming Events
      </CustomButton>
      <CustomButton style={styles.button} onPress={() => navigation.navigate('personalEList', { listType: 'past' })}>
        Past Events
      </CustomButton>
      <CustomButton style={styles.button} onPress={() => navigation.navigate('personalEList', { listType: 'manage' })}>
        Manage / Create Own Events
      </CustomButton>
      <CustomButton style={styles.button} onPress={() => navigation.navigate('interests')}>
        Manage Interests
      </CustomButton>
      <CustomButton
        style={styles.button}
        onPress={() => navigation.navigate('manageProfile', { refresh: _getData })}
      >
        Manage Profile
      </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  userInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  userName: {
    fontSize: fontSizes.xxxlarge,
  },
  userBirthday: {
    fontSize: 14,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
});

export default ProfileScreen;
