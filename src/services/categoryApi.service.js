import {get} from '../services/api';

export const getAllCategories = async () =>{
    const path = '/categories'
    return result = await get(path, {})
}