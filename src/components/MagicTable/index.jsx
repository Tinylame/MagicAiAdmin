import React from 'react';
import { Table, Tooltip } from 'antd';
import styles from './index.module.scss';

const MagicTable = ({ tableData = [], tableColumns = [], height = 270, rowSelection, rowKey = 'id' }) => {
    console.log(rowSelection);
    
    // 处理列数据，为长文本添加省略号和气泡提示
    const processColumns = (columns) => {
        return columns.map(col => {
            // 如果列没有设置宽度，设置默认宽度
            if (!col.width) {
                col.width = 150; // 默认列宽
            }
            
            if (col.dataIndex && col.render === undefined) {
                return {
                    ...col,
                    align: 'center', // 设置列内容居中对齐
                    ellipsis: true, // 启用省略号
                    render: (text, record, index) => {
                        if (text && typeof text === 'string' && text.length > 20) {
                            return (
                                <Tooltip title={text} placement="topLeft">
                                    <div style={{ 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis', 
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        textAlign: 'center' 
                                    }}>
                                        {text}
                                    </div>
                                </Tooltip>
                            );
                        }
                        return text;
                    }
                };
            }
            // 为已有 render 函数的列也添加居中对齐和省略号
            return {
                ...col,
                align: 'center',
                ellipsis: true
            };
        });
    };

    const processedColumns = processColumns(tableColumns);

    return (
        <div style={{ 
            width: '100%', 
            overflow: 'auto',
            minWidth: 0 // 确保容器不会过度扩展
        }}>
            <Table 
                dataSource={tableData} 
                columns={processedColumns} 
                pagination={false}
                rowSelection={rowSelection}
                rowKey={rowKey}
                scroll={{ 
                    y: `calc(100vh - ${height}px)`,
                    x: 'max-content' // 添加水平滚动支持
                }}
                style={{
                    textAlign: 'center'
                }}
                // 设置表格列的最小宽度，防止过度挤压
                tableLayout="fixed"
            />
        </div>
    )
}

export default MagicTable;