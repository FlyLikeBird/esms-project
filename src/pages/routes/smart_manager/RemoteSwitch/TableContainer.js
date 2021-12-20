import React, { useState } from 'react';
import { Select, Input, Button, Modal, Table, message } from 'antd';
import { SearchOutlined, PlusCircleOutlined, FileAddOutlined, CalendarOutlined  } from '@ant-design/icons';
import Loading from '@/pages/components/Loading';
import style from '@/pages/routes/IndexPage.css';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import StatusForm from './StatusForm';
const { Option } = Select;

let buttonsGroup = [
    { option:'1', title:'节点数据' },
    { option:'2', title:'实时信息' },
    // { option:'3', title:'报警信息'},
    // { option:'4', title:'电能查看'},
    // { option:'5', title:'记录查看'},
    // { option:'6', title:'详情查看'}
];
function TableContainer({ dispatch, loading, data, realtimeData, optionType }){
    let columns = [];
    let tableData = [];
    if ( optionType === '1'){
        columns = [
            {
                title:'序号',
                width:'60px',
                render:(text,record,index)=>{
                    return index + 1;
                }
            },
            { title:'注册码', dataIndex:'register_code'},
            { title:'时段', dataIndex:'time_type_name' },
            { title:'电能(KWH)', dataIndex:'energy' },
            { title:'温度(℃)', dataIndex:'temp' },
            { title:'电流(A)', dataIndex:'current'},
            { title:'电压(V)', dataIndex:'voltage' },
            { title:'功率(KW)', dataIndex:'power' },
            { title:'功率因素(cosΦ)', dataIndex:'PF' },
            { title:'发生时间', dataIndex:'record_date'}
        ];
        tableData = data;
    } else if ( optionType === '2'){
        columns=[
            { title:'注册码', dataIndex:'register_code' },
            { title:'电压(V)', dataIndex:'voltage' }, 
            { title:'电流(A)', dataIndex:'current'}, 
            { title:'功率(KW)', dataIndex:'power'}, 
            { title:'功率因素(cosΦ)', dataIndex:'powerFactor'}, 
            { title:'电能(KWH)', dataIndex:'energy'}, 
            { title:'温度(℃)', dataIndex:'temp'}
        ]
        tableData = realtimeData;
    }
    // console.log(data);
    // console.log(realtimeData);
    return (
        <div style={{ height:'100%', position:'relative' }}>
            {
                loading
                ?
                <Loading />
                :
                null
            }
            <div style={{ display:'flex', alignItems:'center', height:'50px', color:'#fff', padding:'1rem' }}>
                
                <div className={style['button-group-container']}>
                    {
                        buttonsGroup.map((item,index)=>(
                            <div className={item.option === optionType ? style['button-group-item'] + ' ' + style['selected'] : style['button-group-item']} key={index} onClick={()=>{
                                if ( optionType !== item.option ){
                                    if ( item.option === '1'){
                                        new Promise((resolve, reject)=>{
                                            dispatch({ type:'switchMach/fetchSwitchData', payload:{ resolve, reject } });
                                        })
                                        .then(()=>{
                                            dispatch({ type:'switchMach/toggleOptionType', payload:item.option });
                                        })
                                        .catch(msg=>message.error(msg))
                                    } else if ( item.option === '2'){
                                        new Promise((resolve, reject)=>{
                                            dispatch({ type:'switchMach/fetchRealtimeData', payload:{ resolve, reject }});
                                        })
                                        .then(()=>{
                                            dispatch({ type:'switchMach/toggleOptionType', payload:item.option });
                                        })
                                        .catch(msg=>message.error(msg));
                                    }
                                }
                                
                            }}>{ item.title }</div>
                        ))
                    }
                </div>
                {
                    optionType === '1' 
                    ?
                    <CustomDatePicker size='small' noToggle={true} onDispatch={()=>{
                        dispatch({ type:'switchMach/fetchSwitchData'});
                    }} />
                    :
                    null
                }
                
            </div>
            <div className={style['card-container']} style={{ height:'calc(100% - 50px)'}}>                
                    <Table 
                        rowKey={(r,i)=>i}
                        columns={columns}
                        dataSource={tableData}
                        className={style['self-table-container'] + ' ' + style['dark'] }
                        pagination={false}
                        locale={{
                            emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>暂无节点数据</div>
                        }}
                    />                                                    
            </div>
            
        </div>
    )
}

export default TableContainer;