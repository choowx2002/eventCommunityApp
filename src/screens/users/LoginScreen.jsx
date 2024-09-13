import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, ToastAndroid } from 'react-native';
import { useTheme } from '../../utils/themesUtil';
import CustomText from '../../components/CustomText';
import fontSizes from '../../types/fontSize';
import { userLoginWithEmail } from '../../services/userApi.service';
import CustomButton, { BackButton } from '../../components/CustomButton';
import { getData, setValue } from '../../utils/storageHelperUtil';

const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      return Alert.alert('Please fill up the email and password. (ToT)/~~~');
    }
    if (!validEmail.test(email)) {
      return Alert.alert('Please ensure your email follows this format: example@domain.com.');
    }
    if (password.length < 6) {
      return Alert.alert('Password must be at least 6 characters long');
    }
    userLoginWithEmail({
      email: email,
      password: password,
    })
      .then((res) => {
        if (!res) {
          setEmail('');
          setPassword('');
          return Alert.alert('Email or password is incorrect QAQ. \nPlease try again ヾ(•ω•`)o');
        }
        ToastAndroid.show('Successfully Login! 😁', ToastAndroid.SHORT);
        setValue('userData', res.data.user);
        navigation.replace('main', { screen: 'Home' });
      })
      .catch(() => {});
  };

  useEffect(() => {
    getData('userData').then((res) => {
      if (res) navigation.replace('main', { screen: 'Home' });
    });
  }, []);

  const themeStyles = StyleSheet.create({
    InputText: {
      paddingHorizontal: 10,
      paddingVertical: 0,
      borderWidth: 0,
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
      <CustomText style={styles.title} weight="bold">
        WELCOME BACK!
      </CustomText>
      <CustomText style={styles.subtitle}>Login to continue</CustomText>
      <CustomText style={themeStyles.labelText}>Email</CustomText>
      <TextInput value={email} onChangeText={setEmail} style={themeStyles.InputText} autoFocus={true} />
      <CustomText style={themeStyles.labelText}>Password</CustomText>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={themeStyles.InputText} />
      <CustomButton style={{ marginVertical: 20 }} onPress={handleLogin}>
        LOGIN
      </CustomButton>
      <TouchableOpacity onPress={() => navigation.navigate('signup')}>
        <CustomText style={[styles.link, { color: theme.primaryBG }]}>Create Account</CustomText>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  link: {
    marginTop: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
