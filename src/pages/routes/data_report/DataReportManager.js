import React, { useState } from 'react';
import { Menu } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import RunningReport from './running_report';

const menuList = [
    { menu_code:'1', menu_name:'运行报表'},
    { menu_code:'2', menu_name:'成本报表'},
    { menu_code:'3', menu_name:'设备报表'},
    { menu_code:'4', menu_name:'诊断报告'}
];
function SmartManager(){
    const [subMenu, toggleSubMenu] = useState('1');
    
    return (
        <div style={{ height:'100%', position:'relative' }}>
            <div className={style['card-container'] + ' ' + style['float-menu-container']} style={{ padding:'0' }}>
                <div className={style['card-title']}>导航功能</div>
                <div className={style['card-content']} style={{ padding:'0' }}>
                    <Menu mode='inline' selectedKeys={[subMenu]} onClick={e=>{
                        toggleSubMenu(e.key);
                    }}>
                        {
                            menuList.map((item,index)=>(
                                <Menu.Item key={item.menu_code}>{ item.menu_name }</Menu.Item>
                            ))
                        }
                    </Menu>
                </div>
            </div>
            {
                subMenu === '1' 
                ?
                <RunningReport />
                :
               
                null
            }
        </div>
    )
}

export default SmartManager;