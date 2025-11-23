import ConventionalStyle from './index.module.scss'
import { Settings } from '@/api/Settings'
import MagicTable from "@components/MagicTable";
import { useEffect, useState } from 'react'
import { TableConfig } from '@/config'
import {Button,Switch,Modal,Input,message } from "antd";
const Conventional = () => {
    const { getSettings,updateSettings } = Settings
    const { cost } = TableConfig
    const [version,setVersion] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([])
    const [recoId, setRecoId] = useState(null);
    const [recoValue, setRecoValue] = useState('');
    const [currentConfigKey, setCurrentConfigKey] = useState('');
    const showModal = (record) => {
        setIsModalOpen(true);

        setRecoId(record.configKey);
        setVersion(record.version);
        setCurrentConfigKey(record.configKey);
    };
    const [messageApi, contextHolder] = message.useMessage();
    const handleOk = async () => {
        console.log(recoId, recoValue);
        if(recoValue === ''){
            messageApi.error('费用的值不能为空')
            return
        }
        let postData = {
            configType:"fee",
            configItems: [
                {
                    configKey:recoId,
                    configValue:recoValue,
                    version:version
                }
            ]
        }
        let res = await updateSettings(postData)
        if(res.code === 200){
            messageApi.success('修改成功')
            getSettingsData()
        }else{
            messageApi.error('修改失败')
        }
        
        setRecoValue('')
        setIsModalOpen(false);
        setCurrentConfigKey('');
        setVersion('');
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentConfigKey('');
        setRecoValue('')
        setVersion('')
    };

    async function getSettingsData() {
        let params = {
            configType: "general"
        }
        let res = await getSettings(params)
        setData(res.data)
    }

    const setSwitchValue = async (record) => {
        let values = record.configValue==='true'?'false':'true'
        let postData = {
            configType:"general",
            configItems: [
                {
                    configKey:record.configKey,
                    configValue:values,
                    version:record.version
                }
            ]
        }
        let res = await updateSettings(postData)
        if(res.code === 200){
            messageApi.success('修改成功')
            getSettingsData()
        }else{
            messageApi.error('修改失败')
        }
        setVersion('')
    }

    const userColumnsWithActions = cost.map(column => {
        if (column.key === 'action') {
            return {
                ...column,
                render: (value, record) =>{
                    if (record.fieldType ===2) {
                        return (<Switch checked={record.configValue==='true'} onChange={()=>setSwitchValue(record)}/>)
                    }else {
                        return (
                            <Button color="cyan" variant="outlined" size="small" onClick={() => showModal(record)} >
                                修改
                            </Button>
                        )
                    }
                }
            }
        }
        if (column.key === 'configValue') {
            return {
                ...column,
                render: (value, record) =>{
                    if (record.fieldType ===2) {
                        return (<p>-</p>)
                    }else {
                        return (
                           <p>{value}</p>
                        )
                    }
                }
            }
        }
        return column
    })
    useEffect(() => {
        getSettingsData()
    },[])
    return (
        <div className={ConventionalStyle.Conventionl}>
            {contextHolder}
            <div className={ConventionalStyle.Title}>
                <h1>常规配置</h1>
            </div>
            <div >
                <MagicTable tableColumns={userColumnsWithActions} tableData={data} height={80}/>
            </div>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="修改" cancelText="取消">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
                    <h1 style={{ fontSize: '16px', fontWeight: 'bold' }}>请输入新值</h1>
                    <Input placeholder={
                        currentConfigKey === 'invite_reward_rate' || currentConfigKey === 'commission_rate' 
                            ? '请输入0-1之间的数值，最多保留两位小数' 
                            : '请输入整数'
                    } value={recoValue} onChange={(e) => {
                        const value = e.target.value;
                        
                        // 如果是 invite_reward_rate 或 commission_rate，限制在 0-1 之间，保留两位小数
                        if (currentConfigKey === 'invite_reward_rate' || currentConfigKey === 'commission_rate') {
                            if (/^0\.\d{0,2}$|^1\.0{0,2}$|^0$|^1$|^$/.test(value)) {
                                setRecoValue(value);
                            }
                        } else {
                            // 其他配置项只允许整数
                            if (/^\d*$/.test(value) || value === '') {
                                setRecoValue(value);
                            }
                        }
                    }} />
                </div>
            </Modal>
        </div>
    )
}

export default Conventional
