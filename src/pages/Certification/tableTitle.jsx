import { Button, Tag } from 'antd'
import React from "react";
import { TableConfig } from '@/config'

export const tableTitle = (Refuse, Through, showDrawer) => {
    const { certificateTable } = TableConfig
    return certificateTable.map(item => {
        if (item.dataIndex === 'action') {
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
        if (item.dataIndex === 'ForDetails') {
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
        if (item.dataIndex === 'status') {
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
}