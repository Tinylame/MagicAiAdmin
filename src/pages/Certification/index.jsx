import React, {useEffect,useState} from 'react';
import {enterpriseVerify} from '@/api'
import { TableConfig } from '@/config'
import {Input, Button, Drawer, Descriptions, Image, Tag, Space, Typography, Modal, message} from 'antd'
import MagicTable from "@components/MagicTable";
import MagicPagination from "@components/MagicPagination/index.jsx";
import { InfoCircleFilled } from '@ant-design/icons'

function Certification(props) {
    const {certificateTable}=TableConfig
    const [messageApi, contextHolder] = message.useMessage();

    const [isDrawerOpen, setDrawerOpen] = useState(false)
    const [total, setTotal] = useState(0)
    const [selectedRecord, setSelectedRecord] = useState(null)
    
    // 搜索相关状态
    const [searchForm, setSearchForm] = useState({
        companyName: ''
    })
    
    // 审核相关状态
    const [isTongGuo, setIsTongGuo] = useState(false)
    const [isJuJue, setIsJuJue] = useState(false)
    const [ThroughId, setThroughId] = useState([])
    const [JujueContet, setJujueContet] = useState('')
    const showDrawer = (record) => {
        setSelectedRecord(record);
        setDrawerOpen(true);
    };
    const onClose = () => {
        setDrawerOpen(false);
        setSelectedRecord(null);
    };

    // 通过审核
    function Through(record) {
        setThroughId([record.id])
        setIsTongGuo(true)
    }

    // 拒绝审核
    function Refuse(record) {
        setThroughId([record.id])
        setIsJuJue(true)
    }

    // 通过审核确认
    async function handleOk() {
        let params = {
            ids: ThroughId,
            status: 2, // 2-审核通过
            auditRemark: "审核通过"
        }
        console.log(params)
        const res = await enterpriseAudit(params)
        const { code } = res
        if (code === 200) {
            await getEnterprise(requestdata)
            messageApi.success('操作成功')
        } else {
            messageApi.error('操作失败')
        }
        setIsTongGuo(false)
        setThroughId([])
    }

    // 取消通过审核
    function handleCancel() {
        setIsTongGuo(false)
        setThroughId([])
    }

    // 拒绝审核确认
    async function handleOkJuJue() {
        if (JujueContet.length === 0) {
            message.warning('请输入拒绝理由')
            return
        }
        let requestData = {
            ids: ThroughId,
            status: 3, // 3-审核拒绝
            auditRemark: "审核拒绝",
            rejectReason: JujueContet
        }
        const res = await enterpriseAudit(requestData)
        const { code } = res
        if (code === 200) {
            await getEnterprise(requestdata)
            messageApi.success('操作成功')
        } else {
            messageApi.error('操作失败')
        }
        setJujueContet('')
        setIsJuJue(false)
        setThroughId([])
    }

    // 取消拒绝审核
    function handleCancelJuJue() {
        setIsJuJue(false)
        setJujueContet('')
        setThroughId([])
    }
    const tableTitle = certificateTable.map(item => {
        if (item.dataIndex ==='action'){
            return {
                ...item,
                render: (value, record) => (
                    <div className='flex w-[100%] justify-center gap-[5px]'>
                        <Button
                            size="small"
                            color="danger"
                            variant="outlined"
                            onClick={() => Refuse(record)}
                            disabled={record.status !== 1}
                        >
                            拒绝
                        </Button>
                        <Button
                            size="small"
                            color="cyan"
                            variant="outlined"
                            onClick={() => Through(record)}
                            disabled={record.status !== 1}
                        >
                            通过
                        </Button>
                    </div>
                )
            }
        }
        if (item.dataIndex ==='ForDetails'){
            return {
                ...item,
                render: (value, record) => (
                    <div className='flex w-[100%] justify-center gap-[5px]'>
                        <Button
                            size="small"
                            color="cyan"
                            variant="outlined"
                            onClick={() => showDrawer(record)}
                        >查看详情</Button>
                    </div>
                )
            }
        }
        if (item.dataIndex ==='status'){
            return {
                ...item,
                render: (value, record) => {
                    switch (value) {
                        case 1:
                            return <Tag color="volcano">待审核</Tag>
                        case 2:
                            return <Tag color="green">审核成功</Tag>
                        case 3:
                            return <Tag color="red">审核失败</Tag>
                    }
                }
            }
        }
        return item; // 返回未修改的项
    })
    const {enterpriseList,enterpriseAudit} = enterpriseVerify;
    const [requestdata, setRequestdata] = useState(
        {
            pageIndex: 1,
            pageSize: 10,
        })
    const [enterpriseData, setEnterpriseData] = useState()
    const getEnterprise = async (dats) => {
        const res = await enterpriseList(dats);
        const {data:{list},data:{totalCount}}=res
        setTotal(totalCount)
        setEnterpriseData(list)
    }

    // 处理企业名称输入框变化
    const handleCompanyNameChange = (e) => {
        const value = e.target.value;
        const newSearchForm = {
            ...searchForm,
            companyName: value
        };
        setSearchForm(newSearchForm);
        
        // 构建搜索参数
        const searchParams = {
            ...requestdata,
            companyName: value
        };
        getEnterprise(searchParams);
    };
    useEffect(()=>{
        getEnterprise(requestdata)
    },[requestdata])

    const handlePaginationChange = (page, pageSize) => {
        console.log('分页变化:', page, pageSize);

        // 更新请求参数
        const newRequestData = {
            pageIndex: page,
            pageSize: pageSize
        }

        setRequestdata(newRequestData)

        // 打印新的请求参数（用于调试）
        console.log('新的请求参数:', newRequestData)
    }
    return (
        <div className='size-[100%] flex flex-col gap-[10px]'>
            {contextHolder}
            <div className='w-[100%] h-[30px]'>
                <h1 className='text-[18px]'>实名认证管理</h1>
            </div>
            <div className='w-[100%] h-[30px]'>
                <Input 
                    placeholder='请输入企业名称' 
                    style={{width:'200px'}} 
                    onChange={handleCompanyNameChange}
                    value={searchForm.companyName}
                />
            </div>
            <div className='w-[100%] flex-1 '>
                <MagicTable
                    tableColumns={tableTitle}
                    tableData={enterpriseData}
                />
            </div>
            <div className='w-[100%] h-[30px] '>
                <MagicPagination total={total} defaultPageSize={requestdata.pageSize} onChange={handlePaginationChange} />
            </div>

            <Drawer
                title="认证详情"
                open={isDrawerOpen}
                onClose={onClose}
                width={800}
            >
                {selectedRecord && (
                    <div className="p-4">
                        <Descriptions title="基本信息" bordered column={2} size="small">
                            <Descriptions.Item label="认证ID">{selectedRecord.id}</Descriptions.Item>
                            <Descriptions.Item label="商户ID">{selectedRecord.businessId}</Descriptions.Item>
                            <Descriptions.Item label="认证申请单号">{selectedRecord.verificationNo}</Descriptions.Item>
                            <Descriptions.Item label="证件类型">{selectedRecord.certificateTypeDesc}</Descriptions.Item>
                            <Descriptions.Item label="企业名称" span={2}>{selectedRecord.companyName}</Descriptions.Item>
                            <Descriptions.Item label="统一社会信用代码" span={2}>{selectedRecord.unifiedSocialCreditCode}</Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="注册地址信息" bordered column={2} size="small" style={{ marginTop: 16 }}>
                            <Descriptions.Item label="注册省份">{selectedRecord.registerProvince}</Descriptions.Item>
                            <Descriptions.Item label="注册城市">{selectedRecord.registerCity}</Descriptions.Item>
                            <Descriptions.Item label="注册区域">{selectedRecord.registerDistrict}</Descriptions.Item>
                            <Descriptions.Item label="详细地址">{selectedRecord.registerDetailAddress}</Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="法人信息" bordered column={2} size="small" style={{ marginTop: 16 }}>
                            <Descriptions.Item label="法人姓名">{selectedRecord.legalPersonName}</Descriptions.Item>
                            <Descriptions.Item label="身份证号码">{selectedRecord.legalPersonIdCard}</Descriptions.Item>
                            <Descriptions.Item label="身份证正面" span={2}>
                                {selectedRecord.legalPersonIdFrontUrl && (
                                    <Image
                                        width={100}
                                        src={selectedRecord.legalPersonIdFrontUrl}
                                        alt="身份证正面"
                                        style={{ marginRight: 8,aspectRatio:'16/9',objectFit:'cover'}}
                                    />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="身份证反面" span={2}>
                                {selectedRecord.legalPersonIdBackUrl && (
                                    <Image
                                        width={100}
                                        src={selectedRecord.legalPersonIdBackUrl}
                                        alt="身份证反面"
                                        style={{ marginRight: 8,aspectRatio:'16/9',objectFit:'cover'}}
                                    />
                                )}
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="证件附件" bordered column={1} size="small" style={{ marginTop: 16 }}>
                            <Descriptions.Item label="证件图片">
                                {selectedRecord.certificateFileUrls && selectedRecord.certificateFileUrls.length > 0 ? (
                                    <Space wrap>
                                        {selectedRecord.certificateFileUrls.map((url, index) => (
                                            <Image
                                                key={index}
                                                width={100}
                                                src={url}
                                                alt={`证件图片${index + 1}`}
                                                style={{ marginRight: 8,aspectRatio:'16/9',objectFit:'cover'}}
                                            />
                                        ))}
                                    </Space>
                                ) : (
                                    <Typography.Text type="secondary">暂无证件图片</Typography.Text>
                                )}
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="审核信息" bordered column={2} size="small" style={{ marginTop: 16 }}>
                            <Descriptions.Item label="审核状态">
                                <Tag color={selectedRecord.status === 1 ? 'orange' : selectedRecord.status === 2 ? 'green' : 'red'}>
                                    {selectedRecord.statusDesc}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="审核时间">{selectedRecord.auditTime || '未审核'}</Descriptions.Item>
                            <Descriptions.Item label="审核备注" span={2}>{selectedRecord.auditRemark || '无'}</Descriptions.Item>
                            {selectedRecord.rejectReason && (
                                <Descriptions.Item label="拒绝原因" span={2}>
                                    <Typography.Text type="danger">{selectedRecord.rejectReason}</Typography.Text>
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label="创建时间">{selectedRecord.createdAt}</Descriptions.Item>
                            <Descriptions.Item label="更新时间">{selectedRecord.updatedAt}</Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Drawer>

            {/* 通过审核弹窗 */}
            <Modal
                title="通过审核"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isTongGuo}
                okText="确认"
                cancelText="取消"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <InfoCircleFilled style={{color:'#ffa616'}} />
                    <p>您确定通过{ThroughId.length > 1 ? `这${ThroughId.length}个` : '这个'}认证申请吗？</p>
                </div>
            </Modal>

            {/* 拒绝审核弹窗 */}
            <Modal
                title="拒绝审核"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isJuJue}
                okText="确认"
                cancelText="取消"
                onOk={handleOkJuJue}
                onCancel={handleCancelJuJue}
            >
                <div>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <InfoCircleFilled style={{color:'red'}} />
                        <p>您确定拒绝这个认证申请吗？</p>
                    </div>
                    <Input.TextArea
                        style={{marginTop:'10px'}}
                        value={JujueContet}
                        onChange={e=>setJujueContet(e.target.value)}
                        placeholder="请输入拒绝的理由(最多48个字)"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        maxLength={48}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default Certification;
