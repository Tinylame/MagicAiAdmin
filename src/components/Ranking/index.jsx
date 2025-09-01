import React, { useEffect, useRef, useState } from 'react'
import RankingStyle from './index.module.scss'
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
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { mockRankingData } from './Test';   

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

const Ranking = () => {
    const echartsRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [chart, setChart] = useState(null);

    // 定义三种排名类型
    const rankingTypes = [
        {
            title: '用户发布视频数排名',
            key: 'userPublish',
            color: '#6A5ACD'
        },
        {
            title: '商户生成视频排名',
            key: 'merchantGenerate',
            color: '#B22222'
        },
        {
            title: '商户发布视频排名',
            key: 'merchantPublish',
            color: '#32CD32'
        }
    ];
    // 获取排名颜色 - 前十名每个都有不同颜色
    const getRankColor = (rank) => {
        const rankColors = [
            '#FFD700', // 第1名 - 金色
            '#C0C0C0', // 第2名 - 银色
            '#CD7F32', // 第3名 - 铜色
            '#FF6B6B', // 第4名 - 红色
            '#4ECDC4', // 第5名 - 青色
            '#45B7D1', // 第6名 - 蓝色
            '#96CEB4', // 第7名 - 绿色
            '#FFEAA7', // 第8名 - 黄色
            '#DDA0DD', // 第9名 - 紫色
            '#98D8C8'  // 第10名 - 薄荷绿
        ];
        
        return rankColors[rank - 1] || rankingTypes[currentIndex].color;
    };

    // 初始化图表
    const initChart = () => {
        if (!echartsRef.current) return;

        const chartInstance = echarts.init(echartsRef.current);
        setChart(chartInstance);

        const handleResize = () => {
            chartInstance.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chartInstance.dispose();
        };
    };

    // 更新图表数据
    const updateChart = () => {
        if (!chart) return;

        const currentType = rankingTypes[currentIndex];
        const data = mockRankingData[currentType.key];

        const names = data.map(item => item.name);
        const values = data.map(item => item.value);
        const colors = data.map(item => getRankColor(item.rank));

        const option = {
            title: {
                text: currentType.title,
                left: 'center',

                textStyle: {
                    fontSize: 16,

                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    const data = params[0];
                    const rank = data.dataIndex + 1;
                    const name = data.name;
                    const value = data.value;
                    return `
                        <div style="padding: 8px;">
                            <div style="font-weight: bold; margin-bottom: 8px;">
                                <span style="color: ${getRankColor(rank)};">第${rank}名</span>
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="color: #666;">名称：</span>
                                <span style="color: #333;">${name}</span>
                            </div>
                            <div>
                                <span style="color: #666;">数量：</span>
                                <span style="color: #333; font-weight: bold;">${value}</span>
                            </div>
                        </div>
                    `;
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%',
                top: '25%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: names,
                axisLabel: {
                    rotate: 45,
                    fontSize: 10,
                    margin: 8
                }
            },
            yAxis: {
                type: 'value',
                name: '',
                nameLocation: 'middle',
                nameGap: 30
            },
            series: [
                {
                    name: currentType.title,
                    type: 'bar',
                    data: values.map((value, index) => ({
                        value: value,
                        itemStyle: {
                            color: colors[index],
                            borderRadius: [4, 4, 0, 0]
                        }
                    })),
                    barWidth: '50%',
                    label: {
                        show: true,
                        position: 'top',
                        distance: 8,
                        formatter: function(params) {
                            const rank = params.dataIndex + 1;
                            let medal = '';
                            
                            if (rank === 1) {
                                medal = '🥇'; // 金牌
                            } else if (rank === 2) {
                                medal = '🥈'; // 银牌
                            } else if (rank === 3) {
                                medal = '🥉'; // 铜牌
                            }
                            
                            return `${medal} ${params.value}`;
                        },
                        textStyle: {
                            fontSize: 10,
                            color: '#666'
                        }
                    }
                }
            ]
        };

        chart.setOption(option);
    };



    // 初始化图表
    useEffect(() => {
        const cleanup = initChart();
        return cleanup;
    }, []);

    // 更新图表数据
    useEffect(() => {
        updateChart();
    }, [currentIndex, chart]);

    return (
        <div className={RankingStyle.Ranking}>
            <div className={RankingStyle.Title}>
                <h1>排行榜</h1>
            </div>
            <div className={RankingStyle.chartContainer} ref={echartsRef}></div>
            <div className={RankingStyle.indicators}>
                {rankingTypes.map((type, index) => (
                    <div
                        key={type.key}
                        className={`${RankingStyle.indicator} ${index === currentIndex ? RankingStyle.active : ''}`}
                        style={{ backgroundColor: index === currentIndex ? type.color : '#ddd' }}
                        onClick={() => setCurrentIndex(index)}
                    >
                        {type.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ranking;