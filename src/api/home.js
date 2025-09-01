import {request} from '@/config'
const {Post,Get} =request

function homeAll (){
    return Get('home/all')
}

function activeList (data){
    return Post('active/list',data)
}

// 获取用户发布视频数排名
function getUserPublishRanking(data) {
    return Post('ranking/user-publish', data)
}

// 获取商户生成视频排名
function getMerchantGenerateRanking(data) {
    return Post('ranking/merchant-generate', data)
}

// 获取商户发布视频排名
function getMerchantPublishRanking(data) {
    return Post('ranking/merchant-publish', data)
}

export const Homes = {
    homeAll,
    activeList,
    getUserPublishRanking,
    getMerchantGenerateRanking,
    getMerchantPublishRanking
}