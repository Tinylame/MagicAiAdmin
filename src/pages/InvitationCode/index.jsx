import React, { useState, useEffect } from 'react'
import MagicTable from "@components/MagicTable";
import MagicPagination from "@components/MagicPagination/index.jsx";
import InvitationCodeStyle from './index.module.scss'
import { TableConfig } from '@/config'
import { invitationCodes } from '@/api/invitationCode'
import { Input, Button, message, Tag, Modal } from "antd";
import { InfoCircleFilled } from '@ant-design/icons'

const InvitationCode = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { invitationCode } = TableConfig
    const { getInvitationCodeList, generateInvitationCode, rejectInvitationCode } = invitationCodes
    const { TextArea } = Input;
    const [requestdata, setRequestdata] = useState({
        pageIndex: 1,
        pageSize: 10
    })
    
    // 模态框状态
    const [isTongGuo, setIsTongGuo] = useState(false)
    const [isJuJue, setIsJuJue] = useState(false)
    const [currentRecord, setCurrentRecord] = useState(null)
    const [rejectReason, setRejectReason] = useState('')
    
    const [total, setTotal] = useState(0)
    const [tableData, setTableData] = useState([])

    // 获取邀请码数据的函数
    const fetchInvitationCodeData = async (params = requestdata) => {
        try {
            const res = await getInvitationCodeList(params)
            console.log(res)
            const { data: { list }, data: { total: totalCount } } = res
            setTableData(list)
            setTotal(totalCount)
        } catch (error) {
            messageApi.error('获取数据失败')
        }
    }

    useEffect(() => {
        fetchInvitationCodeData()
    }, [requestdata])

    // 搜索功能
    const handleSearch = (value) => {
        if (value.target.value) {
            fetchInvitationCodeData({ contactPhone: value.target.value })
        } else {
            fetchInvitationCodeData(requestdata)
        }
    }

    // 通过操作
    function handleApprove(record) {
        setCurrentRecord(record)
        setIsTongGuo(true)
    }

    // 拒绝操作
    function handleReject(record) {
        setCurrentRecord(record)
        setIsJuJue(true)
    }

    // 定义带操作的表格列
    const InvitationCodeColumnsWithActions = invitationCode.map(column => {
        if (column.key === 'status') {
            return {
                ...column,
                render: (value, record) => {
                    switch (value) {
                        case 0:
                            return <Tag color="magenta">待审核</Tag>
                        case 1:
                            return <Tag color="green">已通过</Tag>
                        case 2:
                            return <Tag color="red">已拒绝</Tag>
                        default:
                            return <Tag color="default">未知状态</Tag>
                    }
                }
            }
        }
        if (column.key === 'isUsed') {
            return {
                ...column,
                render: (value, record) => {
                    return value ? <Tag color="green">已使用</Tag> : <Tag color="orange">未使用</Tag>
                }
            }
        }
        if (column.key === 'action') {
            return {
                ...column,
                render: (value, record) => (
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Button 
                            onClick={() => handleReject(record)} 
                            disabled={record.status !== 0} 
                            size="small" 
                            color="danger" 
                            variant="outlined"
                        >
                            拒绝
                        </Button>
                        <Button 
                            onClick={() => handleApprove(record)} 
                            disabled={record.status !== 0} 
                            size="small" 
                            color="cyan" 
                            variant="outlined"
                        >
                            通过
                        </Button>
                    </div>
                )
            }
        }
        return column
    })

    // 分页处理
    const handlePaginationChange = (page, pageSize) => {
        const newRequestData = {
            pageIndex: page,
            pageSize: pageSize
        }
        setRequestdata(newRequestData)
    }

    // 通过确认
    async function handleOk() {
        try {
            const params = {
                applicationId: currentRecord.id
            }
            const res = await generateInvitationCode(params)
            const { code } = res
            if (code === 200) {
                await fetchInvitationCodeData(requestdata)
                messageApi.success('操作成功')
            } else {
                messageApi.error('操作失败')
            }
        } catch (error) {
            messageApi.error('操作失败')
        }
        setIsTongGuo(false)
        setCurrentRecord(null)
    }

    // 通过取消
    function handleCancel() {
        setIsTongGuo(false)
        setCurrentRecord(null)
    }

    // 拒绝确认
    async function handleOkJuJue() {
        if (rejectReason.length === 0) {
            message.warning('请输入拒绝理由')
            return
        }
        try {
            const requestData = {
                applicationId: currentRecord.id,
                rejectReason: rejectReason
            }
            const res = await rejectInvitationCode(requestData)
            const { code } = res
            if (code === 200) {
                await fetchInvitationCodeData(requestdata)
                messageApi.success('操作成功')
            } else {
                messageApi.error('操作失败')
            }
        } catch (error) {
            messageApi.error('操作失败')
        }
        setRejectReason('')
        setIsJuJue(false)
        setCurrentRecord(null)
    }

    // 拒绝取消
    function handleCancelJuJue() {
        setIsJuJue(false)
        setRejectReason('')
        setCurrentRecord(null)
    }

    return (
        <div className={InvitationCodeStyle.InvitationCode}>
            {contextHolder}
            <div className={InvitationCodeStyle.Title}>
                <h1>邀请码管理</h1>
            </div>
            <div className={InvitationCodeStyle.Search}>
                <Input placeholder="请输入手机号" style={{ width: '200px' }} onPressEnter={handleSearch} />
            </div>
            <div className={InvitationCodeStyle.Table}>
                <MagicTable 
                    tableColumns={InvitationCodeColumnsWithActions} 
                    tableData={tableData} 
                    rowKey="id"
                />
            </div>
            <div className={InvitationCodeStyle.Pagination}>
                <MagicPagination total={total} defaultPageSize={requestdata.pageSize} onChange={handlePaginationChange} />
            </div>

            {/* 通过模态框 */}
            <Modal
                title="通过邀请码申请"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isTongGuo}
                okText="确认"
                cancelText="取消"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <InfoCircleFilled style={{color:'#ffa616'}} />
                    <p>您确定通过这个邀请码申请吗？</p>
                </div>
            </Modal>

            {/* 拒绝模态框 */}
            <Modal
                title="拒绝邀请码申请"
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
                        <p>您确定拒绝这个邀请码申请吗？</p>
                    </div>
                    <TextArea
                        style={{marginTop:'10px'}}
                        value={rejectReason}
                        onChange={e=>setRejectReason(e.target.value)}
                        placeholder="请输入拒绝的理由(最多48个字)"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        maxLength={48}
                    />
                </div>
            </Modal>
        </div>
    )
}

export default InvitationCode