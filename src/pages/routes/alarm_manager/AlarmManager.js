import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu, Tree, Spin } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import AlarmSum from './AlarmSum';
import TodayAlarm from './TodayAlarm';
import HistoryAlarm from './HistoryAlarm';
import AlarmAnalyze from './AlarmAnalyze';
import AlarmSetting from './AlarmSetting';
let subMenuMaps = {
    'sw_warning_analyz':AlarmSum,
    'sw_warning_today':TodayAlarm,
    'sw_warning_history':HistoryAlarm,
    'sw_warning_rule':AlarmSetting
};
function AlarmManager({ dispatch, user, switchMach }){
    let { currentMenu } = user;
    let { gatewayList, gatewayLoading, currentNode, currentGateway, currentSwitch } = switchMach;
    const [subMenu, toggleSubMenu] = useState('');
    useEffect(()=>{
        if ( currentMenu.child && currentMenu.child.length ){
            toggleSubMenu(currentMenu.child[0]);
        }
    },[currentMenu]);
    const sidebar = (
        <div>
            <div className={style['card-container'] + ' ' + style['topRadius'] + ' '+ style['float-menu-container']} style={{ padding:'0', height:'auto', paddingBottom:'10px' }}>
                <div className={style['card-title']}>导航功能</div>
                <div className={style['card-content']} style={{ padding:'0' }}>
                    <Menu mode='inline' selectedKeys={[subMenu.menu_code]} onClick={e=>{
                        let temp = currentMenu.child.filter(i=>i.menu_code === e.key)[0];
                        toggleSubMenu(temp);
                    }}>
                        {
                            currentMenu.child && currentMenu.child.length 
                            ?
                            currentMenu.child.map((item,index)=>(
                                <Menu.Item key={item.menu_code}>{ item.menu_name }</Menu.Item>
                            ))
                            :
                            null
                        }
                    </Menu>
                </div>
            </div>
            {
                subMenu.menu_code === 'sw_warning_today' || subMenu.menu_code === 'sw_warning_history'
                ?
                <div className={style['card-container']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                    <div className={style['card-title']}>网关列表</div>
                    <div className={style['card-content']}>
                        {
                            gatewayLoading
                            ?
                            <Spin className={style['spin']} />
                            :
                            <Tree
                                className={style['custom-tree']}
                                defaultExpandAll={true}
                                // expandedKeys={expandedKeys}
                                // onExpand={temp=>{
                                //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                                // }}
                                selectedKeys={[currentNode.key ]}
                                treeData={gatewayList}
                                onSelect={(selectedKeys, {node})=>{ 
                                    dispatch({ type:'switchMach/toggleNode', payload:node }); 
                                    if ( subMenu.menu_code === 'sw_warning_today' ) {
                                        dispatch({ type:'alarm/fetchTodayAlarm' });
                                    } else if ( subMenu.menu_code === 'sw_warning_history' ){                                       
                                        dispatch({ type:'alarm/fetchAlarmHistory' });
                                    }                                                                                               
                                }}
                            />
                        }
                    </div>
                </div>
                :
                null
            }
        </div>
        
    );
    let Component = subMenuMaps[subMenu.menu_code] || (()=>null);
    let content = <Component menu={subMenu} />;
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
    
}

export default connect(({ user, switchMach })=>({ user, switchMach }))(AlarmManager);