import React, { useState, useEffect } from 'react'
import MagicTable from "@components/MagicTable/index.jsx";
import MagicPagination from "@components/MagicPagination/index.jsx";
import FeedbackStyle from './index.module.scss'
import { TableConfig } from '@/config'
import { FeedBacks } from '@/api/'
import { Input, Button, Image ,message,Tag, Modal  } from "antd";
import defAvatar from '@/assets/png/avatar.png'

const Feedback = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { feedbackTable } = TableConfig
    const { getFeedBackList,updStud } = FeedBacks
    const [open, setOpen] = useState(false);
    const [userInfo, setUserInfo] = useState([])
    const [Title,setTitle] = useState("")
    const [contentModalOpen, setContentModalOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState("")
    const [requestdata, setRequestdata] = useState(
        {
            pageIndex: 1,
            pageSize: 10,
        })

    const [total, setTotal] = useState(0)
    const [tableData, setTableData] = useState([])


    // 获取用户数据的函数
    const fetchUserData = async (params) => {
        const res = await getFeedBackList(params)
        const { data: { list }, data: { totalCount } } = res
        setTableData(list)
        setTotal(totalCount)
    }



    useEffect(() => {
        fetchUserData(requestdata)
    }, [requestdata])

    const handleSearch = (value) => {
        if (value.target.value) {
            fetchUserData({ phoneNumber: value.target.value })
        } else {
            fetchUserData(requestdata)
        }
    }

    const userColumnsWithActions = feedbackTable.map(column => {
        if (column.key === 'imageUrlsList') {
            return {
                ...column,
                render: (value, record) => (
                   <div style={{ display: 'flex', justifyContent: 'center', gap: '5px',objectFit:'cover' }}>{value.map(item => <Image src={item} alt='d' style={{width:'30px',height:'30px',borderRadius:'5px',objectFit:'cover'}} />)}</div>
                )
            }
        }
        if(column.key === 'status') {
            return {
                ...column,
                render: (value, record) => (
                    <Tag color={value === 1 ? 'green' : 'red'}>{value === 1 ? '已处理' : '未处理'}</Tag>
                )
            }
        }
        if(column.key === 'content') {
            return {
                ...column,
                render: (value, record) => (
                    <span 
                        style={{width:'100px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer'}} 
                        onClick={() => handleContentClick(value)}
                    >
                        {value.length > 10 ? value.slice(0, 10) + '...' : value}
                    </span>
                )
            }
        }
        if(column.key === 'action') {
            return {
                ...column,
                render: (value, record) => (

                    <Button color="cyan" variant="outlined" size="small" onClick={() => handleAction(record)} disabled={record.status === 1}>已处理</Button>
                )
            }
        }
        return column
    })

    const handleAction = async (record) => {
       const res = await updStud({
                id:record.id,
                status:1
            })
        if (res.code === 200){
            messageApi.success('操作成功')
            fetchUserData(requestdata)
        }else {
            messageApi.error('操作失败')
        }

    };

    const onClose = () => {
        setOpen(false);
    };

    const handleContentClick = (content) => {
        setSelectedContent(content);
        setContentModalOpen(true);
    };

    const handleContentModalClose = () => {
        setContentModalOpen(false);
        setSelectedContent("");
    };


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
        <div className={FeedbackStyle.Feedback}>
            {contextHolder}
            <div className={FeedbackStyle.Title}>
                <h1>意见反馈</h1>
            </div>
            {/* <div className={FeedbackStyle.Search}>
                <Input placeholder="请输入用户手机号" style={{ width: '200px' }} onPressEnter={handleSearch} />
            </div> */}
            <div className={FeedbackStyle.Table} >
                <MagicTable
                    tableColumns={userColumnsWithActions}
                    tableData={tableData}
                    height={300}
                />
            </div>
            <div className={FeedbackStyle.Pagination}>
                <MagicPagination total={total} defaultPageSize={requestdata.pageSize} onChange={handlePaginationChange} />
            </div>
            
            <Modal
                title="完整内容"
                open={contentModalOpen}
                onCancel={handleContentModalClose}
                footer={[
                    <Button key="close" onClick={handleContentModalClose}>
                        关闭
                    </Button>
                ]}
                width={600}
            >
                <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '16px 0' }}>
                    <p style={{ lineHeight: '1.6', fontSize: '14px', margin: 0 }}>
                        {selectedContent}
                    </p>
                </div>
            </Modal>
        </div>
    )
}

export default Feedback