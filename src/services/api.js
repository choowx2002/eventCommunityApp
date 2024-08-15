import { API_PORT, HOST } from '@env';
export const getLocationAddress = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    );
    const json = await response.json();
    return json.address.state??json.address.city
  } catch (error) {
    console.error(error);
  }
};

export const getHostName = () =>{
  return `http://${HOST}:${API_PORT}`
};

// const hostname = 'http://192.168.1.201:3000';

export const get = async (path, params) => {
  const formattedParams = '?' + new URLSearchParams(params).toString();
  const url = getHostName() + path + formattedParams;
  console.log('url', url);

  try {
    const response = await fetch(url);
    const responseData = await response.json();
    console.log('result', JSON.stringify(responseData));
    return responseData;
  } catch (error) {
    console.error(error);
  }
};

export const remove = async (path, params) => {
  const formattedParams = '?' + new URLSearchParams(params).toString();
  const url = getHostName() + path + formattedParams;
  console.log('url', url);

  try {
    const response = await fetch(url,{
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    });
    const responseData = await response.json();
    console.log('result', JSON.stringify(responseData));
    return responseData;
  } catch (error) {
    console.error(error);
  }
};

export const post = async (path, params, body) => {
  const formattedParams = !params? "" :'?' + new URLSearchParams(params).toString();
  const url = getHostName() + path + formattedParams;
  console.log('url', url, body);

  try {
    const response = await fetch(url,{
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const responseData = await response.json();
    console.log('result', responseData);
    return responseData;
  } catch (error) {
    console.error(error);
  }
};

// const createNotifications = body => {
//   post('/notification/create', {}, body).then(res => {
//     console.log('notification', res);
//   });
// };