import PermissionStyle from './index.module.scss'
import { message, Upload, Card, Tag, Space } from 'antd';
import { InboxOutlined, AndroidOutlined, FileTextOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Settings } from '@/api/Settings'
const { downloadUpload } = Settings
const { Dragger } = Upload;

const Permission = () => {
    const [fileList, setFileList] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);

    // 文件上传前的验证
    const beforeUpload = (file) => {
        // 检查文件类型是否为APK
        const isApk = file.type === 'application/vnd.android.package-archive' || 
                     file.name.toLowerCase().endsWith('.apk');
        
        if (!isApk) {
            message.error('只能上传APK文件！');
            return false;
        }

        // 检查文件大小（限制为100MB）
        const isLt100M = file.size / 1024 / 1024 < 100;
        if (!isLt100M) {
            message.error('文件大小不能超过100MB！');
            return false;
        }

        return true;
    };

    // 文件上传状态改变时的处理
    const handleChange = (info) => {
        let newFileList = [...info.fileList];
        
        // 只保留最新的一个文件
        newFileList = newFileList.slice(-1);
        
        setFileList(newFileList);

        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功`);
            setUploadedFile(info.file);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
        }
    };

    // 自定义上传处理
    const customRequest = async ({ file, onSuccess, onError }) => {
        let formData = new FormData()
        formData.append('file', file)
        let res = await downloadUpload(formData)
        if(res.code === 200){
            message.success('上传成功')
        }else{
            message.error('上传失败')
        }
        setTimeout(() => {
            onSuccess('ok');
        }, 1000);
    };

    // 文件移除处理
    const handleRemove = () => {
        setFileList([]);
        setUploadedFile(null);
        message.info('文件已移除');
    };

    return (
        <div className={PermissionStyle.Permission}>
            <div className={PermissionStyle.Title}>
                <h1>App配置</h1>
            </div>
            <div className={PermissionStyle.Upload}>
                <Dragger
                    name="file"
                    multiple={false}
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    customRequest={customRequest}
                    onRemove={handleRemove}
                    accept=".apk"
                    maxCount={1}
                >
                    <p className="ant-upload-drag-icon">
                        <AndroidOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                    </p>
                    <p className="ant-upload-text">点击或拖拽APK文件到此区域上传</p>
                    <p className="ant-upload-hint">
                        只支持单个APK文件上传，文件大小不超过100MB
                    </p>
                </Dragger>
            </div>

            {/* 上传完成后的文件展示 */}
            {uploadedFile && (
                <div className={PermissionStyle.FileInfo} style={{ marginTop: '24px' }}>
                    <Card title="已上传文件" size="small">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileTextOutlined style={{ color: '#52c41a' }} />
                                <span style={{ fontWeight: 'bold' }}>{uploadedFile.name}</span>
                                <Tag color="green">上传成功</Tag>
                            </div>
                            <div style={{ color: '#666', fontSize: '14px' }}>
                                文件大小: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            <div style={{ color: '#666', fontSize: '14px' }}>
                                上传时间: {new Date().toLocaleString()}
                            </div>
                        </Space>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default Permission