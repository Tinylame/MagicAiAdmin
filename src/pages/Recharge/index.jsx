import React, { useState, useEffect } from 'react'
import MagicTable from "@components/MagicTable";
import MagicPagination from "@components/MagicPagination/index.jsx";
import RechargeStyle from './index.module.scss'
import { TableConfig } from '@/config'
import { Transaction} from '@/api'
import { Input,Button,message,Tag,Tooltip } from "antd";
import zhifubao from '@/assets/png/allay.png'
import yinlian from '@/assets/png/allay2.png'
import weixin from '@/assets/png/allay3.png'


const Recharge = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { recharge } = TableConfig
    const { rechargeList,exportRecharge } = Transaction
    const [requestdata, setRequestdata] = useState(
        {
            pageIndex: 1,
            pageSize: 10,
        })
    const [total,setTotal] = useState(0)
    const [tableData, setTableData] = useState([])

    // 获取用户数据的函数
    const fetchRechargeData = async (params) => {
        const res = await rechargeList(params)
        console.log(res)
        const {data:{list},data:{totalCount}}=res
        setTableData(list)
        setTotal(totalCount)
    }

    useEffect(() => {
        fetchRechargeData(requestdata)
    }, [requestdata])

    const handleSearch = (value) => {

        if (value.target.value) {
            fetchRechargeData({tradeNo:value.target.value})
        }else{
            fetchRechargeData(requestdata)
        }
    }

    const RechargeColumnsWithActions = recharge.map(column => {
        if (column.key === 'payChannel') {
            return {
                ...column,
                render: (value, record) => {
                    switch (value) {
                        case 1:
                            return (
                                <Tooltip title="支付宝"><img src={zhifubao} alt="支付宝" style={{ width: 20, height: 20 ,cursor: 'pointer'}} /></Tooltip>
                            )
                        case 2:
                            return (
                                <Tooltip title="微信"><img src={weixin} alt="微信" style={{ width: 20, height: 20 ,cursor: 'pointer'}} /></Tooltip>
                            )
                        case 3:
                            return (
                                <Tooltip title="银联"><img src={yinlian} alt="银联" style={{ width: 20, height: 20 ,cursor: 'pointer'}} /></Tooltip>
                            )
                       
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
                            return <Tag color="magenta">未支付</Tag>
                        case 1:
                            return <Tag color="volcano">支付中</Tag>
                        case 2:
                            return <Tag color="green">支付成功</Tag>
                        case 3:
                            return <Tag color="red">支付失败</Tag>
                        case 4:
                            return <Tag color="orange">已取消</Tag>
                    }
                }
            }
        }
        return column
    })

    // 处理操作按钮点击事件
    const handleAction = (record) => {
        console.log('操作用户:', record)
    }

    const handlePaginationChange = (page, pageSize) => {
        console.log('分页变化:', page, pageSize);

        // 更新请求参数
        const newRequestData = {
            pageIndex: page,
            pageSize: pageSize
        }

        setRequestdata(newRequestData)

      
    }
    async function handleExport(){
        
        try {
            const res = await exportRecharge(requestdata)
            // requestdata
      
            
            const blob = res.data
            
            // 创建下载链接
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = '充值数据.xlsx'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            messageApi.error('导出失败');
            
        }
    }

    return (
        <div className={RechargeStyle.Recharges}>
            {contextHolder}
            <div className={RechargeStyle.Title}>
                <h1>充值管理</h1>
            </div>
            <div className={RechargeStyle.Search}>
                <Input placeholder="请输入订单号" style={{width: '200px'}} onChange={handleSearch}/>
                <Button onClick={handleExport}>导出数据</Button>
            </div>
            <div className={RechargeStyle.Table}>
                <MagicTable tableColumns={RechargeColumnsWithActions} tableData={tableData} />
            </div>
            <div className={RechargeStyle.Pagination}>
                <MagicPagination total={total} defaultPageSize={requestdata.pageSize} onChange={handlePaginationChange}/>
            </div>
        </div>
    )
}

export default Recharge