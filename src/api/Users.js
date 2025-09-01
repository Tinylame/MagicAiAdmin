import {request} from '@/config'
const {Post,Get} =request

function userAll (data){
    return Post('admin/user-list',data)
}
function merchantAll (data){
    return Post('admin/business-list',data)
}
// /admin/promotion/invite-list
function getInviteList (data){
    return Post('admin/promotion/invite-list',data)
}
export const Users = {
    userAll,
    merchantAll,
    getInviteList
}