import Toast from 'react-native-toast-message';
import io from 'socket.io-client';
import {getSubscribeEventsId} from './sqliteServices';
import { getData, setValue } from '../utils/storageHelperUtil';
import { SOCKET_PORT, HOST } from '@env';

const SOCKET_URI_Ethernet = `http://${HOST}:${SOCKET_PORT}`;

let socket;

export const subscribe_notification = async id => {
  const isGranted = await _checkNotificationPermission();
  if (!isGranted) return {success: true, error: null};
  return new Promise((resolve, reject) => {
    try {
      // Emit an event to subscribe to notifications
      socket.emit('subscribe_notification', id, response => {
        if (response.success) {
          console.log('Successfully subscribed to notifications');
          resolve({success: true, error: null});
        } else {
          console.log('Failed to subscribe:', response.error);
          reject({success: false, error: response.error});
        }
      });
    } catch (error) {
      console.log(error);
      reject({success: false, error: error});
    }
  });
};

export const unsubscribe_notification = async id => {
  const isGranted = await _checkNotificationPermission();
  if (!isGranted) return {success: true, error: null};
  return new Promise((resolve, reject) => {
    try {
      // Emit an event to subscribe to notifications
      socket.emit('unsubscribe_notification', id, response => {
        if (response.success) {
          console.log('Successfully unsubscribed to notifications');
          resolve({success: true, error: null});
        } else {
          console.log('Failed to unsubscribe:', response.error);
          reject({success: false, error: response.error});
        }
      });
    } catch (error) {
      console.log(error);
      reject({success: false, error: error});
    }
  });
};

export const send_notification = data => {
  return new Promise((resolve, reject) => {
    try {
      // Emit an event to notifications
      socket.emit('send_notification', data, response => {
        if (response.success) {
          console.log('Successfully send notifications');
          resolve({success: true, error: null});
        } else {
          console.log('Failed to send notifications:', response.error);
          reject({success: false, error: response.error});
        }
      });
    } catch (error) {
      console.log(error);
      reject({success: false, error: error});
    }
  });
};

export const connectSocket = () => {
  return new Promise((resolve, reject) => {
    socket = io(SOCKET_URI_Ethernet);
    console.log("try connect to server",SOCKET_URI_Ethernet)
    socket.connect();//connect to server
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.on('receive_notification', notification => {// listen to notification
        console.log('Received notification:', notification);
        Toast.show({
          position: 'top',
          type: 'info',
          text1: notification.title,
          text2: notification.message,
          autoHide: true,
        });
      });
      resolve(socket);
    });

    socket.on('connect_error', error => {// while console if connect error
      console.log('Connection error:', JSON.stringify(error));
      reject(error);
    });
  });
};

export const disconnectSocket = () =>{//disconnect with server
  socket.disconnect()
}

//initial notification service
export const init_notification = async () => {
  const isGranted = await _checkNotificationPermission();
  if (!isGranted) return;
  await connectSocket();
  const events = await getSubscribeEventsId();
  console.log('data:', events);
  if (events?.length > 0) {
    subscribe_notification(events);
  }
};

//check permission and will return boolean to represent is granted or not
const _checkNotificationPermission = async () => {
  return false //testing purpose comment if want try with sokcet IO
  let enableNotification = await getData('enableNotification')
  if(enableNotification === null) {
    setValue("enableNotification",'1')
    return true
  } else {
    return enableNotification === "1"
  }
}