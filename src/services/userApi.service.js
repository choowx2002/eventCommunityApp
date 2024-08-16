import { get } from "./api";

export const getUserCategories = async (id) =>{
    const path = '/user/categories/'
    return result = await get(path+id,{})
}