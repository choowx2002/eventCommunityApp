import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Use to get data from AsyncStorage
 * @param {string} key - The key for the value to retrieve
 * @return {Promise<string|null>} - The value if key exists or null otherwise
 */
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(value);
    return value !== null ? JSON.parse(value) : null;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Use to set data into AsyncStorage
 * @param {string} key - The key under which to store the value
 * @param {any} value - The value to store
 */
export const setValue = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
  }
};
