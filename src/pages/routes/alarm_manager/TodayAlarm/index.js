import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import LineChart from './LineChart';
import TableContainer from './TableContainer';

const { Option } = Select;

function TodayAlarm({ dispatch, user, alarm }){
    let { timeType } = user;
    let { todayAlarm, cateCode } = alarm;
    let loaded = Object.keys(todayAlarm).length  ? true : false ;
    useEffect(()=>{
        dispatch({ type:'user/toggleTimeType', payload:'1'});
        dispatch({ type:'alarm/initTodayAlarm'});
        return ()=>{
            
        }
    },[])
    return (
        <div style={{ height:'100%' }}>
            <div style={{ display:'flex', alignItems:'center', height:'50px', color:'#fff' }}>
                <span>告警类型:</span>
                <Select style={{ width:'120px', margin:'0 2rem 0 0.5rem' }} value={cateCode} className={style['custom-select']} onChange={value=>{
                    dispatch({ type:'alarm/toggleAlarmType', payload:value });
                    dispatch({ type:'alarm/fetchTodayAlarm' });
                }}>
                    <Option value='0'>全部</Option>
                    <Option value='1'>安全告警</Option>
                    <Option value='2'>越限告警</Option>
                    <Option value='3'>通讯告警</Option>
                </Select>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'alarm/fetchTodayAlarm' });
                }} />
            </div>
            <div style={{ height:'calc( 100% - 50px)' }}>
                <div className={style['card-container-wrapper']} style={{ height:'50%', paddingRight:'0' }}>
                    <div className={style['card-container']}>
                        {
                            loaded 
                            ?
                            <LineChart data={todayAlarm.view} timeType={timeType} />
                            :
                            <Spin size='large' className={style['spin']} />
                        }   
                    </div>
                </div>
                <div className={style['card-container-wrapper']} style={{ height:'50%', paddingBottom:'0', paddingRight:'0' }}>
                    <div className={style['card-container']}>
                        {
                            loaded 
                            ?
                            <TableContainer data={todayAlarm.type} />
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default connect(({ user, alarm })=>({ user, alarm }))(TodayAlarm);