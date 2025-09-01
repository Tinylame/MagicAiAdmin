import HomeStyle from './index.module.scss'
import { useEffect, useState, useCallback } from "react";
import { Homes } from '@/api/'
import { YahooFilled } from '@ant-design/icons'
import { Space, Spin } from 'antd';
import Ranking from '@/components/Ranking'
import teDay from '@/assets/svg/Home/teDay.svg'
import ShangHu from '@/assets/svg/Home/ShangHu.svg'
import tadayUser from '@/assets/svg/Home/tadayUser.svg'
import tadayShanghu from '@/assets/svg/Home/tadayShanghu.svg'
import mone from '@/assets/svg/Home/mone.svg'
import TiXian from '@/assets/svg/Home/TiXian.svg'
import ChongZhi from '@/assets/svg/Home/ChongZhi.svg'
import tadayTiXian from '@/assets/svg/Home/tadayTiXian.svg'
import tadayChongZhi from '@/assets/svg/Home/tadayChongZhi.svg'
import huo from '@/assets/svg/Home/huo.svg'
import ShangHuo from '@/assets/svg/Home/ShangHuo.svg'
import UserHuo from '@/assets/svg/Home/UserHuo.svg'
import tadayShangHuo from '@/assets/svg/Home/tadayShangHuo.svg'
import tadayUserHuo from '@/assets/svg/Home/tadayUserHuo.svg'
import video from '@/assets/svg/Home/video.svg'
import BofangLiang from '@/assets/svg/Home/BofangLiang.svg'
import BoFang from '@/assets/svg/Home/BoFang.svg'
import ShengCheng from '@/assets/svg/Home/ShengCheng.svg'
import ShengChengs from '@/assets/svg/Home/ShengChengs.svg'
import Bsheng from '@/assets/svg/Home/Bsheng.svg'
import Csheng from '@/assets/svg/Home/Csheng.svg'
import BshengC from '@/assets/svg/Home/BshengC.svg'
import CshengC from '@/assets/svg/Home/CshengC.svg'
import FaBu from '@/assets/svg/Home/FaBu.svg'
import AvatarS from '@/components/DailyActive/index.jsx'

// 格式化数字函数：大于等于10000显示为"万"的形式
const formatNumber = (num) => {
    if (num === null || num === undefined) return 0;
    const number = Number(num);
    if (isNaN(number)) return 0;

    if (number >= 10000) {
        const wan = (number / 10000).toFixed(1);
        // 如果是整数，去掉小数点
        return wan.endsWith('.0') ? `${parseInt(wan)}万` : `${wan}万`;
    }
    return number;
};

const Home = () => {
    const [homeData, setHomeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { homeAll, activeList } = Homes
    const [activeListData, setActiveListData] = useState([])
    const [activeListLoading, setActiveListLoading] = useState(true)

    // 定义mode数据配置
    const modeConfigs = [
        {
            title: '注册',
            icon: <YahooFilled style={{ color: 'red', fontSize: '20px' }} />,
            items: [
                {
                    title: '今日注册用户数',
                    value: homeData?.todayRegisteredUsers,
                    unit: '人',
                    image: tadayUser
                },
                {
                    title: '今日注册商户数',
                    value: homeData?.todayRegisteredMerchants,
                    unit: '人',
                    image: tadayShanghu
                },
                {
                    title: '注册总用户数',
                    value: homeData?.totalRegisteredUsers,
                    unit: '人',
                    image: teDay
                },
                {
                    title: '注册总商户数',
                    value: homeData?.totalRegisteredMerchants,
                    unit: '人',
                    image: ShangHu
                }
            ]
        },
        {
            title: '金额',
            icon: <img src={mone} alt='' style={{ width: '18px' }} />,
            items: [
                {
                    title: '今日用户提现金额',
                    value: homeData?.todayWithdrawnAmount,
                    unit: '元',
                    image: tadayTiXian
                },
                {
                    title: '今日用户充值金额',
                    value: homeData?.todayRechargedAmount,
                    unit: '元',
                    image: tadayChongZhi
                },
                {
                    title: '用户提现金额',
                    value: homeData?.totalWithdrawnAmount,
                    unit: '元',
                    image: TiXian
                },
                {
                    title: '用户充值金额',
                    value: homeData?.totalRechargedAmount,
                    unit: '元',
                    image: ChongZhi
                }
            ]
        },
        {
            title: '活跃数',
            icon: <img src={huo} alt='' style={{ width: '18px' }} />,
            items: [
                {
                    title: '今日商户活跃数',
                    value: homeData?.todayActiveCount,
                    unit: '人',
                    image: tadayShangHuo
                },
                {
                    title: '今日用户活跃数',
                    value: homeData?.todayActiveCountC,
                    unit: '人',
                    image: tadayUserHuo
                },
                {
                    title: '昨日商户活跃数',
                    value: homeData?.yesterdayActiveCount,
                    unit: '人',
                    image: ShangHuo
                },
                {
                    title: '昨日用户活跃数',
                    value: homeData?.yesterdayActiveCountC,
                    unit: '人',
                    image: UserHuo
                }
            ]
        },
        {
            title: '生成—播放',
            icon: <img src={video} alt='' style={{ width: '18px' }} />,
            items: [
                {
                    title: '总播放量',
                    value: homeData?.totalPlayCount,
                    unit: '个',
                    image: BofangLiang
                },
                {
                    title: '昨日播放量',
                    value: homeData?.yesterdayPlayCount,
                    unit: '个',
                    image: BoFang
                },
                {
                    title: '总生成视频数',
                    value: homeData?.totalGenVideoCount,
                    unit: '个',
                    image: ShengCheng
                },
                {
                    title: '今日生成视频数',
                    value: homeData?.todayGenVideoCount,
                    unit: '个',
                    image: ShengChengs
                }
            ]
        },
        {
            title: '发布',
            icon: <img src={FaBu} alt='' style={{ width: '18px' }} />,
            items: [
                {
                    title: '今日用户发布视频数',
                    value: homeData?.todayPVideoCountC,
                    unit: '个',
                    image: Bsheng
                },
                {
                    title: '今日商家发布视频数',
                    value: homeData?.todayPVideoCountB,
                    unit: '个',
                    image: Csheng
                },
                {
                    title: '用户总发布视频数',
                    value: homeData?.totalPVideoCountC,
                    unit: '个',
                    image: BshengC
                },
                {
                    title: '商家总发布视频数',
                    value: homeData?.totalPVideoCountB,
                    unit: '个',
                    image: CshengC
                }
            ]
        }
    ]

    const fetchActiveList = async () => {
        try {
            setActiveListLoading(true)
            const res = await activeList({
                pageIndex: 1,
                pageSize: 14
            })
            if (res && res.data && res.data.list) {
                setActiveListData(res.data.list)
            } else {
                setActiveListData([])
            }
        } catch (error) {
            console.error('获取活跃数据失败:', error)
            setActiveListData([])
        } finally {
            setActiveListLoading(false)
        }
    }
    


    // 数据获取函数 - 参考 User 页面的实现方式
    const fetchHomeData = useCallback(async () => {
        setLoading(true)
        setError(null)
        
        try {
            // 并行获取数据
            const [_, homeRes] = await Promise.all([
                fetchActiveList(),
                homeAll()
            ])
            
            if (homeRes && homeRes.data) {
                setHomeData(homeRes.data)
            } else {
                setError('数据格式错误')
            }
        } catch (err) {
            console.error('API错误:', err)
            setError(err.message || '加载数据失败')
        } finally {
            setLoading(false)
        }
    }, [homeAll, activeList])

    useEffect(() => {
        fetchHomeData();
    }, [fetchHomeData]);

    if (loading) {
        return (
            <div className={HomeStyle.Home}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spin size="large" />
                </div>
            </div>
        )
    }


    return (
        <div className={HomeStyle.Home}>
            <div className={HomeStyle.Title}>
                <h1>首页</h1>
            </div>
            <div className={HomeStyle.Content}>
                <div className={HomeStyle.DataView}>
                    <div className={HomeStyle.Active}>
                        {!activeListLoading && activeListData.length > 0 ? (
                            <AvatarS title='七日活跃数统计' data={activeListData} type={1} />
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                <Spin size="large" />
                            </div>
                        )}
                    </div>
                    <div className={HomeStyle.Active}>
                        {!activeListLoading && activeListData.length > 0 ? (
                            <AvatarS title='七日登录数统计' data={activeListData} type={2} />
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                <Spin size="large" />
                            </div>
                        )}
                    </div>
                </div>
                {modeConfigs.map((mode, modeIndex) => (
                    <div key={modeIndex} className={HomeStyle.mode}>
                        <div className={HomeStyle.modeTitle}>
                            <h1>{mode.title}</h1>{mode.icon}
                        </div>
                        <div className={HomeStyle.modeContent}>
                            {mode.items.map((item, itemIndex) => (
                                <div key={itemIndex} className={HomeStyle.ContentMode}>
                                    <div className={HomeStyle.IconLift}>
                                        <h1>{item.title}</h1>
                                        <p><span style={{ fontSize: '40px' }}>{formatNumber(item.value)}</span>{item.unit}</p>
                                    </div>
                                    <img src={item.image} alt='' />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {/* <div className={HomeStyle.Ranking}>
                    <Ranking />
                </div> */}

            </div>

        </div>
    )
}

export default Home
