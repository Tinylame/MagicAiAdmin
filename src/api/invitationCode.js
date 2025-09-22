import {request} from '@/config'
const {Post} =request

function getInvitationCodeList (data){
    return Post('/admin/business-invite/list',data)
}

function generateInvitationCode (data){
    return Post('/admin/business-invite/code/generate',data)
}

function rejectInvitationCode (data){
    return Post('/admin/business-invite/reject',data)
}
export const invitationCodes = {
    getInvitationCodeList,
    generateInvitationCode,
    rejectInvitationCode
}