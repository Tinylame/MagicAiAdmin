import {request} from '@/config'
const {Post} =request

function adminLogin (data){
    return Post('/admin/login',data)
}

export const Logins = {
    adminLogin
}