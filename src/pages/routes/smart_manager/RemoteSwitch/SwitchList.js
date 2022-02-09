import React, { useState, useEffect, useRef } from 'react';
import { Tag, Modal, Button, Input, Tooltip, Spin, message } from 'antd';
import moment from 'moment';
import style from './RemoteSwitch.css';
import IndexStyle from '@/pages/routes/IndexPage.css';
import { BarChartOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import SyncProgress from './SyncProgress';
import ActionConfirm from '@/pages/components/ActionConfirm';
import SwitchItem from './SwitchItem';
import gatewayImg from '../../../../../public/gateway.png';
import kkImg1P from '../../../../../public/kk_1p.png';
import kkImg2P from '../../../../../public/kk_2p.png';
import kkImg3P from '../../../../../public/kk_3p.png';

let kkTypesMap = {
    '1':kkImg1P,
    '2':kkImg2P,
    '3':kkImg3P
}
// 0开闸 1合闸 2未知
let posMap = {
    '0':1,
    '1':0,
    '2':2
};
let statusMap = {
    '0':'分断',
    '1':'合闸',
    '2':'未知'
};
let switchTypesMap = {
    '0':'非物联网开关',
    '1':'开关网关设备',
    '2':'漏保',
    '3':'开关',
    '4':'空调'
};

let canDrag = false, 
    currentTarget = null, 
    prevIndex = 0,
    currentIndex = 100, 
    currentDom = null, 
    hasInsert = false,
    posX = 0, posY = 0, 
    moveX = 0, moveY = 0;
// 空开尺寸 100 * 240 漏保尺寸 120 * 240

function SwitchList({ dispatch, data, currentGateway, btnMaps, onSelectDetail, modelList, userName }){
    const containerRef = useRef();
    let inputRef = useRef();
    let [currentMach, setCurrentMach] = useState({});
    let [visible, setVisible] = useState(false);
    let [actionVisible, setActionVisible] = useState(false);
    let [machList, setMachList] = useState([{ is_gateway:true, gateway_id:currentGateway.key },...data]);
    let [checkLoading, setCheckLoading] = useState(false);
    useEffect(()=>{
        setMachList([{ is_gateway:true, gateway_id:currentGateway.key }, ...data]);
    },[data]);
  
    return (
        machList && machList.length 
        ?
        <div style={{ height:'100%'}}>   
            <div className={style['container']} ref={containerRef}>
                {
                    machList.map((item, index)=>(
                        item.is_gateway 
                        ?
                        <div className={style['item-container']} key='gateway' style={{
                            width:'69px',
                            height:'100%',
                            backgroundImage:`url(${gatewayImg})`,
                            backgroundRepeat:'no-repeat',
                            backgroundSize:'138px 100%',
                            // backgroundPosition:`-${currentGateway.is_online === 1 ? 0 : 69 }px 0`
                        }}>
                            {/* {
                                syncGateways[currentGateway.key]
                                ?
                                <div className={style['float-item']} style={{ width:'100%', top:'50%', transform:'translate(-50%,-50%)'}}><SyncProgress dispatch={dispatch} syncGateways={syncGateways}  currentGateway={currentGateway} /></div>
                                :
                                null
                            } */}
                            <div className={style['float-item']} style={{ color: '#04a3fe', bottom:'6px'}}>
                                <span>网关</span>
                            </div>
                            <div className={style['float-item']} style={{ bottom:'38px' }}>
                                {/* <span className={style['dot'] + ' ' + ( currentGateway.is_online === 1 ? style['green'] : style['red'] )}></span> */}
                                <span style={{ color:currentGateway.is_online === 1 ? '#5eff5a' : '#ff2d2e' }}>{ currentGateway.is_online === 1 ? '在线' : '离线' }</span>
                            </div>  
                            {/* <div className={style['float-item']} style={{ bottom:'50px' }}><Button type='primary' size='small' onClick={()=>{
                                if ( syncGateways[currentGateway.key] ) {
                                    message.info('同步中...请稍后操作');
                                    return;
                                }
                                new Promise((resolve, reject)=>{
                                    dispatch({ type:'switchMach/sync', payload:{ mach_id:item.gateway_id, resolve, reject }})
                                })
                                .then(()=>{
                                    message.success('同步过程需要约30秒，过程中无法操作设备');
                                    let result = JSON.parse(localStorage.getItem('syncGateways'));
                                    if ( result ){
                                        result[item.gateway_id] = 1;
                                        dispatch({ type:'switchMach/setSyncGateways', payload:result });
                                    } else {
                                        let temp = { [item.gateway_id]:1 };
                                        dispatch({ type:'switchMach/setSyncGateways', payload:temp });                                       
                                    }
                                })
                                .catch(msg=>message.info(msg))
                            }}>刷新</Button></div> */}
                        </div>
                        :
                        <div className={ style['item-container']  + ' '+ 'draggable-item'} key={index} data-index={index} data-type='kk' onClick={()=>{
                            if ( checkLoading ){
                                message.info('设备自检中,请稍后...');
                                return ;
                            }
                            if ( item.mach_id ){
                                if ( btnMaps['sw_ctrl_btn']) {
                                    if ( item.online_status !==1 ){
                                        message.info('设备离线中');
                                        return ;
                                    }
                                    if ( item.switch_status === 2 ){
                                        message.info('设备状态未知，请勿操作');
                                        return ;
                                    }
                                    setCurrentMach(item);
                                } else {
                                    message.info('当前用户没有开合闸权限!');
                                }
                            } else {
                                message.info('请先存档');
                            }
                            
                            
                        }} style={{
                            width:'100px',
                            height:'100%',
                            cursor:'pointer',
                            backgroundRepeat:'no-repeat',
                            // opacity: canDrag ? currentIndex === index ? '0.2' : '1' : '1',
                            opacity:item.mach_id ? '1' : '0.4',
                            backgroundImage:`url(${kkTypesMap[item.switch_p_num]})`, 
                            // backgroundPosition:`-${ ( syncGateways[currentGateway.key] ? 2 : posMap[item.switch_status] ) * (item.switch_type === 2 ? 120 : 100 )}px 0`,
                            backgroundSize:'300px 100%',
                            backgroundPosition:`-${ ( item.online_status === 1 ? posMap[item.switch_status] : 2 )  * 100}px 0`,
                        }}>
                                {/* <div className={style['float-item']} style={{ top:'10px', left:'unset', right:'0' }} onClick={(e)=>{
                                    e.stopPropagation();
                                    dispatch({ type:'terminalMach/fetchMachDetail', payload:{ mach_id:item.mach_id }});
                                }}><BarChartOutlined style={{ fontSize:'1.2rem'}} /></div> */}
                                <div className={style['float-item'] + ' ' + style['symbol']} style={{ top:'10px' }}>{ index }</div>
                                {/* <div className={style['float-item']} style={{ top:'50px', fontSize:'0.8rem', color:item.online_status === 1 ? '#5eff5a' : '#ff2d2e' }}>
                                    <span className={style['dot']} style={{ backgroundColor:item.online_status === 1 ? '#5eff5a' : '#ff2d2e' }}></span>
                                    <span>{ item.online_status === 1 ? '在线' : '离线' }</span>
                                </div>
                                <div className={`${style['float-item']} ${ item.switch_status === 1 ? IndexStyle['tag-on'] : IndexStyle['tag-off']}`} style={{ bottom:'50px'}}>
                                    <span>{ statusMap[item.switch_status] }</span>
                                </div>
                                <div className={style['float-item']} style={{ bottom:'50px' }}>
                                    <span className={style['dot'] + ' ' + ( item.switch_status === 1 ? style['green'] : style['red'] )}></span>
                                </div> */}
                               
                                {
                                    item.switch_type === 2 
                                    ?
                                    <div className={ style['float-item']} style={{ color:'#03a6fe', fontSize:'0.8rem', top:'50px' }}>
                                        {
                                            checkLoading
                                    
                                            ?
                                            <span><Spin size='small' /></span>
                                            :
                                            <span onClick={(e)=>{
                                                e.stopPropagation();
                                                setCheckLoading(true);
                                                new Promise((resolve, reject)=>{
                                                    dispatch({ type:'switchMach/fetchSelfCheck', payload:{ resolve, reject, mach_id:item.mach_id }});
                                                })
                                                .then(()=>{
                                                    message.success(`${item.meter_name}自检成功`);
                                                    setCheckLoading(false);
                                                })
                                                .catch(msg=>{
                                                    message.error(msg);
                                                    setCheckLoading(false);
                                                });
                                                
                                            }}>自检</span>
                                        }
                                    </div>
                                    :
                                    null
                                }
                                {
                                    item.mach_id 
                                    ?
                                    <div className={ style['float-item'] + ' ' + ( item.switch_status === 2 || item.online_status !== 1 ? style['ghost-btn-white'] : style['ghost-btn-blue'] ) } style={{ bottom:'36px' }} onClick={e=>{
                                        e.stopPropagation();
                                        onSelectDetail(item);
                                        
                                    }}>查看</div>
                                    :
                                    null
                                }                              
                                <div className={ item.meter_name && item.meter_name.length >= 12 ? style['float-item'] + ' ' + style['auto-scroll'] : style['float-item']} style={{ color: item.switch_status === 2 || item.online_status !== 1 ? '#fff' : '#04a3fe', bottom:'6px', zIndex:'4' }}>
                                    
                                    <SwitchItem dispatch={dispatch} modelList={modelList} item={item} />
                                </div>                            
                        </div>
                    ))
                }
            </div>
            {
                actionVisible 
                ?
                <ActionConfirm visible={actionVisible} userName={userName} actionType={currentMach.switch_status === 0 ? '合闸' : '分断'} onClose={()=>setActionVisible(false)} onDispatch={()=>{
                    setCurrentMach({});
                    new Promise((resolve, reject)=>{
                        dispatch({ type: currentMach.switch_status === 0 ? 'switchMach/fetchTurnOn' : 'switchMach/fetchTurnOff', payload:{ resolve, reject, mach_id:currentMach.mach_id }})
                    })
                    .then(()=>{
                        message.success(`${currentMach.switch_status === 0 ? '合闸' : '分断'}成功`);
                    })
                    .catch(msg=>message.info(msg))
                }} />
                :
                null
            }
            {/* 空开开合闸控制 */}
            <Modal
                width='400px'
                height='260px'
                className={IndexStyle['custom-modal']}
                title='线路控制'
                footer={null}
                visible={Object.keys(currentMach).length}
                onCancel={()=>setCurrentMach({})}
            >
                <div>
                    
                    <div style={{ margin:'10px 0', display:'flex', justifyContent:'space-between' }}>
                        <span>线路名称:</span>
                        <span>{ currentMach.meter_name }</span>
                    </div>               
                    <div style={{ margin:'10px 0', display:'flex', justifyContent:'space-between' }} >
                        <span>{`${switchTypesMap[currentMach.switch_type]}状态`}</span>
                        <span className={ currentMach.switch_status === 1 ? style['tag-on'] : style['tag-off']} >
                            <span>{ statusMap[currentMach.switch_status] }</span>
                        </span>
                    </div>                                      
                    <div style={{ textAlign:'center', margin:'20px 0' }}>
                        <span style={{ display:'inline-block', verticalAlign:'top', fontWeight:'bold', cursor:'pointer', margin:'0 10px', width:'100px', height:'40px', lineHeight:'40px', backgroundColor: currentMach.switch_status === 0 ? 'rgb(24 173 20)' : '#ff2d2e' }} onClick={()=>{
                            setActionVisible(true);
                        }}>{ `${currentMach.switch_status === 0 ? '合闸' : '分断'}`}</span>
                        <span style={{ display:'inline-block', verticalAlign:'top', fontWeight:'bold', cursor:'pointer', margin:'0 10px', width:'100px', height:'40px', lineHeight:'40px', color:'#fff', backgroundColor:'transparent', border:'2px solid #fff' }} onClick={()=>{
                            setCurrentMach({});
                        }}>取消</span>
                    </div>
                    
                </div>
            </Modal>
            
        </div>
        :
        null
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.modelList !== nextProps.modelList  ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(SwitchList, areEqual);

