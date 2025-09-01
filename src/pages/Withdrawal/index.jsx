import React, { useState, useEffect } from 'react'
import MagicTable from "@components/MagicTable";
import MagicPagination from "@components/MagicPagination/index.jsx";
import WithdrawalStyle from './index.module.scss'
import { TableConfig } from '@/config'
import { Transaction } from '@/api'
import { Input, Button, message, Tag, Tooltip, Modal } from "antd";
import zhifubao from '@/assets/png/allay.png'
import yinlian from '@/assets/png/allay2.png'
import weixin from '@/assets/png/allay3.png'
import { InfoCircleFilled } from '@ant-design/icons'


const Withdrawal = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { withdrawal } = TableConfig
    const { withdrawalList, withdrawharge,withdrawAudit } = Transaction
    const { TextArea } = Input;
    const [selectionType, setSelectionType] = useState('checkbox');
    const [requestdata, setRequestdata] = useState(
        {
            pageIndex: 1,
            pageSize: 10,
        })
    //是否显示通过对话框
    const [isTongGuo,setIsTongGuo] = useState(false)
    const [isJuJue ,setIsJuJue] = useState(false)
    const [ThroughId,setThroughId] = useState([])
    const [JujueContet,setJujueContet] = useState('')
    const [selectedRowKeys, setSelectedRowKeys] = useState([])


    const [total, setTotal] = useState(0)
    const [tableData, setTableData] = useState([])

    // 获取提现数据的函数
    const fetchWithdrawalData = async (params) => {
        const res = await withdrawalList(params)
        console.log(res)
        const { data: { list }, data: { totalCount } } = res
        setTableData(list)

        setTotal(totalCount)
    }

    useEffect(() => {
        fetchWithdrawalData(requestdata)
    }, [requestdata])

    const handleSearch = (value) => {
        if (value.target.value) {
            fetchWithdrawalData({ tradeNo: value.target.value })
        } else {
            fetchWithdrawalData(requestdata)
        }
    }


    function Through(record){
        setThroughId([...ThroughId,record.id])
        setIsTongGuo(true)
    }
    const WithdrawalColumnsWithActions = withdrawal.map(column => {
        if (column.key === 'channel') {
            return {
                ...column,
                render: (value, record) => {
                    switch (value) {
                        case 1:
                            return <Tooltip title="支付宝"><img src={zhifubao} alt="支付宝" style={{ width: 20, height: 20, cursor: 'pointer' }} /></Tooltip>
                        case 2:
                            return <Tooltip title="微信"><img src={weixin} alt="微信" style={{ width: 20, height: 20, cursor: 'pointer' }} /></Tooltip>
                        case 3:
                            return <Tooltip title="银联"><img src={yinlian} alt="银联" style={{ width: 20, height: 20, cursor: 'pointer' }} /></Tooltip>

                    }
                }
            }
        }
        if (column.key === 'status') {
            return {
                ...column,
                render: (value, record) => {
                    switch (value) {
                        case 0:
                            return <Tag color="magenta">待审核</Tag>
                        case 1:
                            return <Tag color="volcano">处理中</Tag>
                        case 2:
                            return <Tag color="green">提现成功</Tag>
                        case 3:
                            return <Tag color="red">提现失败</Tag>
                        case 4:
                            return <Tag color="orange">已撤销</Tag>
                        case 5:
                            return <Tag color="red">已拒绝</Tag>
                    }
                }
            }
        }
        if (column.key === 'action') {
            return {
                ...column,
                render: (value, record) => (
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Button onClick={() => Refuse(record)} disabled={record.status !== 0} size="small" color="danger" variant="outlined">拒绝</Button>
                        <Button onClick={() => Through(record)} disabled={record.status !== 0} size="small" color="cyan" variant="outlined">通过</Button>
                    </div>


                )
            }
        }
        return column
    })


    const handlePaginationChange = (page, pageSize) => {
       

        // 更新请求参数
        const newRequestData = {
            pageIndex: page,
            pageSize: pageSize
        }

        setRequestdata(newRequestData)


    }
    async function handleOk(){

        let params = {
            withdrawIds:ThroughId,
            approve:true
        }
        console.log(params)
        const res =await withdrawAudit(params)
        const {code}=res
        if (code === 200){
            await fetchWithdrawalData(requestdata)
            messageApi.success('操作成功')
            // 清除表格选中状态
            setSelectedRowKeys([])
        }else {
            messageApi.error('操作失败')
        }
        setIsTongGuo(false)
        setThroughId([])
    }
    function handleCancel(){
        setIsTongGuo(false)
        setThroughId([])
        setSelectedRowKeys([])
    }

    //拒绝提现操作
    function Refuse(record){
        setThroughId([...ThroughId,record.id])
        setIsJuJue(true)
    }
    async function handleOkJuJue(){
       
        if(JujueContet.length ===0){
            message.warning('请输入拒绝理由')
            return
        }
        let requestData={
            withdrawIds:ThroughId,
            approve:false,
            Reason:JujueContet
        }
        const res =await withdrawAudit(requestData)
        const {code}=res
        if (code === 200){
            await fetchWithdrawalData(requestdata)
            messageApi.success('操作成功')
            // 清除表格选中状态
            setSelectedRowKeys([])
        }else {
            messageApi.error('操作失败')
        }
        setJujueContet('')
        setIsJuJue(false)
        setThroughId([])
    }
    function handleCancelJuJue(){
        setIsJuJue(false)
        setJujueContet('')
        setThroughId([])
        setSelectedRowKeys([])
    }
    async function handleExport() {

        try {
            const res = await withdrawharge(requestdata)
            // requestdata
            const blob = res.data
            console.log(blob);
            // 创建下载链接
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = '提现数据.xlsx'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (e) {
            messageApi.error('导出失败');

        }
    }

    // 批量通过提现
    function handleBatchThrough() {
        if (ThroughId.length === 0) {
            messageApi.warning('请先选择需要通过的提现申请');
            return;
        }
        // 直接打开通过确认弹窗，ThroughId已经包含了选中的ID
        setIsTongGuo(true);
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys)
            setThroughId(selectedRows.map(item=>item.id))
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
          disabled: record.status !== 0, // 只有待审核状态的记录可以被选中
          name: record.id,
        }),
      };

    return (
        <div className={WithdrawalStyle.Withdrawal}>
            {contextHolder}
            <div className={WithdrawalStyle.Title}>
                <h1>提现管理</h1>
            </div>
            <div className={WithdrawalStyle.Search}>
                <Input placeholder="请输入订单号" style={{ width: '200px' }} onPressEnter={handleSearch} />
                <Button onClick={handleExport}>导出数据</Button>
                <Button color="cyan" variant="outlined" onClick={handleBatchThrough} disabled={ThroughId.length === 0}>批量通过</Button>
            </div>
            <div className={WithdrawalStyle.Table}>
                <MagicTable 
                    tableColumns={WithdrawalColumnsWithActions} 
                    tableData={tableData} 
                    rowSelection={{ type: selectionType, ...rowSelection }}
                    rowKey="withdrawNo"
                />
            </div>
            <div className={WithdrawalStyle.Pagination}>
                <MagicPagination total={total} defaultPageSize={requestdata.pageSize} onChange={handlePaginationChange} />
            </div>

            <Modal
                title="通过提现"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isTongGuo}
                okText="确认"
                cancelText="取消"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                <InfoCircleFilled style={{color:'#ffa616'}} />
                <p>您确定通过{ThroughId.length > 1 ? `这${ThroughId.length}笔` : '这笔'}提现吗？</p>
                </div>
            </Modal>

            <Modal
                title="拒绝提现"
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
                        <p>您确定拒绝提现吗？</p>

                    </div>
                    <TextArea
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
    )
}

export default Withdrawal