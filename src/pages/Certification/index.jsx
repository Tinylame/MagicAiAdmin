import React, { useEffect, useState } from 'react';
import { enterpriseVerify } from '@/api'
import { Input, Button, Drawer, Modal, message } from 'antd'
import MagicTable from "@components/MagicTable";
import MagicPagination from "@components/MagicPagination/index.jsx";
import { InfoCircleFilled } from '@ant-design/icons'
import { tableTitle } from './tableTitle.jsx'
import CertificationDetail from './CertificationDetail.jsx'
function Certification(props) {
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


    const { enterpriseList, enterpriseAudit } = enterpriseVerify;
    const [requestdata, setRequestdata] = useState(
        {
            pageIndex: 1,
            pageSize: 10,
        })
    const [enterpriseData, setEnterpriseData] = useState()
    const getEnterprise = async (dats) => {
        const res = await enterpriseList(dats);
        const { data: { list }, data: { totalCount } } = res
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
    useEffect(() => {
        getEnterprise(requestdata)
    }, [requestdata])

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
                    style={{ width: '200px' }}
                    onChange={handleCompanyNameChange}
                    value={searchForm.companyName}
                />
            </div>
            <div className='w-[100%] flex-1 '>
                <MagicTable
                    tableColumns={tableTitle(Refuse, Through, showDrawer)}
                    tableData={enterpriseData}
                />
            </div>
            <div className='w-[100%] h-[30px] '>
                <MagicPagination total={total} defaultPageSize={requestdata.pageSize}
                    onChange={handlePaginationChange} />
            </div>

            <Drawer
                title="认证详情"
                open={isDrawerOpen}
                onClose={onClose}
                width={800}
            >
                <CertificationDetail selectedRecord={selectedRecord} />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <InfoCircleFilled style={{ color: '#ffa616' }} />
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <InfoCircleFilled style={{ color: 'red' }} />
                        <p>您确定拒绝这个认证申请吗？</p>
                    </div>
                    <Input.TextArea
                        style={{ marginTop: '10px' }}
                        value={JujueContet}
                        onChange={e => setJujueContet(e.target.value)}
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
