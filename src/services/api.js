import { API_PORT, HOST } from '@env';
export const getLocationAddress = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const json = await response.json();
    const state = json.address.state ?? json.address.city
    return state.toLowerCase() === "kuala lumpur"?"Selangor":state;
  } catch (error) {
    console.log("error", error);
    return null
  }
};

export const getHostName = () => {
  return `http://${HOST}:${API_PORT}`;
};

//upload image refer createEventScreen.jsx
export const uploadImage = async (image) => {
  if (!image) return null;
  const { imageUri, imageName, imageType } = image;
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    name: imageName,
    type: imageType,
  });

  try {
    const response = await fetch(`${getHostName()}/image/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await response.json();
    if (response.status === 200) {
      console.log('File uploaded successfully', result);
      return result.data.image_path;
    } else {
      console.log('Upload failed: ', result.message);
      return null;
    }
  } catch (error) {
    console.log('Error uploading image: ', error);
    return null;
  }
};

export const get = async (path, params = {}) => {
  const formattedParams = '?' + new URLSearchParams(params).toString();
  const url = getHostName() + path + formattedParams;
  console.log('get req url', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || `HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log('result', JSON.stringify(responseData));
    return responseData;
  } catch (error) {
    console.log('Fetch Error:', error.message);
    return null;
  }
};

export const remove = async (path, params) => {
  const formattedParams = '?' + new URLSearchParams(params).toString();
  const url = getHostName() + path + formattedParams;
  console.log('delete url', url);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || `HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log('result', JSON.stringify(responseData));
    return responseData;
  } catch (error) {
    console.log('Fetch Error:', error.message);
    return null;
  }
};

export const post = async (path, params, body) => {
  const formattedParams = !params ? '' : '?' + new URLSearchParams(params).toString();
  const url = getHostName() + path + formattedParams;
  console.log('post url', url, body);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || `HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log('result', responseData);
    return responseData;
  } catch (error) {
    console.log('Fetch Error:', error.message);
    return null;
  }
};

export const put = async (path, params, body) => {
  const formattedParams = !params ? '' : '?' + new URLSearchParams(params).toString();
  const url = getHostName() + path + formattedParams;
  console.log('put url', url, body);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || `HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log('result', responseData);
    return responseData;
  } catch (error) {
    console.log('Fetch Error:', error.message);
    return null;
  }
};