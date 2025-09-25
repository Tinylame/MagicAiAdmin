import {request} from '@/config'
const {Post,Get} =request

function getInvoiceList(data){
    return Post('admin/invoice/list',data)
}
function InvoiceApply(data){
    return Post('admin/invoice/audit',data)
}
function GetInvoiceDetail(data){
    return Get('admin/invoice/detail',data)
}
export const invoice = {
    getInvoiceList,
    InvoiceApply,
    GetInvoiceDetail
}