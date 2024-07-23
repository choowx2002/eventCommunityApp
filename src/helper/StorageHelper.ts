import AsyncStorage from '@react-native-async-storage/async-storage';

/**use to get data from async storage
 * @param key string
 * @return string value if key exists or null otherwise.
 */
export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(value)
    return value !== null ? JSON.parse(value) : null;
  } catch (e) {
    console.error(e);
  }
};

/**use to set data into async storage
 * @param key string
 * @param value any
 */
export const setValue = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
  }
};
