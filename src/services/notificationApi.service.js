import {get, post} from '../services/api';

export const getNotificationByEventId = async (id,param={}) =>{
    const path = '/notification/event/'
    return result = await get(path+id,param)
}

export const createNotification = async (body)=>{
    const path = '/notification/create'
    return result = await post(path,null,body);
} 

export const getNotificationByUserId = async (id, param = {}) => {
    const path = '/notification/user/';
    return result = await get(path + id, param);
};
  