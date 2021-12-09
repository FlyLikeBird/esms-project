import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Select, Table, Spin } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';

const { Option } = Select;

function HistoryAlarm({ dispatch, user, alarm }){
    let { timeType } = user;
    let { sourceData, isLoading, currentPage, total, cateCode } = alarm;
    let columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 15 + index + 1}`;
            }
        },
        { title:'区域', dataIndex:'region_name'},
        { title:'设备', dataIndex:'mach_name' },
        { title:'告警类型', dataIndex:'type_name'},
        {
            title:'告警内容',
            render:(row)=>(<span>{`${row.warning_info || '--'},${row.warning_value || '--'}`}</span>)
        },
        { title:'告警时间', dataIndex:'record_date' }
    ];
    useEffect(()=>{
        dispatch({ type:'alarm/initAlarmHistory'});
    },[]);
    return (
        <div style={{ height:'100%', position:'relative' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ display:'flex', alignItems:'center', height:'50px', color:'#fff' }}>
                <span>告警类型:</span>
                <Select style={{ width:'120px', margin:'0 2rem 0 0.5rem' }} value={cateCode} className={style['custom-select']} onChange={value=>{
                    dispatch({ type:'alarm/toggleAlarmType', payload:value });
                    dispatch({ type:'alarm/fetchAlarmHistory' });
                }}>
                    <Option value='0'>全部</Option>
                    <Option value='1'>安全告警</Option>
                    <Option value='2'>越限告警</Option>
                    <Option value='3'>通讯告警</Option>
                </Select>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'alarm/fetchAlarmHistory' });
                    
                }} />
            </div>
            <div style={{ height:'calc( 100% - 50px)' }}>
                <div className={style['card-container']}>
                    <Table 
                        rowKey='record_id'
                        columns={columns}
                        dataSource={sourceData}
                        className={style['self-table-container'] + ' ' + style['dark'] }
                        pagination={{
                            current:currentPage,
                            total,
                            pageSize:15,
                            showSizeChanger:false
                        }}
                        locale={{
                            emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>暂无历史告警信息</div>
                        }}
                        onChange={(pagination)=>{
                            dispatch({ type:'alarm/fetchAlarmHistory', payload:{ pageNum:pagination.current }});
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default connect(({ user, alarm })=>({ user, alarm }))(HistoryAlarm);