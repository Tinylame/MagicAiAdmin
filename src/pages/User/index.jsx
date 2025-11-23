import React, { useState, useEffect } from 'react'
import MagicTable from "@components/MagicTable/index.jsx";
import MagicPagination from "@components/MagicPagination/index.jsx";
import UserStyle from './index.module.scss'
import { TableConfig } from '@/config'
import { Users } from '@/api/'
import { Input, Button, Drawer,message } from "antd";
import defAvatar from '@/assets/png/avatar.png'
import NoUser from '@/assets/svg/User/NoUser.svg'

const User = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { user } = TableConfig
    const { userAll,getInviteList } = Users
    const [open, setOpen] = useState(false);
    const [userInfo, setUserInfo] = useState([])
    const [DtotalCount,setDtotalCount] = useState(0)
    const [Title,setTitle] = useState("")
    const [currentUserId, setCurrentUserId] = useState(null)
    const [requestdata, setRequestdata] = useState(
        {
            pageIndex: 1,
            pageSize: 10,
        })

    const [total, setTotal] = useState(0)
    const [tableData, setTableData] = useState([])


    // 获取用户数据的函数
    const fetchUserData = async (params) => {
        const res = await userAll(params)
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

    const userColumnsWithActions = user.map(column => {
        if (column.key === 'action') {
            return {
                ...column,
                render: (value, record) => (
                    <Button color="cyan" variant="outlined" size="small" onClick={() => handleAction(record)}>查看邀请用户</Button>
                )
            }
        }
        if(column.key === 'avatar') {
            return {
                ...column,
                render: (value, record) => (
                    <img src={value?value:defAvatar} alt='d' style={{ width: '30px',borderRadius: '50%' }} />
                )
            }
        }
        return column
    })

    const handleAction = async (record) => {
       const res = await getInviteList({
                pageIndex: 1,
                pageSize: 10,
                userId:record.userId
            })
            console.log(res);
            
        if (res.code === 200){
            setTitle(record.phoneNumber)
            setUserInfo(res.data.list||[])
            setDtotalCount(res.data.totalCount)
            console.log(res.data.total)
            setCurrentUserId(record.userId) 
            console.log(res.data.list)
            setOpen(true);
        }else {
            messageApi.error('操作失败')
        }

    };

    const onClose = () => {
        setOpen(false);
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

    // 处理抽屉内邀请用户列表的分页变化
    const handleDrawerPaginationChange = async (page, pageSize) => {
        console.log('抽屉分页变化:', page, pageSize);
        
        if (currentUserId) {
            try {
                const res = await getInviteList({
                    pageIndex: page,
                    pageSize: pageSize,
                    userId: currentUserId
                });
                
                if (res.code === 200) {
                    setUserInfo(res.data.list || []);
                    setDtotalCount(res.data.totalCount);
                    console.log(res.data.total)
                } else {
                    messageApi.error('获取邀请用户列表失败');
                }
            } catch (error) {
                console.error('获取邀请用户列表出错:', error);
                messageApi.error('获取邀请用户列表出错');
            }
        }
    }
    const DrawerList =[
        {
            title: '用户昵称',
            dataIndex: 'nickName',
            key: 'nickName'
        },
        {
            title: '用户手机号',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber'
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
    ]
    return (
        <div className={UserStyle.Users}>
            {contextHolder}
            <div className={UserStyle.Title}>
                <h1>用户管理</h1>
            </div>
            <div className={UserStyle.Search}>
                <Input placeholder="请输入用户手机号" style={{ width: '200px' }} onChange={handleSearch} />
            </div>
            <div className={UserStyle.Table} >
                <MagicTable
                    tableColumns={userColumnsWithActions}
                    tableData={tableData}
                />
            </div>
            <div className={UserStyle.Pagination}>
                <MagicPagination total={total} defaultPageSize={requestdata.pageSize} onChange={handlePaginationChange} />
            </div>
            <Drawer
                title={
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        {Title}
                        <img src={defAvatar} alt='d' style={{ width: '25px',borderRadius: '50%',marginLeft: '5px' }} />
                    </div>
                }
                onClose={onClose}
                open={open}
                size='large'
            >
             <div className={UserStyle.DrawerStyle}>
                 <div className={UserStyle.DrawerStyleTitle}>
                     <h1>邀请用户列表</h1>
                 </div>
                 <div className={UserStyle.Content}>
                     {userInfo && userInfo.length === 0 ? <div className={UserStyle.NoUser}>
                         <img src={NoUser} alt='没有数据'/>
                         <h1>没有邀请用户</h1>
                     </div> : <div className={UserStyle.HaveUser}>
                         {/*{userInfo.map(item => (*/}
                         {/*    <div key={item.id} className={UserStyle.userList}>*/}
                         {/*       <div className={UserStyle.UserItem}>*/}
                         {/*           <p>昵称：{item.nickName}</p>*/}
                         {/*       </div>*/}
                         {/*    </div>*/}
                         {/*))}*/}
                         <div className='flex-1'>
                             <MagicTable
                                 tableColumns={DrawerList}
                                 tableData={userInfo}
                             />
                         </div>
                         <div className='h-[60px]'>
                             <MagicPagination total={DtotalCount} defaultPageSize={requestdata.pageSize} onChange={handleDrawerPaginationChange} />
                         </div>

                     </div>}
                 </div>
             </div>
            </Drawer>
        </div>
    )
}

export default User