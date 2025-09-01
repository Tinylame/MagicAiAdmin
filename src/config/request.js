import {API_BASE_URL} from './staticBase.js'

import axios from 'axios'


const service = axios.create({
    baseURL: API_BASE_URL,
    timeout: 50000, // 5秒超时
})

service.interceptors.request.use(
    config => {
      
        
        const token = localStorage.getItem('admin-token')
        if (token) {
            config.headers['auth-token'] = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 如果是blob响应，直接返回原始响应
        if (response.config.responseType === 'blob') {
            return response
        }
        if (response.data.code === 401) {
            localStorage.removeItem('admin-token')
            localStorage.removeItem('userInfo')

            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
   
        return response.data
    },
    error => {
        if (error.response.data.code === 401) {
            localStorage.removeItem('admin-token')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } else {
            return error.response.data
        }
    }
)

function Get (url, params=null, config = {}) {
    return service.get(url, { params, ...config });
}
function Post (url, data, config = {}) {
    return service.post(url, data,config);
}
function Put  (url, data, config = {}) {
    return service.post(url, data,config);
}
export const request ={
    Get,
    Post,
    Put
}