import React, { useState } from 'react';
import DyDataStyle from './index.module.sass'
import {dyData} from "@/api/index.js";
import {Button, message} from "antd";

function DyData() {
    const {exportDyData} = dyData;
    const [loading, setLoading] = useState(false);
    const exportDyDatas=async ()=>{
        if (loading) return; // 防止重复点击
        
        setLoading(true);
        message.loading('正在准备下载文件...', 0);
        
        try {
            const response = await exportDyData({
                pageIndex: 1,
                pageSize: 10000
            })
            
            
            let blob;
            
            // 检查响应是否为 Blob 对象
            if (response && response.data instanceof Blob) {
                blob = response.data
                console.log('使用 response.data 作为 Blob')
            } else if (response && typeof response === 'string') {
                // 如果响应是字符串（可能是 base64 编码的二进制数据）
                console.log('响应是字符串，尝试转换为 Blob')
                blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            } else if (response && response.data && typeof response.data === 'string') {
                // 如果 response.data 是字符串
                console.log('response.data 是字符串，尝试转换为 Blob')
                blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            } else {
                message.destroy(); // 清除加载消息
                message.error('导出失败：数据格式错误')
                return
            }
            
            if (blob) {
                console.log('Blob 创建成功:', blob)
                console.log('Blob 大小:', blob.size)
                console.log('Blob 类型:', blob.type)
                
                // 创建下载链接
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = '抖音数据.xlsx'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
                console.log('文件下载已触发')
                
                message.destroy(); // 清除加载消息
                message.success('文件下载已开始');
            }
        } catch (error) {
            console.error('导出失败:', error)
            message.destroy(); // 清除加载消息
            message.error('导出失败：' + (error.message || '未知错误'))
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='size-[100%] flex items-center justify-center'>
            <Button 
                color="primary" 
                variant="outlined" 
                onClick={exportDyDatas}
                loading={loading}
                disabled={loading}
            >
                {loading ? '正在导出...' : '导出抖音数据'}
            </Button>
        </div>
    );
}

export default DyData;