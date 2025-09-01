import {request} from '@/config'
const {Post,Get} =request

function getFeedBackList(data){
    return Post('feedback/list',data)
}
function updStud(data){
    return Post('feedback/update-status',data)
}

export const FeedBacks = {
    getFeedBackList,
    updStud
}