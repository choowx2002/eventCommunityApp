import {get, getHostName, post, remove} from '../services/api';

export const getEventById = async (id,param={}) =>{
    const path = '/events/'
    return result = await get(path+id,param)
}

export const joinEventById = async (body)=>{
    const path = '/events/join'
    return result = await post(path,null,body);
} 

export const leaveEventById = async (param)=>{
    const path = '/events/leave'
    return result = await remove(path,param);
}

export const checkLatestById = async (id, param) => {
    const path = '/events/checkLatest/'
    return result = await get(path+id, param)
}

export const getParticipantsById = async (id) => {
    const path = '/events/participants/'
    return result = await get(path+id, {})
}