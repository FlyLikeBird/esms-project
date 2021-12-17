import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Select, Modal, Table, Spin } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';
import AlarmForm from './AlarmForm';

const { Option } = Select;

const statusMaps = {
    '1':{ text:'未处理', color:'red'},
    '2':{ text:'跟进中', color:'#04fde7'},
    '3':{ text:'已处理', color:'#0676cb'},
    '4':{ text:'挂起', color:'#aadbff'}
}
function HistoryAlarm({ dispatch, user, alarm }){
    let [ info, setInfo] = useState({ visible:false, current:null, action_code:'' });
    let { timeType } = user;
    let { sourceData, isLoading, currentPage, total, cateCode, progressLog, logTypes } = alarm;
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
        { title:'告警时间', dataIndex:'record_date' },
        {
            title:'告警状态',
            dataIndex:'status',
            render:(value)=>(<span style={{ color:statusMaps[value].color }}>{ statusMaps[value].text }</span>)
        },
        {
            title:'操作',
            render:(row)=>(
                row.status === 3 
                ?
                <div>
                    <span className={style['btn'] + ' ' + style['small']} onClick={()=>{
                        setInfo({ visible:true, current:row, action_code:'view' });
                        dispatch({ type:'alarm/fetchProgressInfo', payload:row.record_id });
                    }}>查看详情</span>
                </div>
                :
                <div>
                    <span className={style['btn'] + ' ' + style['small'] + ' ' + ( row.status === 3 ? style['disabled'] : '') } size='small'  onClick={()=>{
                        // 挂起之后还是可以添加进度、结单
                        if (  row.status === 3  ){
                            return;
                        } 
                        setInfo({ visible:true, current:row, action_code:'2' });
                        dispatch({ type:'alarm/fetchProgressInfo', payload:row.record_id });
                    }}>添加进度</span>
                    <span className={style['btn'] + ' ' + style['small'] + ' ' + ( row.status === 3 || row.status === 4 ? style['disabled'] : '') } size='small'  onClick={()=>{
                        if (  row.status === 3 || row.status === 4 ){
                            return; 
                        }  
                        setInfo({ visible:true, current:row, action_code:'1' });
                    }}>挂起</span>
                    <span className={style['btn'] + ' ' + style['small'] + ' ' + ( row.status === 3  ? style['disabled'] : '') } size='small'  onClick={()=>{
                        if (  row.status === 3  ){
                            return; 
                        } 
                        setInfo({ visible:true, current:row, action_code:'3' });
                    }}>结单</span>
                </div>
            )
        }
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
            <Modal 
                visible={info.visible} 
                footer={null} 
                width='50%'
                destroyOnClose={true} 
                bodyStyle={{ padding:'40px' }}
                onCancel={()=>setInfo({ visible:false })}
            >
                <AlarmForm 
                    info={info} 
                    logTypes={logTypes}
                    onClose={()=>setInfo({ visible:false })} 
                    onDispatch={(action)=>dispatch(action)}
                    // recordHistory={recordHistory}
                    progressLog={progressLog}
                />
            </Modal>
        </div>
    )
}

export default connect(({ user, alarm })=>({ user, alarm }))(HistoryAlarm);