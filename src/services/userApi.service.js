import { get } from "./api";

export const getUserCategories = async (id) =>{
    const path = '/user/categories/'
    return result = await get(path+id,{});
}

/**
@param userId
@param eventType(own, pass, active)
*/
export const getUserEvents = async (params) => {
    const path = '/user/userEvents/'
    return result = await get(path,params);
}