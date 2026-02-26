import { request } from '@/config'
const { Post, Get } = request


export function userTotal(data) {
    return Post('/admin/recharge/stats/user-total', data)
}
export function publishedVideoList(data) {
    return Post('/admin/published-video-list', data)
}
export function generatedVideoList(data) {
    return Post('/admin/commodity/generated-video-list', data)
}
export function userPublishedList(data) {
    return Post('/admin/user-published-list', data)
}
