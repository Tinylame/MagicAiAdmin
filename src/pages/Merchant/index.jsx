import React, { useState, useEffect } from 'react'
import MagicTable from "@components/MagicTable/index.jsx";
import MagicPagination from "@components/MagicPagination/index.jsx";
import MerchantStyle from './index.module.scss'
import { TableConfig } from '@/config'
import { Users } from '@/api/'
import { Input,Switch } from "antd";
import defAvatar from '@/assets/png/avatar.png'

const Merchant = () => {
    const { merchant } = TableConfig
    const { merchantAll } = Users
    const [requestdata, setRequestdata] = useState(
        {
            pageIndex: 1,
            pageSize: 10,
        })
    const [total,setTotal] = useState(0)
    const [tableData, setTableData] = useState([])

    // 获取用户数据的函数
    const fetchUserData = async (params) => {
        const res = await merchantAll(params)
        const {data:{list},data:{totalCount}}=res
        setTableData(list)
        setTotal(totalCount)
    }

    useEffect(() => {
        fetchUserData(requestdata)
    }, [requestdata]) 

    const handleSearch = (value) => {
        if (value.target.value) {
            fetchUserData({phoneNumber:value.target.value})
        }else{
            fetchUserData(requestdata)
        }
    }

    const userColumnsWithActions = merchant.map(column => {
        if(column.key === 'avatar') {
            return {
                ...column,
                render: (value, record) => (
                    <img src={value?value:defAvatar} alt='d' style={{ width: '30px',borderRadius: '50%' }} />
                )
            }
        }
        if (column.key === 'action') {
            return {
                ...column,
                render: (value, record) => (
                    <Switch checked={record.isGray} onChange={() => handleAction(record)}/>
                )
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
        
        // 打印新的请求参数（用于调试）
        console.log('新的请求参数:', newRequestData)
    }

    return (
        <div className={MerchantStyle.Merchant}>
            <div className={MerchantStyle.Title}>
                <h1>商户管理</h1>
            </div>
            <div className={MerchantStyle.Search}>
                <Input placeholder="请输入商户手机号" style={{width: '200px'}} onChange={handleSearch}/>
            </div>
            <div className={MerchantStyle.Table}>
                <MagicTable tableColumns={userColumnsWithActions} tableData={tableData} />
            </div>
            <div className={MerchantStyle.Pagination}>
                <MagicPagination total={total} defaultPageSize={requestdata.pageSize} onChange={handlePaginationChange}/>
            </div>
        </div>
    )
}

export default Merchant