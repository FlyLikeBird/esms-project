import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import { Spin } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import style from './AgentManager.css';
import IndexStyle from '@/pages/routes/IndexPage.css';
import AgentMap from './AgentMap';
import ScrollTable from '@/pages/components/ScrollTable';
import TypeBarChart from '../alarm_manager/AlarmSum/TypeBarChart';
import LineChart from './LineChart';
import MultiLineChart from './MultiLineChart';
import RegionBarChart from '../alarm_manager/AlarmSum/RegionBarChart';
import switchImg from '../../../../public/switch.webp';

function AgentManager({ dispatch, user, gateway }){
    let [dataType, setDataType] = useState('energy');
    let { userInfo, companyList, msg, AMap } = user;
    let { monitorInfo } = gateway;
    let loaded = Object.keys(monitorInfo).length ? true : false; 
    let thead = [{ title:'位置', dataIndex:'region_name', width:'14%', collapse:true }, { title:'设备', dataIndex:'mach_name', width:'26%', collapse:true   }, { title:'分类', dataIndex:'type_name', width:'30%', border:true }, { title:'发生时间', dataIndex:'record_date', key:'time', width:'30%' }];
    
    return (
        
        <div className={style['container']}>
            {
                Object.keys(msg).length
                ?
                <AgentMap companyList={companyList} msg={msg} AMap={AMap} dispatch={dispatch} />
                :
                null
            }
            {/* 汇总信息 */}
            <div style={{ display:'flex', justifyContent:'space-around', position:'absolute', left:'50%', top:'14px', width:'440px', padding:'1rem 2rem', transform:'translateX(-50%)', backgroundColor:'rgba(0, 0, 0, 0.7)' }}>
                <div>
                    <div style={{ color:'#4a8fd0'}}>终端数量</div>
                    <div>
                        <span className={IndexStyle['data']}>{ monitorInfo.total_cnt || 0}</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span>
                    </div>
                </div>
                {/* <div>
                    <div style={{ color:'#4a8fd0'}}>项目数</div>
                    <div>
                        <span className={IndexStyle['data']}>25</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span>
                    </div>
                </div> */}
                <div>
                    <div style={{ color:'#4a8fd0'}}>当前安全告警</div>
                    <div>
                        <span className={IndexStyle['data']} style={{ color:'red' }}>{ monitorInfo.safe_warning_cnt || 0}</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span>
                    </div>
                </div>
                <div>
                    <div style={{ color:'#4a8fd0'}}>当前通讯告警</div>
                    <div>
                        <span className={IndexStyle['data']} style={{ color:'red' }}>{ monitorInfo.link_warning_cnt || 0}</span>
                        <span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span>
                    </div>
                </div>
            </div>
            {/* 空开概述 */}
            <div className={style['float-container']}>
                <div className={style['float-item']} style={{ height:'22%'}} >
                    <div className={style['float-item-title']}><span className={style['title']}>空开概览</span></div>
                    <div className={style['float-item-content']}>
                        {
                            loaded 
                            ?
                            <div style={{ display:'flex', height:'100%' }}>
                                <div style={{ width:'40%', backgroundImage:`url(${switchImg})`, backgroundRepeat:'no-repeat', backgroundPosition:'50% 50%' }}></div>
                                <div style={{ width:'60%', display:'flex', flexWrap:'wrap', alignItems:'center' }}>
                                    <div style={{ width:'50%' }}>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>在线数量</div>
                                        <div><span className={IndexStyle['data']}>{ monitorInfo.online_cnt || 0 }</span><span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span></div>
                                    </div>
                                    <div style={{ width:'50%' }}>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>合闸</div>
                                        <div><span className={IndexStyle['data']}>{ monitorInfo.combine_cnt || 0}</span><span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px' }}>个</span></div>
                                    </div>
                                    <div style={{ width:'50%' }}>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>离线数量</div>
                                        <div><span className={IndexStyle['data']} style={{ color:'red' }}>{ monitorInfo.outline_cnt || 0}</span><span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span></div>
                                    </div>
                                    <div style={{ width:'50%' }}>
                                        <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)'}}>分断</div>
                                        <div><span className={IndexStyle['data']}>{ monitorInfo.trip_cnt || 0}</span><span className={IndexStyle['sub-text']} style={{ color:'rgba(255,255, 255, 0.7)', margin:'0 10px'}}>个</span></div>
                                    </div>
                                </div>
                            </div>
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                </div>
                {/* 实时告警 */}
                <div className={style['float-item']} style={{ height:'28%'}}>
                    <div className={style['float-item-title']}>
                        <span className={style['title']}>实时告警</span>
                        <span style={{ color:'#3294d7', fontSize:'0.8rem', cursor:'pointer' }} onClick={()=>{
                            history.push('/sw_warning');
                        }}>查看详情<RightOutlined /></span>
                    </div>
                    <div className={style['float-item-content']}>
                        {
                            loaded 
                            ?
                            <ScrollTable thead={thead} data={ monitorInfo.warningList || []} scrollNum={4} forIndex={true} />
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                </div>
                {/* 能耗趋势 */}
                <div className={style['float-item']} style={{ height:'25%'}}>
                    <div className={style['float-item-title']}>
                        <span className={style['title']}>近7日能耗趋势</span>
                    </div>
                    <div className={style['float-item-content']}>
                        {
                            loaded 
                            ?
                            <LineChart data={monitorInfo.view} />
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                </div>
               {/* 告警趋势 */}
               <div className={style['float-item']} style={{ height:'25%' }}>
                    <div className={style['float-item-title']}>
                        <span className={style['title']}>近7日告警趋势</span>
                    </div>
                    <div className={style['float-item-content']}>
                        {
                            loaded 
                            ?
                            <MultiLineChart xData={monitorInfo.view.date} yData={monitorInfo.view.safe} y2Data={monitorInfo.view.link} />
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default connect(({ user, gateway })=>({ user, gateway }))(AgentManager);