import TitleStyle from './index.module.scss'
import { Popconfirm } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { setIsTitle, toggleTitle } from '../../store/title';
import { triggerRefresh } from '../../store/dataRefresh';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import RedoOut from '@/assets/svg/Title/RedoOut.svg'
import { useState } from 'react';

const Title =()=>{
    const isTitle = useSelector((state) => state.title.isTitle);
    const [isRotating, setIsRotating] = useState(false);
   
    const dispatch = useDispatch();
    const confirm = () => {

        dispatch(setIsTitle(false));
        sessionStorage.clear()
        localStorage.clear()
        window.location.reload()
    };
    
    const cancel = () => {
        console.log('取消退出');
    };
    
    const handleToggleMenu = () => {
        // 切换标题状态
        dispatch(toggleTitle());
    };
    
    const handleReload = () => {
        setIsRotating(true);
        // 触发刷新，让 Outlet 重新渲染
        dispatch(triggerRefresh());
        
        // 旋转动画完成后停止旋转
        setTimeout(() => {
            setIsRotating(false);
        }, 500);
    }
    
    return (
        <div className={TitleStyle.Title}>
            <div className={TitleStyle.Icons} >
                {isTitle ? <MenuUnfoldOutlined onClick={handleToggleMenu}/> : <MenuFoldOutlined onClick={handleToggleMenu}/>}
                <img 
                    src={RedoOut}
                    alt="reload"
                    onClick={handleReload} 
                    className={`${TitleStyle.reloadIcon} ${isRotating ? TitleStyle.rotating : ''}`}
                />
            </div>
            <Popconfirm
                title="退出"
                description="你确定退出？"
                onConfirm={confirm}
                onCancel={cancel}
                okText="确定"
                cancelText="取消"
            >
            <div className={TitleStyle.Avatar}>
                A
            </div>
                </Popconfirm>
        </div>
    )
}

export default Title