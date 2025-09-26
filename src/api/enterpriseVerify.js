import {request} from '@/config'
const {Post,Get} =request

function enterpriseList(data){
    return Post('/admin/enterprise-verify/list',data)
}
function enterpriseAudit(data){
    return Post('/admin/enterprise-verify/audit',data)
}

export const enterpriseVerify ={
    enterpriseList,
    enterpriseAudit
}

