import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Tree, Spin, Menu, Button, message } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import RemoteSwitch from './RemoteSwitch';
import TimePlanner from './TimePlanner';
import ExecuteRecorder from './ExecuteRecorder';
import LimitManager from './LimitManager';
import SwitchSetter from './SwitchSetter';
import AutoCombine from './AutoCombine';
import SwitchController from './SwitchController';

let subMenuMaps = {
    'sw_ctrl_remote':RemoteSwitch,
    'sw_ctrl_task':TimePlanner,
    'sw_ctrl_oper_record':ExecuteRecorder,
    'sw_ctrl_trip':SwitchController
};
function SmartManager({ dispatch, user, switchMach }){
    let { currentMenu } = user;
    let { gatewayList, gatewayLoading, currentGateway, currentSwitch, optionType } = switchMach;
    const [subMenu, toggleSubMenu] = useState('');
    useEffect(()=>{
        if ( currentMenu.child && currentMenu.child.length ){
            toggleSubMenu(currentMenu.child[0]);
        }
    },[currentMenu]);
    let sidebar = (
        <div>
            <div className={style['card-container'] + ' ' + style['topRadius'] + ' ' + style['float-menu-container']} style={{ padding:'0', height:'auto', paddingBottom:'10px' }}>
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
                subMenu.menu_code === 'sw_ctrl_remote' || subMenu.menu_code === 'sw_ctrl_trip'
                ?
                <div className={style['card-container'] + ' ' + style['bottomRadius']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                    <div className={style['card-title']}>
                        <div>网关列表</div>
                        {
                            subMenu.menu_code === 'sw_ctrl_remote' 
                            ?
                            <Button type='primary' size='small' style={{ fontSize:'0.8rem' }} onClick={()=>{
                                history.push('/sw_system');
                            }}>添加网关</Button>
                            :
                            null
                        }
                    </div>
                    <div className={style['card-content']}>
                        {
                            gatewayLoading
                            ?
                            <Spin className={style['spin']} />
                            :
                            gatewayList.length 
                            ?
                            <Tree
                                className={style['custom-tree']}
                                defaultExpandAll={true}
                                // expandedKeys={expandedKeys}
                                // onExpand={temp=>{
                                //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                                // }}
                                selectedKeys={[currentSwitch.key ]}
                                treeData={gatewayList}
                                onSelect={(selectedKeys, {node})=>{  
                                    if ( subMenu.menu_code === 'sw_ctrl_remote' ) {
                                        // 远程控制功能
                                        if ( node.is_gateway ) {
                                            // 如果是网关设备
                                            if ( node.key !== currentGateway.key ){
                                                dispatch({ type:'switchMach/toggleGateway', payload:node });
                                                dispatch({ type:'switchMach/fetchSwitchList' });
                                                if ( optionType === '1'){
                                                    dispatch({ type:'switchMach/fetchSwitchData'});
                                                } else {
                                                    dispatch({ type:'switchMach/fetchRealtimeData'});
                                                }
                                            }                    
                                        } else {
                                            // 如果是空开设备，则更新空开设备所在的那组网关
                                            if ( node.key !== currentSwitch.key ) {
                                                let temp = gatewayList.filter(i=>i.key === node.gateway_id )[0];
                                                if ( temp && temp.key !== currentGateway.key ){
                                                    dispatch({ type:'switchMach/toggleGateway', payload:temp, updateSwitch:node });
                                                    dispatch({ type:'switchMach/fetchSwitchList' });
                                                } else {
                                                    dispatch({ type:'switchMach/toggleSwitch', payload:node });
                                                }
                                                if ( optionType === '1'){
                                                    dispatch({ type:'switchMach/fetchSwitchData'});
                                                } else {
                                                    dispatch({ type:'switchMach/fetchRealtimeData'});
                                                }
                                            }              
                                        }
                                    } else if ( subMenu.menu_code === 'sw_ctrl_trip' ){
                                        // 自动脱扣功能
                                        if ( node.is_gateway ){
                                            message.info('请选择网关下的空开设备');
                                        } else {
                                            dispatch({ type:'switchMach/toggleSwitch', payload:node });
                                            if ( optionType === '1' ){
                                                dispatch({ type:'switchMach/fetchTemp'});
                                            } else if ( optionType === '2'){
                                                dispatch({ type:'switchMach/fetchParams'});
                                            } else if ( optionType === '3'){
                                                dispatch({ type:'switchMach/fetchLimitEle'});
                                            } else if ( optionType === '4'){
                                                dispatch({ type:'switchMach/fetchAutoTrip'});
                                            } else if ( optionType === '5'){
                                                dispatch({ type:'switchMach/fetchAutoCombine'});
                                            }
                                        }                                    
                                    }                   
                                }}
                            />
                            :
                            <div>网关列表为空</div>
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

export default connect(({ user, switchMach })=>({ user, switchMach }))(SmartManager);