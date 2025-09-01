import {request} from '@/config'
const {Post,Get} =request

function getSettings(params){
    return Get('system/configType',params)
}


function updateSettings(data){
    return Post('system/update',data)
}
// home/app-download/upload
function downloadUpload(data){
    return Post('home/app-download/upload',data)
}
export const Settings ={
    getSettings,
    updateSettings,
    downloadUpload
}