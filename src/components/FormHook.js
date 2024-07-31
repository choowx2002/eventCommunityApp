import {useState} from 'react';
import _ from 'lodash';

export const formData = values => {
  const [formValues, setFormValues] = useState({
    ...values,
  });

  /**
   * Handles changes in formValues.
   * 
   * @param key - the key of value.
   * @param value - form new value.
   * @param errorKey - key for the error
   * @param errors - The list of errors for the key changes
   */
  const handleFormValueChange = (key, value, errorKey, errors = []) => {
    setFormValues({
      ...formValues,
      data: {
        ...formValues.data,
        [key]: value,
      },
      errors: {...formValues?.errors, [errorKey]: errors},
    });
  };

  /**
   * Validates the form, ensuring all required fields are filled.
   * 
   * @returns {boolean} 
   */
  const validateForm = () => {
    let isValid = true
    let errorList = {}
    formValues.requiredData.forEach(key=>{
      if(_.isEmpty(formValues.data[key])) {
        isValid = false
        if(key === 'startDate' || key === 'endDate') key = 'date'
        if(key === 'startTime' || key === 'endTime') key = 'time'
        errorList[key] = ['Please fill in the field.']
      }
    })
    if(!isValid){
      setFormValues(prevState=>({
        ...prevState,
        errors: {
          ...prevState.errors,
          ...errorList
        }
      }))
    }
    return isValid
  }

  return [formValues, handleFormValueChange, validateForm];
};
