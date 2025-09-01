import {request} from '@/config'
const {Post,Get} =request

function rechargeList (data){
    return Post('admin/recharge/list',data)
}
function exportRecharge(data){
    return Post('admin/recharge/list/export', data, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
function withdrawalList(data){
    return Post('admin/withdraw/list', data)
}

// admin/withdraw/list/export

function withdrawharge(data){
    return Post('admin/withdraw/list/export', data, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
//是否通过提现
function withdrawAudit (data){
    return Post('admin/withdraw/audit',data)
}



export const Transaction = {
    rechargeList,
    exportRecharge,
    withdrawalList,
    withdrawharge,
    withdrawAudit
}