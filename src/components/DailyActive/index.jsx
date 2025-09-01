import DailyActiveStyle from './index.module.scss'
import {useEffect, useRef,useState} from 'react'
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent
  } from 'echarts/components';
  // 标签自动布局、全局过渡动画等特性
  import { LabelLayout, UniversalTransition } from 'echarts/features';
 
  import { CanvasRenderer } from 'echarts/renderers';
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    BarChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
  ]);

const DailyActive = ({title,data,type}) => {

    const echartsRef = useRef(null)
    const [activeListData, setActiveListData] = useState([])

    // 格式化日期显示 - 只显示月-日，不显示周几
    const formatDateDisplay = (dateStr) => {
        if (!dateStr) {
            return '未知日期'
        }
        // 只提取月-日格式，不显示周几
        return dateStr.substring(5) // 从第6个字符开始，去掉年份
    }

    useEffect(() => {
        setActiveListData(data)
    }, [data])

    useEffect(() => {
        // 只有当数据存在且图表容器存在时才初始化图表
        if (!activeListData || activeListData.length === 0 || !echartsRef.current) {
            return
        }
        
        const chart = echarts.init(echartsRef.current)
        const merchantData = []
        const userData = []
        const dateLabels = []
        
        // 按日期排序数据
        const sortedData = [...activeListData].sort((a, b) => {
            // 如果 statDate 为空，将其排到最后
            if (!a.statDate && !b.statDate) return 0
            if (!a.statDate) return 1
            if (!b.statDate) return 1
            
            const dateA = new Date(a.statDate)
            const dateB = new Date(b.statDate)
            
            // 检查日期是否有效
            if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
            if (isNaN(dateA.getTime())) return 1
            if (isNaN(dateB.getTime())) return 1
            
            return dateA - dateB
        })
        
        // 创建日期到数据的映射，确保每个日期都有对应的数据
        const dateDataMap = new Map()
        
        sortedData.forEach(item => {
            if (!item.statDate) return
            
            const dateKey = item.statDate
            if (!dateDataMap.has(dateKey)) {
                dateDataMap.set(dateKey, {
                    merchant: 0,
                    user: 0,
                    date: dateKey
                })
            }
            
            const dateData = dateDataMap.get(dateKey)
            if (item.terminalType === 1) {
                dateData.merchant = type === 1 ? item.activeCount : item.loginCount
            } else if (item.terminalType === 2) {
                dateData.user = type === 1 ? item.activeCount : item.loginCount
            }
        })
        
        // 按日期顺序提取数据
        const sortedDates = Array.from(dateDataMap.keys()).sort()
        
        sortedDates.forEach(dateKey => {
            const dateData = dateDataMap.get(dateKey)
            merchantData.push(dateData.merchant)
            userData.push(dateData.user)
            dateLabels.push(formatDateDisplay(dateKey))
        })
        
        // 如果数据不足7条，用0补全（可选，根据实际需求决定）
        const minLength = Math.min(7, sortedDates.length)
        const finalMerchantData = merchantData.slice(0, minLength)
        const finalUserData = userData.slice(0, minLength)
        const finalDateLabels = dateLabels.slice(0, minLength)
        
        chart.setOption({
            title: {
                text: title
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['商户', '用户'],
                top: '5%',
                right: '5%'
            },
            xAxis: {
                type: 'category',
                data: finalDateLabels
            },
            yAxis: {
                type: 'value',
                name: '数量'
            },
            series: [
                {
                    name: '商户',
                    type: 'bar',
                    data: finalMerchantData,
                    itemStyle: {
                        color: '#6A5ACD',
                        borderRadius: [4, 4, 0, 0]
                    }
                },
                {
                    name: '用户',
                    type: 'bar',
                    data: finalUserData,
                    itemStyle: {
                        color: '#B22222',
                        borderRadius: [4, 4, 0, 0]
                    }
                }
            ]
        })
        
        const handleResize = () => {
            chart.resize()
        }
        window.addEventListener('resize', handleResize)
        
        return () => {
            window.removeEventListener('resize', handleResize)
            chart.dispose()
        }
    }, [activeListData])
    return (
        <div className={DailyActiveStyle.DailyActive}>
             <div className={DailyActiveStyle.Title}>
                <h1>{title}</h1>
            </div>
            {activeListData && activeListData.length > 0 ? (
                <div className={DailyActiveStyle.echarts} ref={echartsRef}>
                    
                </div>
            ) : (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '200px',
                    color: '#999',
                    fontSize: '14px'
                }}>
                    暂无数据
                </div>
            )}
        </div>
    )
}

export default DailyActive