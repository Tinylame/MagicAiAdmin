import React, { useState, useEffect, useCallback } from 'react'
import MagicTable from '@components/MagicTable'
import MagicPagination from '@components/MagicPagination/index.jsx'
import WithdrawalStyle from './index.module.scss'
import { TableConfig } from '@/config'
import {
  commercialTenantWithdrawalList,
  commercialTenantWithdrawalAuditPass,
  commercialTenantWithdrawalAuditReject,
  exportCommercialTenantWithdrawal,
} from '@/api/commercialTenantWithdrawal'
import { Input, Button, message, Tag, Tooltip, Modal } from 'antd'
import zhifubao from '@/assets/png/allay.png'
import yinlian from '@/assets/png/allay2.png'
import weixin from '@/assets/png/allay3.png'
import { InfoCircleFilled } from '@ant-design/icons'

const CommercialTenantWithdrawal = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { commercialTenantWithdrawal } = TableConfig
  const { TextArea } = Input
  const [selectionType] = useState('checkbox')
  const [requestdata, setRequestdata] = useState({
    pageIndex: 1,
    pageSize: 10,
  })

  // 输入框了列表
  const [fromDate, setFromDate] = useState({
    refundNo: '',
    phoneNumber: '',
    amount: '',
  })
  //是否显示通过对话框
  const [isTongGuo, setIsTongGuo] = useState(false)
  const [isJuJue, setIsJuJue] = useState(false)
  const [ThroughId, setThroughId] = useState([])
  const [JujueContet, setJujueContet] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const [total, setTotal] = useState(0)
  const [tableData, setTableData] = useState([])

  // 获取提现数据的函数
  const fetchWithdrawalData = useCallback(
    async params => {
      try {
        const res = await commercialTenantWithdrawalList(params)
        console.log(res)
        const {
          data: { list },
          data: { totalCount },
        } = res
        setTableData(list || [])
        setTotal(totalCount || 0)
      } catch (error) {
        console.error('获取提现数据失败:', error)
        messageApi.error('获取数据失败')
        setTableData([])
        setTotal(0)
      }
    },
    [messageApi]
  )

  useEffect(() => {
    // 合并搜索条件到请求参数
    const params = {
      ...requestdata,
      ...(fromDate.refundNo && { refundNo: fromDate.refundNo }),
      ...(fromDate.phoneNumber && { phoneNumber: fromDate.phoneNumber }),
      ...(fromDate.amount && { amount: fromDate.amount }),
    }
    fetchWithdrawalData(params)
  }, [requestdata, fromDate, fetchWithdrawalData])

  // 处理订单号输入框变化
  const handleRefundNoChange = e => {
    const value = e.target.value
    setFromDate(prev => ({
      ...prev,
      refundNo: value,
    }))
    // 重置到第一页并更新搜索条件
    setRequestdata(prev => ({
      ...prev,
      pageIndex: 1,
    }))
  }

  // 格式化时间为yyyy-MM-dd HH:mm:ss
  const formatTime = time => {
    const date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  // 处理手机号输入框变化
  const handlePhoneNumberChange = e => {
    const value = e.target.value
    setFromDate(prev => ({
      ...prev,
      phoneNumber: value,
    }))
    // 重置到第一页并更新搜索条件
    setRequestdata(prev => ({
      ...prev,
      pageIndex: 1,
    }))
  }

  const handleMoneyChange = e => {
    const value = e.target.value
    setFromDate(prev => ({
      ...prev,
      amount: value,
    }))
    // 重置到第一页并更新搜索条件
    setRequestdata(prev => ({
      ...prev,
      pageIndex: 1,
    }))
  }

  function Through(record) {
    setThroughId([record.id])
    setIsTongGuo(true)
  }
  const WithdrawalColumnsWithActions = commercialTenantWithdrawal.map(column => {
    if (column.key === 'channel') {
      return {
        ...column,
        render: value => {
          switch (value) {
            case 1:
              return (
                <Tooltip title="支付宝">
                  <img src={zhifubao} alt="支付宝" style={{ width: 20, height: 20, cursor: 'pointer' }} />
                </Tooltip>
              )
            case 2:
              return (
                <Tooltip title="微信">
                  <img src={weixin} alt="微信" style={{ width: 20, height: 20, cursor: 'pointer' }} />
                </Tooltip>
              )
            case 3:
              return (
                <Tooltip title="银联">
                  <img src={yinlian} alt="银联" style={{ width: 20, height: 20, cursor: 'pointer' }} />
                </Tooltip>
              )
          }
        },
      }
    }
    if (column.key === 'statusDesc') {
      return {
        ...column,
        render: (value, record) => {
          // 如果statusDesc有值，直接显示；否则根据status字段判断
          if (value) {
            return <Tag color="magenta">{value}</Tag>
          }
          // 兼容处理：如果statusDesc为空，使用status字段
          const status = record.status
          switch (status) {
            case 0:
              return <Tag color="magenta">待审核</Tag>
            case 1:
              return <Tag color="volcano">处理中</Tag>
            case 2:
              return <Tag color="green">退款成功</Tag>
            case 3:
              return <Tag color="red">退款失败</Tag>
            case 4:
              return <Tag color="orange">已撤销</Tag>
            case 5:
              return <Tag color="red">已拒绝</Tag>
            default:
              return <Tag>{value || '未知'}</Tag>
          }
        },
      }
    }
    if (column.key === 'createTime') {
      return {
        ...column,
        render: value => {
          if (value) return <span>{formatTime(value)}</span>
        },
      }
    }
    if (column.key === 'successTime') {
      return {
        ...column,
        render: value => {
          if (value) return <span>{formatTime(value)}</span>
        },
      }
    }
    if (column.key === 'action') {
      return {
        ...column,
        render: (value, record) => (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              onClick={() => Refuse(record)}
              disabled={record.status !== 0 && record.statusDesc !== '待审核'}
              size="small"
              color="danger"
              variant="outlined"
            >
              拒绝
            </Button>
            <Button
              onClick={() => Through(record)}
              disabled={record.status !== 0 && record.statusDesc !== '待审核'}
              size="small"
              color="cyan"
              variant="outlined"
            >
              通过
            </Button>
          </div>
        ),
      }
    }
    return column
  })

  const handlePaginationChange = (page, pageSize) => {
    // 更新请求参数
    const newRequestData = {
      pageIndex: page,
      pageSize: pageSize,
    }

    setRequestdata(newRequestData)
  }

  async function handleOk() {
    // 验证是否有有效的ID
    if (!ThroughId || ThroughId.length === 0) {
      messageApi.warning('请选择需要通过的提现申请')
      return
    }
    try {
      // 确保 refundIds 是数组格式
      const requestParams = {
        refundIds: Array.isArray(ThroughId) ? ThroughId : [ThroughId],
      }
      console.log('通过接口参数:', requestParams)
      const res = await commercialTenantWithdrawalAuditPass(requestParams)
      const { code } = res
      if (code === 200) {
        // 合并搜索条件到请求参数
        const fetchParams = {
          ...requestdata,
          ...(fromDate.refundNo && { refundNo: fromDate.refundNo }),
          ...(fromDate.phoneNumber && { phoneNumber: fromDate.phoneNumber }),
          ...(fromDate.amount && { amount: fromDate.amount }),
        }
        await fetchWithdrawalData(fetchParams)
        messageApi.success('操作成功')
        // 清除表格选中状态
        setSelectedRowKeys([])
      } else {
        messageApi.error(res.message || '操作失败')
      }
    } catch (error) {
      console.error('通过退款失败:', error)
      messageApi.error('操作失败')
    } finally {
      setIsTongGuo(false)
      setThroughId([])
    }
  }
  function handleCancel() {
    setIsTongGuo(false)
    setThroughId([])
    setSelectedRowKeys([])
  }

  //拒绝退款操作
  function Refuse(record) {
    setThroughId([record.id])
    setIsJuJue(true)
  }
  async function handleOkJuJue() {
    if (JujueContet.length === 0) {
      messageApi.warning('请输入拒绝理由')
      return
    }
    try {
      let requestData = {
        refundIds: ThroughId,
        reason: JujueContet,
      }
      const res = await commercialTenantWithdrawalAuditReject(requestData)
      const { code } = res
      if (code === 200) {
        // 合并搜索条件到请求参数
        const params = {
          ...requestdata,
          ...(fromDate.refundNo && { refundNo: fromDate.refundNo }),
          ...(fromDate.phoneNumber && { phoneNumber: fromDate.phoneNumber }),
          ...(fromDate.amount && { amount: fromDate.amount }),
        }
        await fetchWithdrawalData(params)
        messageApi.success('操作成功')
        // 清除表格选中状态
        setSelectedRowKeys([])
      } else {
        messageApi.error(res.message || '操作失败')
      }
    } catch (error) {
      console.error('拒绝退款失败:', error)
      messageApi.error('操作失败')
    } finally {
      setJujueContet('')
      setIsJuJue(false)
      setThroughId([])
    }
  }
  function handleCancelJuJue() {
    setIsJuJue(false)
    setJujueContet('')
    setThroughId([])
    setSelectedRowKeys([])
  }
  // 导出全部数据
  async function handleExportAll() {
    try {
      const exportData = {
        ...requestdata,
        ...(fromDate.refundNo && { refundNo: fromDate.refundNo }),
        ...(fromDate.phoneNumber && { phoneNumber: fromDate.phoneNumber }),
        ...(fromDate.amount && { amount: fromDate.amount }),
      }
      const res = await exportCommercialTenantWithdrawal(exportData)
      const blob = res.data
      console.log(blob)
      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '提现数据_全部.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      messageApi.success('导出成功')
    } catch (e) {
      console.log(e)
      messageApi.error('导出失败')
    }
  }

  // 导出当前页数据
  async function handleExportCurrentPage() {
    try {
      const exportData = {
        pageIndex: requestdata.pageIndex,
        pageSize: requestdata.pageSize,
        ...(fromDate.refundNo && { refundNo: fromDate.refundNo }),
        ...(fromDate.phoneNumber && { phoneNumber: fromDate.phoneNumber }),
        ...(fromDate.amount && { amount: fromDate.amount }),
      }
      const res = await exportCommercialTenantWithdrawal(exportData)
      const blob = res.data
      console.log(blob)
      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `提现数据_第${requestdata.pageIndex}页.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      messageApi.success('导出成功')
    } catch (e) {
      console.log(e)
      messageApi.error('导出失败')
    }
  }

  // 批量通过提现
  function handleBatchThrough() {
    if (selectedRowKeys.length === 0) {
      messageApi.warning('请先选择需要通过的提现申请')
      return
    }
    // 从表格数据中获取选中行的完整记录
    const selectedRows = tableData.filter(item => selectedRowKeys.includes(item.refundNo))
    // 过滤出待审核状态的记录
    const validRows = selectedRows.filter(item => item.status === 0 || item.statusDesc === '待审核')
    if (validRows.length === 0) {
      messageApi.warning('所选记录中没有待审核状态的提现申请')
      return
    }
    // 提取有效的记录ID
    const validIds = validRows.map(item => item.id)
    setThroughId(validIds)
    // 打开通过确认弹窗
    setIsTongGuo(true)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
      // 只存储待审核状态的记录ID
      const validIds = selectedRows
        .filter(item => item.status === 0 || item.statusDesc === '待审核')
        .map(item => item.id)
      setThroughId(validIds)
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows, 'validIds: ', validIds)
    },
    getCheckboxProps: record => ({
      disabled: record.status !== 0 && record.statusDesc !== '待审核', // 只有待审核状态的记录可以被选中
      name: record.id,
    }),
  }

  return (
    <div className={WithdrawalStyle.Withdrawal}>
      {contextHolder}
      <div className={WithdrawalStyle.Title}>
        <h1>提现管理</h1>
      </div>
      <div className={WithdrawalStyle.Search}>
        <Input
          placeholder="请输入订单号"
          style={{ width: '200px' }}
          onChange={handleRefundNoChange}
          value={fromDate.refundNo}
        />
        <Input
          placeholder="请输入手机号"
          style={{ width: '200px' }}
          onChange={handlePhoneNumberChange}
          value={fromDate.phoneNumber}
        />
        <Input
          placeholder="请输入金额"
          style={{ width: '200px' }}
          onChange={handleMoneyChange}
          value={fromDate.amount}
        />
        <Button onClick={handleExportAll}>全部导出</Button>
        <Button
          onClick={handleExportCurrentPage}
          disabled={!fromDate.refundNo && !fromDate.phoneNumber && !fromDate.amount}
        >
          导出搜索数据
        </Button>
        <Button color="cyan" variant="outlined" onClick={handleBatchThrough} disabled={selectedRowKeys.length === 0}>
          批量通过
        </Button>
      </div>
      <div className={WithdrawalStyle.Table}>
        <MagicTable
          tableColumns={WithdrawalColumnsWithActions}
          tableData={tableData}
          rowSelection={{ type: selectionType, ...rowSelection }}
          rowKey="refundNo"
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <InfoCircleFilled style={{ color: '#ffa616' }} />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <InfoCircleFilled style={{ color: 'red' }} />
            <p>您确定拒绝提现吗？</p>
          </div>
          <TextArea
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
  )
}

export default CommercialTenantWithdrawal
