import {MenuMagic} from "@/config";
import React, { useState } from "react";
import * as Icon from '@ant-design/icons'
import { Menu } from 'antd';
import MenuStyle from './index.module.scss'
import {useNavigate, useLocation} from 'react-router-dom'
import { useSelector } from 'react-redux';

function iconToElement (value){
    return React.createElement(Icon[value])
}
const items = MenuMagic.map(item =>{
    const child ={
        key:item.key,
        label:item.label,
        icon:iconToElement(item.icon)
    }
    if (item.children){
        child.children = item.children.map(i =>{
            return {
                key:i.key,
                label:i.label,
                icon:iconToElement(i.icon)
            }
        })
    }
    return child
})



const Menus = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const isTitle = useSelector((state) => state.title.isTitle);
    
    // 根据当前路径找到父级菜单key
    function getDefaultOpenKeys() {
        const currentPath = location.pathname
        for (const item of MenuMagic) {
            if (item.children) {
                // 检查当前路径是否在某个父级菜单的子菜单中
                if (item.children.some(child => child.key === currentPath)) {
                    return [item.key]
                }
            }
        }
        return []
    }

    // 使用状态管理展开的菜单
    const [openKeys, setOpenKeys] = useState(getDefaultOpenKeys())

    function handleClick(e){
        navigate(e.key)
    }
    
    // 处理菜单展开/收起，确保一次只能展开一个子菜单
    function onOpenChange(keys) {
        // 如果没有展开的菜单，直接设置
        if (keys.length === 0) {
            setOpenKeys(keys)
            return
        }
        
        // 找到最新展开的菜单项（即新添加的key）
        const latestOpenKey = keys.find(key => !openKeys.includes(key))
        
        if (latestOpenKey) {
            // 如果有新展开的菜单，只保留这个菜单展开
            setOpenKeys([latestOpenKey])
        } else {
            // 如果没有新展开的菜单（即是收起操作），直接设置
            setOpenKeys(keys)
        }
    }
    function goToHome(){
        navigate('/home')
    }
    
    return (
        <div className={MenuStyle.Menu} data-collapsed={isTitle} style={{justifyContent:!isTitle?'':'centent'}}>
            <div className={MenuStyle.Title} onClick={goToHome}>
                {!isTitle ? 
                    <h1 key="magic-text" className={MenuStyle.magicText}>Magic</h1> : 
                    <h1 key="magic-logo" className={MenuStyle.magicLogo} style={{width:'45px',height:'45px',background:'#1677ff',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%'}}>M</h1>
                }
            </div>
            <Menu
                items={items}
                inlineCollapsed={isTitle}
                theme="dark"
                mode="inline"
                style={{marginTop:'10px'}}
                onClick={handleClick}
                selectedKeys={[location.pathname]}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
            />
        </div>
    )
}
export default Menus