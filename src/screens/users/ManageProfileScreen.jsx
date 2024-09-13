import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, ToastAndroid, LogBox } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomText from '../../components/CustomText';
import { useTheme } from '../../utils/themesUtil';
import fontSizes from '../../types/fontSize';
import CustomButton, { BackButton } from '../../components/CustomButton';
import { getData, setValue } from '../../utils/storageHelperUtil';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns/format';
import { updateUser } from '../../services/userApi.service';
import { useRoute } from '@react-navigation/native';



const ManageProfileScreen = ({ navigation }) => {
  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
  const { theme } = useTheme();
  const route = useRoute();
  // User info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [birthday, setBirthday] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [UID, setUID] = useState("")

  const handleSignup = () => {
    if ( !birthday || !firstName || !lastName) {
      return Alert.alert('Please fill up all the field. (ToT)/~~~');
    }

    updateUser(UID, {
      first_name: firstName,
      last_name: lastName,
      birth: format(birthday, 'yyyy-MM-dd'),
      gender: gender,
    }).then((res) => {
      if (!res) return Alert.alert('Something goes wrong QAQ. \nPlease try again ヾ(•ω•`)o');
      ToastAndroid.show('Successfully Update! 😁', ToastAndroid.SHORT);
      setValue('userData', res.data.user);
      if (route.params.refresh) route.params.refresh();
      navigation.goBack();
    });
  };

  useEffect(() => {
    getData('userData').then((res) => {
      if (res) {
        setUID(res.id);
        setFirstName(res.first_name);
        setLastName(res.last_name);
        setBirthday(res.birth);
        setGender(res.gender);
      }else {
        navigation.reset({
          index: 1,
          routes: [{ name: 'main' }, {name: "login"}],
        });
      }
    });
  }, []);

  const themeStyles = StyleSheet.create({
    InputText: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderWidth: 0,
      marginBottom: 15,
      borderBottomWidth: 1,
      borderColor: theme.themedBackground,
      color: theme.tertiaryText,
      backgroundColor: 'transparent',
    },
    labelText: {
      fontSize: fontSizes.medium,
      marginBottom: 0,
      paddingTop: 10,
      color: theme.tertiaryText,
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomText style={styles.title}>MANAGE PROFILE</CustomText>

      {/* Personal information inputs */}
      <CustomText style={themeStyles.labelText}>First Name</CustomText>
      <TextInput value={firstName} onChangeText={setFirstName} style={themeStyles.InputText} />
      <CustomText style={themeStyles.labelText}>Last Name</CustomText>
      <TextInput value={lastName} onChangeText={setLastName} style={themeStyles.InputText} />
      <CustomText style={themeStyles.labelText}>Gender</CustomText>
      <Picker selectedValue={gender} style={themeStyles.InputText} onValueChange={(itemValue) => setGender(itemValue)}>
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Prefer Not To Say" value="prefer not to say" />
      </Picker>
      <CustomText style={themeStyles.labelText}>Birthday</CustomText>
      <View>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <CustomText style={[themeStyles.InputText, {paddingTop: 10}]}>{birthday?format(birthday, 'yyyy-MMM-dd'):null}</CustomText>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            display="default"
            onChange={(res) => {
              setShowDatePicker(false);
              setBirthday(res.nativeEvent.timestamp)
            }}
          />
        )}
      </View>

      <CustomButton style={{ marginVertical: 10 }} onPress={handleSignup}>
        CHANGE
      </CustomButton>

      <BackButton navigation={navigation} showBg={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  signupButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  signupButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 5,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default ManageProfileScreen;
