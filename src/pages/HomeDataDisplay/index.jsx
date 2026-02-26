import {useGetDisplayData} from './hooks/index.js';
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from 'react-router-dom'
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import MagicTable from "@components/MagicTable/index.jsx";
import MagicPagination from "@components/MagicPagination/index.jsx";

const { RangePicker } = DatePicker;

const HomeDataDiaPlay =()=>{
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [sortOrder, setSortOrder] = useState(0);
    const [dateRange, setDateRange] = useState(null);
    const [totalCount,setTotalCount] = useState(0);
    const [list,setList] = useState([]);
    const [tableComponent, setTableComponent] = useState([]);
    const {getData,geTableTitle} = useGetDisplayData();
    const [searchParams] = useSearchParams(); // Hooks 必须在组件顶层调用
    const title = searchParams.get('title'); // 获取 title 参数
    
    useEffect(()=>{
        setTableComponent(geTableTitle( title))
    },[title])
    
    useEffect(()=>{
        if (title) {
            const fetchData = async () => {
                const params = {
                    pageIndex, 
                    pageSize, 
                    sortOrder
                };
                // 如果有时间范围，添加到参数中
                if (dateRange && dateRange[0] && dateRange[1]) {
                    params.startDate = dateRange[0].format('YYYY-MM-DD HH:mm:ss');
                    params.endDate = dateRange[1].format('YYYY-MM-DD HH:mm:ss');
                }
                const result = await getData(title, params);
                const {totalCount,list} = result
                setTotalCount(totalCount)
                setList(list)
            };
            fetchData()
        }
    }, [title, pageIndex, pageSize, sortOrder, dateRange])

    const handlePaginationChange = (page, size) => {
        setPageIndex(page);
        setPageSize(size);
    }

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        setPageIndex(1); // 重置到第一页
    };

    const handleSortOrderChange = (value) => {
        setSortOrder(value);
        setPageIndex(1); // 重置到第一页
    };

    return(
        <div className='size-full flex flex-col gap-[10px]'>
            <div className='h-[30px]'>
                <h1 className='text-[18px]'>{title}</h1>
            </div>
            <div className='flex items-center gap-[10px]'>
                <RangePicker 
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['开始日期时间', '结束日期时间']}
                />
                <Select
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                    style={{ width: 120 }}
                    options={[
                        { label: '降序', value: 0 },
                        { label: '升序', value: 1 }
                    ]}
                />
            </div>
            <div className='flex-1 w-full'>
                <MagicTable tableColumns={tableComponent} tableData={list} />
            </div>
            <div className='h-[30px] w-full'>
                <MagicPagination total={totalCount} defaultPageSize={pageSize} onChange={handlePaginationChange}/>
            </div>
        </div>
    )
}

export default HomeDataDiaPlay