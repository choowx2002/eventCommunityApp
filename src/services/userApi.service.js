import { get, post, put, remove } from "./api";

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

export const getUserById = async (params) => {
    const path = `/user/userById/${params}`
    return result = await get(path);
}

export const userLoginWithEmail = async(body) => {
    const path = '/user/login'
    return result = await post(path, null, body)
}

export const createUserAccount = async(body) => {
    const path = '/user/create'
    return result = await post(path, null, body)
}

export const updateUserCategories = async(id, body) => {
    const path = `/user/updateCategories/${id}`
    return result = await post(path, null, body)
}

export const updateUser = async(id, body) => {
    const path = `/user/updateDetails/${id}`
    return result = await put(path, null, body)
}

export const deleteUser = async(id) => {
    const path =`/user/delete/${id}`
    return result = await remove(path, {})
}