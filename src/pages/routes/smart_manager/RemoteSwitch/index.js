import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Modal, Skeleton, message } from 'antd';
import { ReloadOutlined, CloudSyncOutlined, ControlOutlined  } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import MachDetail from '../../terminal_mach/MachDetail';
import TableContainer from './TableContainer';
import SwitchList from './SwitchList';
import CombineSwitch from './CombineSwitch';
let btnMaps = {};
function RemoteSwitch({ dispatch, user, switchMach, controller, menu }){
    let { gatewayList, gatewayLoading, currentGateway, switchList, currentSwitch, currentNode, realtimeData, switchLoading, switchData, switchDataLoading, detailLoading, switchDetail, optionType, autoLoading, autoLoadSwitchList } = switchMach;
    let [visible, setVisible] = useState(false);
    let [detailInfo, setDetailInfo] = useState({});
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'switchMach/init' });
        }
    },[user.authorized]);
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'switchMach/toggleOptionType', payload:'1'});
            btnMaps = {};
        }
    },[])
    
    if ( menu.child && menu.child.length ){
        menu.child.forEach(item=>{
            btnMaps[item.menu_code] = true;
        })
    }
    let finalSwitchList = autoLoading ? autoLoadSwitchList : switchList;
    return (
        <div>
            <div className={style['card-container-wrapper']} style={{ display:'block', height:'42%', paddingRight:'0' }}>
                <div className={style['card-container']} style={{ overflow:'auto' }}>
                    {
                        switchLoading
                        ?
                        null
                        :
                        <div className={style['card-title']}>
                            <div>{`当前网关-${currentGateway.title || ''}`}</div>
                            {
                                autoLoading 
                                ?
                                <div>
                                    <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                        new Promise((resolve, reject)=>{
                                            dispatch({ type:'switchMach/fetchAutoLoad', payload:{ resolve, reject }});
                                        })
                                        .then(()=>{ message.success('读取档案成功')})
                                        .catch(msg=>message.error(msg))
                                    }}><ControlOutlined style={{ fontSize:'1.2rem' }}/>读取档案</div>
                                    <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                        if ( finalSwitchList && finalSwitchList.length ){
                                            message.info('存档中，请稍后...');
                                            new Promise((resolve, reject)=>{
                                                dispatch({ type:'switchMach/saveAutoLoad', payload:{ resolve, reject, machInfoList:finalSwitchList }});
                                            })
                                            .then(()=>{
                                                message.success('存档成功,请稍后刷新', 5);
                                                dispatch({ type:'switchMach/toggleAutoLoading', payload:false });
                                            })
                                            .catch(msg=>message.error(msg));
                                        } else {
                                            message.info('读取设备档案为空，无需存档');
                                        }
                                        
                                    }}>存档</div>
                                    <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                        dispatch({ type:'switchMach/toggleAutoLoading', payload:false });
                                    }}>取消</div>
                                </div>
                                :
                                <div>
                                    {
                                        currentGateway.key
                                        ?
                                        btnMaps['sw_ctrl_refresh']
                                        ?
                                        <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                            dispatch({ type:'switchMach/refresh'});
                                        }}><ReloadOutlined style={{ fontSize:'1.2rem' }} />刷新</div>
                                        :
                                        null
                                        :
                                        null
                                    }
                                    {
                                        currentGateway.key 
                                        ?
                                        btnMaps['sw_ctrl_refresh']
                                        ?
                                        <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                            new Promise((resolve, reject)=>{
                                                message.info('网关重启中，请稍后...');
                                                dispatch({ type:'switchMach/sync', payload:{ resolve, reject }})
                                            })
                                            .then(()=>{
                                                message.success('同步成功');
                                            })
                                            .catch(msg=>message.error(msg))
                                        }}><CloudSyncOutlined style={{ fontSize:'1.2rem' }}/>同步</div>
                                        :
                                        null
                                        :
                                        null
                                    }
                                    {
                                        currentGateway.key 
                                        ?
                                        <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                            new Promise((resolve, reject)=>{
                                                dispatch({ type:'switchMach/fetchAutoLoad', payload:{ resolve, reject }});
                                            })
                                            .then(()=>{ message.success('读取档案成功')})
                                            .catch(msg=>message.error(msg))
    
                                        }}><ControlOutlined style={{ fontSize:'1.2rem' }}/>读取档案</div>
                                        :
                                        null
                                    }
                                   
                                    {
                                        currentGateway.key 
                                        ?
                                        btnMaps['sw_ctrl_btn'] 
                                        ?
                                        <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                            setVisible(true);
                                        }}><ControlOutlined style={{ fontSize:'1.2rem' }}/>空开批量控制</div>
                                        :
                                        null
                                        :
                                        null
                                    }                           
                                </div>
                            }
                            
                        </div>
                    }           
                    <div className={style['card-content']}>
                        {
                            switchLoading 
                            ?
                            <Skeleton active className={style['skeleton']} />
                            :
                            currentGateway.key 
                            ?
                            <SwitchList
                                data={finalSwitchList} 
                                dispatch={dispatch} 
                                currentSwitch={currentSwitch} 
                                currentGateway={currentGateway} 
                                btnMaps={btnMaps}  
                                onSelectDetail={item=>setDetailInfo(item)}
                                modelList={controller.switchList}
                            />
                            :
                            <div className={style['empty-text']}>还没有配置网关</div>
                        }
                    </div>
                </div>
            </div>
            <div className={style['card-container-wrapper']} style={{ display:'block' ,height:'58%', paddingRight:'0', paddingBottom:'0' }}>
                <div className={style['card-container']}>                                  
                    <TableContainer dispatch={dispatch} data={switchData} loading={switchDataLoading} realtimeData={realtimeData} optionType={optionType} />                 
                </div>
            </div>
            {/* 空开详情 */}
            <Modal 
               visible={Object.keys(detailInfo).length ? true : false}
               footer={null}
               className={style['custom-modal']}
               destroyOnClose={true}
               bodyStyle={{ backgroundColor:'rgba(0, 0, 0, 0.8)' }}
               width='80%'
               height='80%'
               onCancel={()=>{
                   setDetailInfo({})
               }}
            >
                <MachDetail 
                    dispatch={dispatch}
                    machLoading={detailLoading}
                    data={switchDetail}
                    currentDetail={detailInfo}
                />
            </Modal>
            {/* 批量控制空开 */}
            <Modal
                width='600px'
                className={style['custom-modal']}
                visible={visible}
                destroyOnClose={true}
                onCancel={()=>setVisible(false)}
                title='空开批量控制'
                footer={null}
            >
                <CombineSwitch dispatch={dispatch} switchList={switchList} onClose={()=>setVisible(false)} />
            </Modal>
        </div>
    )   
   
   
}
export default connect(({ user, switchMach, controller }) => ({ user, switchMach, controller }))(RemoteSwitch);