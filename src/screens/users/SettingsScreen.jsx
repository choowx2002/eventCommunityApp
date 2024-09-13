import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomButton, { BackButton } from '../../components/CustomButton';
import { useTheme } from '../../utils/themesUtil';
import CustomText from '../../components/CustomText';
import { setValue } from '../../utils/storageHelperUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { disconnectSocket, unsubscribe_all } from '../../services/socket';
import { deleteUser } from '../../services/userApi.service';
import { removeAllEvents } from '../../services/sqliteServices';

const SettingsScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [systheme, setTheme] = useState();
  const [UID, setUID] = useState('');
  const [enableNotification, setEnableNotification] = useState(true);

  useEffect(() => {
    getMultiple();
  }, []);

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteUser(UID);
              if (result) {
                disconnectSocket();
                removeAllEvents();
                AsyncStorage.clear();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'main' }],
                });
              }
            } catch (error) {
              Alert.alert('Error', 'There was an error deleting your account.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  getMultiple = async () => {
    let values;
    values = await AsyncStorage.multiGet(['theme', 'enableNotification', 'userData']);
    setTheme(JSON.parse(values[0][1]));
    setEnableNotification(JSON.parse(values[1][1]));
    setUID(JSON.parse(values[2][1]).id);
    console.log(values);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomText style={styles.title}>SETTINGS</CustomText>

      {/* Themes Picker */}
      <View style={styles.settingGroup}>
        <CustomText style={styles.label}>Themes</CustomText>
        <Picker
          selectedValue={systheme}
          style={{
            backgroundColor: theme.themedBackground,
            color: theme.primaryText,
          }}
          onValueChange={(itemValue) => {
            setValue('theme', itemValue).then(() => {
              setTheme(itemValue);
              toggleTheme();
            });
          }}
        >
          <Picker.Item label="System" value="system" />
          <Picker.Item label="Light" value="light" />
          <Picker.Item label="Dark" value="dark" />
        </Picker>
        <CustomText style={styles.label}>Receive Notification</CustomText>
        <Picker
          selectedValue={enableNotification}
          style={{
            backgroundColor: theme.themedBackground,
            color: theme.primaryText,
          }}
          onValueChange={(itemValue) => {
            setValue('enableNotification', itemValue).then(() => {
              setEnableNotification(itemValue);
              unsubscribe_all();
            });
          }}
        >
          <Picker.Item label="Enable" value="1" />
          <Picker.Item label="Disable" value="0" />
        </Picker>
      </View>

      <CustomButton style={{ marginBottom: 20 }} theme="danger" onPress={handleDelete}>
        DELETE ACCOUNT
      </CustomButton>
      <CustomButton
        theme="secondary"
        onPress={() => {
          disconnectSocket();
          removeAllEvents();
          AsyncStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: 'main' }],
          });
        }}
      >
        LOG OUT
      </CustomButton>
      <BackButton navigation={navigation} showBg={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingGroup: {
    rowGap: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
  },
});

export default SettingsScreen;
