import {request} from '@/config'
const {Post,Get} =request

function getDyData(data){
    return Post('/third-data/douyin/list',data)
}
function exportDyData(data){
    return Post('third-data/douyin/list/export', data, {
        responseType: 'blob'
    })
}
export const dyData = {
    getDyData,
    exportDyData
}