import React, {useState, useRef} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import fontSizes from '../types/fontSize';
import CustomText from './CustomText';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useTheme} from '../utils/themesUtil';
import {findPostcode} from 'malaysia-postcodes';
import {isBefore,  parse} from 'date-fns';

/**
 *
 * @param label - Label for the input field
 * @param formKey - Key for the formValues
 * @param textInputProps - Additional props for the text input like multiline or rows
 * @param placeholder - Placeholder text for the input field
 * @param showLabel - Whether to show the label (default: true)
 * @param pickerType - null(normal input), date, time
 * @param inputStyle - Custom styles input field
 * @param formValues - Form values for validation
 * @param defaultValue - default value for certain input
 * @param handleFormValueChange - Function to change the form in custom FormHook
 */
const CustomInput = ({
  label,
  formKey,
  textInputProps,
  placeholder,
  showLabel = true,
  pickerType, //date or time
  inputStyle,
  formValues,
  defaultValue = null,
  ...props
}) => {
  const [date, setDate] = useState(null);
  const [show, setShow] = useState(false);
  const inputRef = useRef(null);
  const {theme} = useTheme();
  const styles = StyleSheet.create({
    InputBox: {
      paddingHorizontal: 10,
      marginBottom: 15,
    },
    InputText: {
      paddingHorizontal: 10,
      paddingVertical: 0,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: theme.text,
      color: theme.text,
      backgroundColor: theme.cardBackground,
    },
    labelText: {
      fontSize: fontSizes.medium,
      marginBottom: 0,
      paddingTop: 10,
    },
  });

  /**
   * to blur the keyboard after end editing the data/time input
   */
  const _blurInput = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  /**
   * do validation for the date/time input
   */
  const datetimeChange = (event, selectedDateTime) => {
    const currentDateTime = selectedDateTime;
    _blurInput();
    setShow(false);
    setDate(currentDateTime);
    const result =
      pickerType === 'date'
        ? currentDateTime.toLocaleDateString()
        : currentDateTime
    const errorKey = pickerType;
    let errorList = [];

    if (formKey === 'start_date' || formKey === 'end_date') {
      const start_date =
        formKey === 'start_date' ? result : formValues.data.start_date;
      const end_date =
        formKey === 'end_date' ? result : formValues.data.end_date;
      if (
        start_date &&
        end_date &&
        convertDateToTimestamp(start_date) > convertDateToTimestamp(end_date)
      ) {
        console.log('error!!!',start_date,end_date);
        errorList.push('Start date must be before end date');
      }
    }
    if (formKey === 'start_time' || formKey === 'end_time') {
      const start_time =
        formKey === 'start_time' ? result : formValues.data.start_time;
      const end_time =
        formKey === 'end_time' ? result : formValues.data.end_time;
      if (
        start_time &&
        end_time &&
        isBefore(end_time, start_time)
      ) {
        errorList.push('Start time must be before end time');
      }
    }
    props.handleFormValueChange(formKey, result, errorKey, errorList);
  };

  /**
   * do validation for normal text or numeric input
   */
  const validateInput = event => {
    console.log('check'); //testing purpose
    const value = event.nativeEvent.text;
    let errorList = [];
    switch (formKey) {
      case 'postcode':
        if (value.length > 0 && value.length < 5) {
          errorList.push(`${label.split(':')[0]} must be 5 digits`);
        } else {
          const result = findPostcode(value);
          if (!result.found)
            errorList.push(`${label.split(':')[0]} is not valid`);
        }
        break;
      default:
        break;
    }
    props.handleFormValueChange(formKey, value, formKey, errorList);
  };

  return (
    <View style={styles.InputBox}>
      {showLabel && (
        <CustomText style={styles.labelText} weight="semiBold">
          {label}
        </CustomText>
      )}
      {pickerType ? (
        <View>
          <TextInput
            ref={inputRef}
            placeholder={placeholder}
            placeholderTextColor={theme.text}
            style={styles.InputText}
            value={
              date &&
              (pickerType === 'date'
                ? date.toLocaleDateString()
                : date.toLocaleTimeString())
            }
            onFocus={() => setShow(true)}
          />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode={pickerType}
              is24Hour={true}
              display="default"
              onChange={datetimeChange}
            />
          )}
        </View>
      ) : (
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.text}
          style={[styles.InputText, inputStyle]}
          onEndEditing={validateInput}
          onChange={validateInput}
          defaultValue={defaultValue}
          {...textInputProps}
        />
      )}
    </View>
  );
};

const convertDateToTimestamp = (dateString) => {
  return parse(dateString, 'M/d/yyyy', new Date())
}

export default CustomInput;
