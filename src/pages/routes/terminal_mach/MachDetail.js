import React, { useState, useEffect, useRef } from 'react';
import { Modal, Spin, Switch, DatePicker } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import style from './TerminalMach.css';
import MachLineChart from './MachLineChart';
import moment from 'moment';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import PieChart from './PieChart';
import IndexStyle from '@/pages/routes/IndexPage.css';

const wrapperStyle = {
    width:'33.3%',
    height:'50%',
}
let statusMaps = {
    '0':'分断',
    '1':'合闸',
    '2':'未知'
}
const infoStyle = {
    display:'inline-block',
    verticalAlign:'top',
    width:'50%',
    overflow:'hidden',
    textOverflow:'ellipsis',
    whiteSpace:'nowrap',
    fontSize:'0.8rem',
    color:'#fff'
}
function MachDetail({ dispatch, machLoading, data }){
    const [referDate, setReferDate] = useState(moment(new Date()));
    const inputRef = useRef();
    useEffect(()=>{
        
    },[]);
    return (
            <div className={style['inline-container']}>
                <div className={style['inline-item-wrapper']} style={wrapperStyle}>
                    <div className={style['inline-item']} style={{ position:'relative' }}>
                        <div style={{ position:'absolute', right:'0', top:'0'}}>
                            <div style={{ display:'inline-flex', alignItems:'center' }}>
                                <div className={style['date-picker-button-left']} onClick={()=>{
                                    let temp = new Date(referDate.format('YYYY-MM-DD'));
                                    let result = moment(temp).subtract(1,'days');
                                    dispatch({ type:'terminalMach/fetchMachDetail', payload:{ referDate:result, mach_id:data.mach.mach_id }});
                                    setReferDate(result);
                                }}><LeftOutlined /></div>
                                <DatePicker size='small' ref={inputRef} locale={zhCN} allowClear={false} value={referDate} onChange={value=>{
                                    dispatch({ type:'terminalMach/fetchMachDetail', payload:{ referDate:value, mach_id:data.mach.mach_id }});
                                    setReferDate(value);
                                    if ( inputRef.current && inputRef.current.blur ) inputRef.current.blur();
                                }} />
                                <div className={style['date-picker-button-right']} onClick={()=>{
                                    let temp = new Date(referDate.format('YYYY-MM-DD'));
                                    let result = moment(temp).add(1,'days');
                                    dispatch({ type:'terminalMach/fetchMachDetail', payload:{ referDate:result, mach_id:data.mach.mach_id }});
                                    setReferDate(result);
                                }}><RightOutlined /></div>
                            </div>
                        </div>
                        <div style={{ height:'100%', display:'flex', alignItems:'center' }}>
                            <div style={{ width:'50%' }}><img src={data.img_path} style={{ width:'100%' }} /></div>
                            <div style={{ width:'50%' }}>
                                <div className={style['text-container']}>
                                    <span>设备编号:</span>
                                    <span className={style['text']}>{ data.mach ? data.mach.register_code : '-- --' }</span>
                                </div>
                                <div className={style['text-container']}>
                                    <span>设备名:</span>
                                    <span className={style['text']}>{ data.mach ? data.mach.meter_name : '-- --' }</span>
                                </div>
                                <div className={style['text-container']}>
                                    <span>所属网关:</span>
                                    <span className={style['text']}>{ data.mach ? data.mach.gateway : '-- --' }</span>
                                </div>
                                <div className={style['text-container']}>
                                    <span>在线状态:</span>
                                    <span className={style['text']} style={{ color:'#ffa63f' }}>{ data.is_outline === 1 ? '离线' : '在线' }</span>
                                </div>
                                <div className={style['text-container']}>
                                    <span>合闸状态:</span>
                                    <span className={ data.switch_status === 1 ? IndexStyle['tag-on'] + ' ' + style['text'] : IndexStyle['tag-off'] + ' ' + style['text']} >
                                        { statusMaps[data.switch_status] || '-- --' }
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* <div style={{ height:'30%', borderRadius:'6px', backgroundColor:'#13132b', display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 6px' }}>
                            <div>
                                <span style={infoStyle}>
                                    <span >编号:</span>
                                    <span>{ data.mach ? data.mach.register_code : '-- --' }</span>
                                </span>
                                <span style={infoStyle}>
                                    <span>网关:</span>
                                    <span>{ data.mach ? data.mach.gateway : '-- --' }</span>
                                </span>
                            </div>
                            <div>
                                <span style={infoStyle}>
                                    <span>在线状态:</span>
                                    <span>{ data.is_outline === 1 ? '离线' : '在线' }</span>
                                </span>
                                <span style={infoStyle}>
                                    <span>开合闸状态:</span>
                                    <span>{ statusMaps[data.switch_status] || '-- --' }</span>
                                </span>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className={style['inline-item-wrapper']} style={wrapperStyle}>
                    <div className={style['inline-item']} style={{ backgroundColor:'#13132b'}}>
                            {
                                machLoading 
                                ?
                                <Spin className={style['spin']}  />
                                :
                                <MachLineChart xData={data.view.date} yData={data.view.P} title='功率(kw)' />
                            }
                    </div>
                </div>
                <div className={style['inline-item-wrapper']} style={wrapperStyle}>
                    <div className={style['inline-item']} style={{ backgroundColor:'#13132b'}}>
                            {
                                machLoading
                                ?
                                <Spin className={style['spin']}  />
                                :
                                <MachLineChart xData={data.view.date} yData={data.view.I} title='电流(A)'  />
                            }
                    </div>
                </div>
                <div className={style['inline-item-wrapper']} style={wrapperStyle}>
                    <div className={style['inline-item']} style={{ backgroundColor:'#13132b'}}>
                            {
                                machLoading
                                ?
                                <Spin className={style['spin']} />
                                :
                                <PieChart data={data.warning_info} />
                            }
                        
                    </div>
                </div>
                <div className={style['inline-item-wrapper']} style={wrapperStyle}>
                    <div className={style['inline-item']} style={{ backgroundColor:'#13132b'}}>
                            {
                                machLoading 
                                ?
                                <Spin className={style['spin']}  />
                                :
                                <MachLineChart xData={data.view.date} yData={data.view.U} title='电压(V)'  />
                            }
                    </div>
                </div>
                <div className={style['inline-item-wrapper']} style={wrapperStyle}>
                    <div className={style['inline-item']} style={{ backgroundColor:'#13132b'}}>
                            {
                                machLoading 
                                ?
                                <Spin className={style['spin']}  />
                                :
                                <MachLineChart xData={data.view.date} yData={data.view.factor} title='功率因素(cosΦ)' />
                            }
                    </div>
                </div>
            </div>
        
    )
}

export default MachDetail;