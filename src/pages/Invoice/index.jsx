import React, {useState, useEffect} from "react";
import {invoice} from "@/api/index.js";
import {TableConfig} from '@/config/tableConfig/columns.js'
import MagicTable from "@components/MagicTable/index.jsx";
import MagicPagination from "@components/MagicPagination/index.jsx";

import {Button, Tag, Modal, message, Input} from "antd";
import { InfoCircleFilled } from '@ant-design/icons';
const Invoice = () => {
    const {invoiceTable} = TableConfig;
    const {getInvoiceList, InvoiceApply, GetInvoiceDetail}=invoice
    const { TextArea } = Input;
    const [messageApi, contextHolder] = message.useMessage();
    
    const [page, setPage] = useState({
        pageIndex: 1,
        pageSize: 10,
    });
    const [total, setTotal] = useState(0)
    const [rows, setRows] = useState([]);
    const [invoiceType,setInvoiceType] = useState(2);
    
    // Modal状态管理
    const [isTongGuo, setIsTongGuo] = useState(false);
    const [isJuJue, setIsJuJue] = useState(false);
    const [currentInvoiceId, setCurrentInvoiceId] = useState(null);
    const [jujueContent, setJujueContent] = useState('');
    const [approveRemark, setApproveRemark] = useState('');
    const getInvoice = async (type = invoiceType) => {
        const requestData = {
            pageIndex: page.pageIndex,
            pageSize: page.pageSize,
            invoiceType: type,
        }

        const {data} = await getInvoiceList(requestData);
        setRows(data.list)
        setTotal(data.total)
    }
    const toPersonal=async (value)=>{
        setInvoiceType(value)
        await getInvoice(value)

    }

    const handlePaginationChange = async ()=>{
        await getInvoice()
    }

    // 通过发票申请
    const handleApprove = (record) => {
        setCurrentInvoiceId(record.invoiceId);
        setIsTongGuo(true);
    }

    // 拒绝发票申请
    const handleReject = (record) => {
        setCurrentInvoiceId(record.invoiceId);
        setIsJuJue(true);
    }

    // 确认通过发票
    const handleOkApprove = async () => {
        try {
            const params = {
                invoiceId: currentInvoiceId,
                status: 1,
                remark: approveRemark || "",
                rejectReason: ""
            }
            
            const res = await InvoiceApply(params);
            const { code } = res;
            
            if (code === 200) {
                await getInvoice();
                messageApi.success('操作成功');
            } else {
                messageApi.error('操作失败');
            }
        } catch (error) {
            messageApi.error('操作失败');
        }
        
        setIsTongGuo(false);
        setCurrentInvoiceId(null);
        setApproveRemark('');
    }

    // 取消通过发票
    const handleCancelApprove = () => {
        setIsTongGuo(false);
        setCurrentInvoiceId(null);
        setApproveRemark('');
    }

    // 确认拒绝发票
    const handleOkReject = async () => {
        if (jujueContent.length === 0) {
            message.warning('请输入拒绝理由');
            return;
        }
        
        try {
            const params = {
                invoiceId: currentInvoiceId,
                status: 2,
                remark: approveRemark || "",
                rejectReason: jujueContent
            }
            
            const res = await InvoiceApply(params);
            const { code } = res;
            
            if (code === 200) {
                await getInvoice();
                messageApi.success('操作成功');
            } else {
                messageApi.error('操作失败');
            }
        } catch (error) {
            messageApi.error('操作失败');
        }
        
        setJujueContent('');
        setIsJuJue(false);
        setCurrentInvoiceId(null);
        setApproveRemark('');
    }

    // 取消拒绝发票
    const handleCancelReject = () => {
        setIsJuJue(false);
        setJujueContent('');
        setCurrentInvoiceId(null);
        setApproveRemark('');
    }
    const invoiceTableChange=invoiceTable.map(item=>{
        if(item.key === 'action') {
            return {
                ...item,
                render: (value, record) => (
                    <div className='flex gap-[10px]'>
                        <Button 
                            onClick={() => handleReject(record)} 
                            disabled={record.status !== 0} 
                            color="danger" 
                            variant="outlined" 
                            size="small"
                        >
                            拒绝
                        </Button>
                        <Button 
                            onClick={() => handleApprove(record)} 
                            disabled={record.status !== 0} 
                            color="cyan" 
                            variant="outlined" 
                            size="small"
                        >
                            通过
                        </Button>
                    </div>

                )
            }
        }
        if(item.key === 'status'){
            return {
                ...item,
                render: (value, record) => {
                    switch (value) {
                        case 0:
                            return <Tag color="magenta">待审核</Tag>
                        case 1:
                            return <Tag color="volcano">审核通过</Tag>
                        case 2:
                            return <Tag color="red">拒绝</Tag>
                            // <Tag color="green">提现成功</Tag>
                        case 3:
                            return <Tag color="green">已开票</Tag>

                    }
                }
            }
        }
        return item
    })
    useEffect(() => {
        getInvoice();
    },[])
    return (
      <div className='size-[100%] flex flex-col gap-[10px]'>
        {contextHolder}
        <div className='w-[100%] h-[30px]'>
            <h1 className='text-[18px]'>发票管理</h1>
        </div>
        <div className='w-[120px] h-[30px] flex relative border-[1px] border-solid border-gray-200 rounded-[4px] cursor-pointer'>
            <div className={`h-[100%] w-[50%] flex items-center justify-center ${invoiceType===2?'text-[#5A6EFF]':''}`} onClick={()=>{toPersonal(2)}}>企业</div>
            <div className={`h-[100%] w-[50%] flex items-center justify-center ${invoiceType===1?'text-[#5A6EFF]':''}`} onClick={()=>{toPersonal(1)}}>个人</div>

            <div className={`absolute h-[100%] w-[50%] top-0 ${invoiceType===2?'left-0':'left-[50%]'} bg-[linear-gradient(51.79deg,rgba(168,80,255,0.2)-43.51%,rgba(109,80,255,0.2)12.49%,rgba(125,132,255,0.2)55.42%,rgba(123,187,255,0.2)146.89%)] rounded-[4px] transition-all duration-300 ease-in-out`}></div>
        </div>
        <div className='w-[100%] flex-1 '>
            <MagicTable
                tableColumns={invoiceTableChange}
                tableData={rows}
            />
        </div>
        <div className='w-[100%] h-[30px]'>
            <MagicPagination total={total} defaultPageSize={page.pageSize} onChange={handlePaginationChange} />
        </div>

        {/* 通过发票确认Modal */}
        <Modal
            title="通过发票"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isTongGuo}
            okText="确认"
            cancelText="取消"
            onOk={handleOkApprove}
            onCancel={handleCancelApprove}
        >
            <div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <InfoCircleFilled style={{color:'#ffa616'}} />
                    <p>您确定通过这张发票申请吗？</p>
                </div>
                <TextArea
                    style={{marginTop:'10px'}}
                    value={approveRemark}
                    onChange={e=>setApproveRemark(e.target.value)}
                    placeholder="请输入备注信息(可选，最多48个字)"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    maxLength={48}
                />
            </div>
        </Modal>

        {/* 拒绝发票确认Modal */}
        <Modal
            title="拒绝发票"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isJuJue}
            okText="确认"
            cancelText="取消"
            onOk={handleOkReject}
            onCancel={handleCancelReject}
        >
            <div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <InfoCircleFilled style={{color:'red'}} />
                    <p>您确定拒绝这张发票申请吗？</p>
                </div>
                <div style={{marginTop:'10px'}}>
                    <p style={{marginBottom:'5px'}}>拒绝理由：</p>
                    <TextArea
                        value={jujueContent}
                        onChange={e=>setJujueContent(e.target.value)}
                        placeholder="请输入拒绝的理由(必填，最多48个字)"
                        autoSize={{ minRows: 2, maxRows: 3 }}
                        maxLength={48}
                    />
                </div>
                <div style={{marginTop:'10px'}}>
                    <p style={{marginBottom:'5px'}}>备注信息：</p>
                    <TextArea
                        value={approveRemark}
                        onChange={e=>setApproveRemark(e.target.value)}
                        placeholder="请输入备注信息(可选，最多48个字)"
                        autoSize={{ minRows: 2, maxRows: 3 }}
                        maxLength={48}
                    />
                </div>
            </div>
        </Modal>
      </div>
    )
}

export default Invoice
