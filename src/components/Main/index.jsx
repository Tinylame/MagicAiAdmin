import {Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import MainStyle from './index.module.scss'

const Main = () => {
    const location = useLocation()
    const [isAnimating, setIsAnimating] = useState(false)
    const refreshKey = useSelector((state) => state.dataRefresh.refreshKey)

    // 使用 useMemo 优化 Outlet 的 key 值
    const outletKey = useMemo(() => {
        return `${location.pathname}-${refreshKey}`;
    }, [location.pathname, refreshKey]);

    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => {
            setIsAnimating(false)
        }, 300) // 缩短动画时间

        return () => clearTimeout(timer)
    }, [outletKey]) // 当 outletKey 变化时触发动画

    return (
        <div className={MainStyle.Main}>
            <div className={`${MainStyle.Content} ${isAnimating ? MainStyle.fadeIn : ''}`}>
                <Outlet key={outletKey} />
            </div>
        </div>
    )
}

export default Main
