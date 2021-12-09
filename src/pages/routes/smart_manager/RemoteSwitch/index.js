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
function RemoteSwitch({ dispatch, user, switchMach, terminalMach, menu }){
    let { gatewayList, gatewayLoading, currentGateway, switchList, currentSwitch, realtimeData, switchLoading, switchData, switchDataLoading, optionType } = switchMach;
    let { machLoading, machDetailInfo } = terminalMach;
    let [visible, setVisible] = useState(false);
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'switchMach/init' });
        }
    },[user.authorized]);
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'switch/toggleOptionType', payload:'1'});
            btnMaps = {};
        }
    },[])
    if ( menu.child && menu.child.length ){
        menu.child.forEach(item=>{
            btnMaps[item.menu_code] = true;
        })
    }
    return (
        <div>
            <div className={style['card-container-wrapper']} style={{ display:'block', height:'40%', paddingRight:'0' }}>
                <div className={style['card-container']} style={{ overflow:'auto' }}>
                    <div className={style['card-title']}>
                        <div>{`在线控制-${currentGateway.title}`}</div>
                        <div>
                            {
                                btnMaps['sw_ctrl_refresh']
                                ?
                                <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                    dispatch({ type:'switchMach/refresh'});
                                }}><ReloadOutlined style={{ fontSize:'1.2rem' }} />刷新</div>
                                :
                                null
                            }
                            {
                                btnMaps['sw_ctrl_refresh']
                                ?
                                <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                    new Promise((resolve, reject)=>{
                                        dispatch({ type:'switchMach/sync', payload:{ resolve, reject }})
                                    })
                                    .then(()=>{
                                        message.success('同步过程需要约30秒，过程中无法操作设备');
                                    })
                                    .catch(msg=>message.info(msg))
                                }}><CloudSyncOutlined style={{ fontSize:'1.2rem' }}/>同步</div>
                                :
                                null
                            }
                            <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                            }}><ControlOutlined style={{ fontSize:'1.2rem' }}/>自动读取</div>
                            {/* <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                dispatch({ type:'setAuto'})
                            }}><ControlOutlined style={{ fontSize:'1.2rem' }}/>自动读取</div> */}
                            {
                                btnMaps['sw_ctrl_btn'] 
                                ?
                                <div className={style['custom-button'] + ' ' + style['small']} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                    setVisible(true);
                                }}><ControlOutlined style={{ fontSize:'1.2rem' }}/>空开批量控制</div>
                                :
                                null
                            }                           
                        </div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            switchLoading 
                            ?
                            <Skeleton active className={style['skeleton']} />
                            :
                            <SwitchList data={switchList} dispatch={dispatch} currentSwitch={{}} currentGateway={currentGateway} btnMaps={btnMaps}  />
                        }
                    </div>
                </div>
            </div>
            <div className={style['card-container-wrapper']} style={{ display:'block' ,height:'60%', paddingRight:'0', paddingBottom:'0' }}>
                <div className={style['card-container']}>   
                                  
                    <TableContainer dispatch={dispatch} data={switchData} loading={switchDataLoading} realtimeData={realtimeData} optionType={optionType} />                 
                </div>
            </div>
            <Modal 
               visible={Object.keys(machDetailInfo).length ? true : false}
               footer={null}
               className={style['custom-modal']}
               bodyStyle={{ backgroundColor:'rgba(0, 0, 0, 0.8)' }}
               width='80vw'
               height='80vh'
               onCancel={()=>{
                   dispatch({ type:'terminalMach/resetMachDetail'})
               }}
            >
                <MachDetail 
                    dispatch={dispatch}
                 //    currentMach={currentMach}
                    machLoading={machLoading}
                    data={machDetailInfo}
                />
            </Modal>
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
export default connect(({ user, switchMach, terminalMach }) => ({ user, switchMach, terminalMach }))(RemoteSwitch);