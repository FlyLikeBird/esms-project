import React from 'react';
import { Pagination, Button, Spin } from 'antd';
import { IconFont } from '@/pages/components/IconFont';
import Loading from '@/pages/components/Loading';
import style from './TerminalMach.css';

const iconsMap = {
    'all':'iconVector-4',
    'ele_meter':'iconVector-3',
    'switch':'iconUnion-1',
    'gas':'iconqibiao',
    'water_meter':'iconshuibiao',
    'camera':'iconVector',
    'bar_temp':'iconUnion'
};
function TypedMachList({ dispatch, data, total, currentPage, isLoading }){
    return (
        <div className={style['inline-container']}>
            {/* <div className={style['inline-container-header']}>
                <div style={{ fontSize:'1.2rem', color:'#fff' }}>{ currentType.title }</div>
                <div style={{ position:'absolute', left:'0', top:'0' }}><Button type='primary' onClick={()=>{
                    dispatch({ type:'terminalMach/toggleMachType', payload:{} });
                }}>返回</Button></div>
            </div> */}
            <div className={style['inline-container-main']}>
                {
                    
                    data && data.length 
                    ?
                    data.map((item,index)=>(
                        <div className={style['inline-item-wrapper']} key={index}>
                            <div className={style['inline-item']} onClick={()=>{                            
                                dispatch({ type:'terminalMach/fetchMachDetail', payload:{ mach_id:item.mach_id } });
                            }}>
                                <div className={style['inline-item-title']}>
                                    <div>{ item.meter_name }</div>
                                    <div className={style['tag']} style={{ backgroundColor:item.rule_name ? '#ff2d2e' : '#01f1e3'}}>{ item.rule_name ? '异常' :'正常' }</div>
                                </div>
                                <div className={style['inline-item-content']}>
                                    <div style={{ width:'40%' }}><img src={item.img_path} style={{ width:'100%' }} /></div>                                                            
                                    <div>
                                        <div className={style['text-container']}>
                                            <span>编号:</span>
                                            <span className={style['text']}>{ item.register_code || '-- --' }</span>
                                        </div>
                                        <div className={style['text-container']}>
                                            <span>设备:</span>
                                            <span className={style['text']}>{ item.meter_name || '-- --' }</span>
                                        </div>
                                        {/* <div className={style['text-container']}>
                                            <span>类型:</span>
                                            <span className={style['text']}>{ item.model_desc || '-- --' }</span>
                                        </div> */}
                                        <div className={style['text-container']}>
                                            <span>网关:</span>
                                            <span className={style['text']}>{ item.gateway || '-- --' }</span>
                                        </div>
                                        <div className={style['text-container']}>
                                            <span>告警:</span>
                                            <span className={style['text']} style={{ color:'#ffa63f' }}>{ item.rule_name || '-- --' }</span>
                                        </div>
                                    </div>                                                                
                                </div>
                            </div>
                        </div>
                    ))
                    :
                    <div className={style['empty-text']}>
                        <div><IconFont type={iconsMap['switch']} style={{ fontSize:'5rem', color:'#04a3fe' }} /></div>
                        <span style={{ fontSize:'1.2rem', display:'inline-block', margin:'6px 0'}}>暂时没有这种设备</span>
                    </div>
                }
            </div>
            {
                total > 12 
                ?
                <Pagination className={style['custom-pagination']} pageSize={12} current={currentPage} total={total} showSizeChanger={false} onChange={page=>{
                    dispatch({ type:'terminalMach/fetchMachList', payload:{ currentPage:page }});
                }} />
                :
                null
            }
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(TypedMachList, areEqual);