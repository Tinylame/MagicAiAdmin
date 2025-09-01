import CostStyle from './index.module.scss'
import { Settings } from '@/api/Settings'
import { useEffect, useState } from 'react'
import MagicTable from "@components/MagicTable";
import { TableConfig } from '@/config'
import { Button, Modal, Input, message } from 'antd'

const Cost = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { getSettings,updateSettings } = Settings
    const { cost } = TableConfig
    const [version,setVersion] = useState('')
    const [data, setData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recoId, setRecoId] = useState(null);
    const [recoValue, setRecoValue] = useState('');
    const showModal = (record) => {
        setIsModalOpen(true);
        setRecoId(record.configKey)
        setVersion(record.version)
    };
    const handleOk = async () => {

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
                    version
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
        setVersion('')
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setRecoValue('')
        setVersion('')
    };

    async function getSettingsData() {
        let params = {
            configType: "fee"
        }
        let res = await getSettings(params)

        setData(res.data || [])
    }
    useEffect(() => {
        getSettingsData()
    }, [])
    const userColumnsWithActions = cost.map(column => {
        if (column.key === 'action') {
            return {
                ...column,
                render: (value, record) => (
                    <Button color="cyan" variant="outlined" size="small" onClick={() => showModal(record)}>
                        修改
                    </Button>
                )
            }
        }
        return column
    })
    return (
        <div className={CostStyle.Cost}>
            {contextHolder}
            <div className={CostStyle.Title}>
                <h1>费用配置</h1>
            </div>
            <div className={CostStyle.Content}>
                <MagicTable tableColumns={userColumnsWithActions} tableData={data} height={80} />
            </div>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="修改" cancelText="取消">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
                    <h1 style={{ fontSize: '16px', fontWeight: 'bold' }}> 费用的值</h1>
                    <Input placeholder="费用的值" value={recoValue} onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value) || value === '') {
                            setRecoValue(value);
                        }
                    }} />
                </div>
            </Modal>
        </div>
    )
}
export default Cost