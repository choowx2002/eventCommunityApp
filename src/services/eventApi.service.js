import {get, post, remove} from '../services/api';

export const getEventById = async (id,param={}) =>{
    const path = `/events/${id}`
    return result = await get(path,param)
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

export const createEventApi = async(body) => {
    const path = '/events/create'
    return result = await post(path, null, body)
}

export const searchEventApi = async(param)=>{
    const path ="/events/search"
    return result = await get(path, param)
}

export const getEventByState = async(param)=>{
    const path = '/events/state/name'
    return result = await get(path,param)
}

export const getEvents = async()=>{
    const path = '/events/'
    return result = await get(path,{})
}

export const getEventByCatId = async(param)=>{
    const path = '/events/category/id'
    return result = await get(path,param)
}