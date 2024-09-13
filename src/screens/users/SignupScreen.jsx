import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomText from '../../components/CustomText';
import { useTheme } from '../../utils/themesUtil';
import fontSizes from '../../types/fontSize';
import CustomButton, { BackButton } from '../../components/CustomButton';
import { createUserAccount } from '../../services/userApi.service';
import { getData, setValue } from '../../utils/storageHelperUtil';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns/format';


const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

const SignupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  // Signup credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // User info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [birthday, setBirthday] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSignup = () => {
    if (!email || !password || !birthday || !firstName || !lastName) {
      return Alert.alert('Please fill up all the field. (ToT)/~~~');
    }
    if (!validEmail.test(email)) {
      return Alert.alert('Please ensure your email follows this format: example@domain.com.');
    }
    if (password.length < 6) {
      return Alert.alert('Password must be at least 6 characters long');
    }
    if (password !== confirmPassword) {
      return Alert.alert("Passwords don't match");
    }
    createUserAccount({
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      birth: format(birthday, 'yyyy-MM-dd'),
      gender: gender,
    }).then((res) => {
      if (!res) return Alert.alert('Something goes wrong QAQ. \nPlease try again ヾ(•ω•`)o');
      ToastAndroid.show('Successfully sign up! 😁', ToastAndroid.SHORT);
      setValue('userData', res.data.user);
      navigation.replace('interests');
    });
  };

  useEffect(() => {
    getData('userData').then((res) => {
      if (res) navigation.replace('main', { screen: 'Home' });
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
      <CustomText style={styles.title}>WELCOME TO ECA!</CustomText>
      <CustomText style={styles.subtitle}>Sign up to join more interesting events</CustomText>

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

      {/* Email and password inputs */}
      <CustomText style={themeStyles.labelText}>Email</CustomText>
      <TextInput value={email} onChangeText={setEmail} style={themeStyles.InputText} />
      <CustomText style={themeStyles.labelText}>Password</CustomText>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={themeStyles.InputText} />
      <CustomText style={themeStyles.labelText}>Confirm Password</CustomText>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={themeStyles.InputText}
      />

      {/* Signup Button */}
      <CustomButton style={{ marginVertical: 10 }} onPress={handleSignup}>
        SIGN UP
      </CustomButton>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <CustomText style={[styles.link, { color: theme.primaryBG }]}>Have Account? Login Now</CustomText>
      </TouchableOpacity>
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

export default SignupScreen;
