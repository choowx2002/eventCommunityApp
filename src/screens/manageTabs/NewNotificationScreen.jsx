import {View, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {globalStyle} from '../../styles/globalStyles';
import CustomButton, {BackButton} from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import {useTheme} from '../../utils/themesChecker';
import {useRoute} from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import {formData} from '../../components/FormHook';
import fontSizes from '../../types/fontSize';
import CustomModel from '../../components/AlertModal';

const NewNotificationScreen = ({navigation}) => {
  const {theme} = useTheme();
  const route = useRoute();
  const [eventId, setEventId] = useState(null);
  const [alertAction, setAlertAction] = useState('');
  const [alertState, setAlertState] = useState(false); //for alert modal shown
  const [formValues, handleFormValueChange, validateForm] = formData({
    data: {
      title: '',
      message: '',
    },
    requiredData: ['title', 'message'],
    error: {},
  });

  useEffect(() => {
    const {eventId: routeId} = route.params || {}; // Get eventId from route parameters
    if (!routeId) return navigation.goBack();
    setEventId(routeId);
  }, [route.params]);

  const dynamicStyles = StyleSheet.create({
    header: {
      backgroundColor: theme.cardBackground,
    },
    page: {
      backgroundColor: theme.background,
    },
    errorText: {
      fontSize: fontSizes.small,
      color: theme.dangerBg,
    },
  });

  const showAlert = (action) => {
    setAlertAction(action)
    setAlertState(true);
  };

  //function to hide alert
  const hideAlert = (proceed) => {
    switch (alertAction.action) {
        case 'back':
            if(proceed) navigation.goBack()
            break;
        case 'submit':
            if(proceed) submitMessage()
            break;
        default:
            break;
    }
    setAlertState(false);
  };

  const validateMessageForm = () => {
    console.log(formValues);
    if (!validateForm()) return;
    showAlert({action: 'submit', title: 'Are you sure to export CSV?', theme: 'primary'})
  };

  const goBack = () =>{
    console.log(formValues);
    if(formValues.data.title || formValues.data.message) showAlert({action: 'back', title: 'Are you sure to cancel this notification?', theme: 'danger'})
    else navigation.goBack()
  }

  const submitMessage = () => {
    navigation.goBack();
  };

  return (
    <View style={[dynamicStyles.page, styles.page]}>
      <View style={[globalStyle.header, dynamicStyles.header]}>
        <BackButton onPressFc={goBack} navigation={navigation} float={false} showBg={false} />
        <CustomText weight="bold" style={globalStyle.headerTitle}>
          New Notification
        </CustomText>
      </View>
      <View style={styles.formContainer}>
        <View>
          <CustomInput
            label="Title:"
            formKey="title"
            placeholder="Enter notification title"
            handleFormValueChange={handleFormValueChange}
          />
          {formValues?.errors?.title?.length > 0 &&
            formValues?.errors?.title?.map((value, key) => {
              return (
                <CustomText
                  style={[styles.errorText, dynamicStyles.errorText]}
                  weight="semiBold"
                  key={key}>
                  {value}
                </CustomText>
              );
            })}

          {/* Message Input */}
          <CustomInput
            label="Message:"
            formKey="message"
            placeholder="Enter notification message"
            textInputProps={{
              multiline: true,
              numberOfLines: 4,
            }}
            handleFormValueChange={handleFormValueChange}
          />
          {formValues?.errors?.message?.length > 0 &&
            formValues?.errors?.message?.map((value, key) => {
              return (
                <CustomText
                  style={[styles.errorText, dynamicStyles.errorText]}
                  weight="semiBold"
                  key={key}>
                  {value}
                </CustomText>
              );
            })}
        </View>

        <CustomButton style={styles.submitButton} theme={'primary'} onPress={validateMessageForm}>
          Send Message
        </CustomButton>
      </View>
      <CustomModel
            title={alertAction?.title}
            themeColor={alertAction?.theme}
            isVisible={alertState}
            onClose={()=>hideAlert(false)}
            onConfirm={()=>hideAlert(true)}
          />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  errorText: {
    marginLeft: 10,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  submitButton: {
    marginBottom : 10,
    marginHorizontal: 10,
  }
});
export default NewNotificationScreen;
