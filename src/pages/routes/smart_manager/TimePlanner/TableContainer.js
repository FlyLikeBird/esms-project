import React, { useState } from 'react';
import { Select, Input, Button, Modal, Tag, Table, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusCircleOutlined, ClusterOutlined, FileAddOutlined, CalendarOutlined, FormOutlined, DeleteOutlined  } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import AddPlanForm from './AddPlanForm';
import DispatchPlan  from './DispatchPlan';
import ActionConfirm from '@/pages/components/ActionConfirm';
import Loading from '@/pages/components/Loading';
const { Option } = Select;

let tasks = [
    { title:'空开任务', key:'1'},
    // { title:'空调任务', key:'2'},
    { title:'漏保任务', key:'3'}
];
let switchActions = {
    '0':'合闸',
    '1':'分断'
}
let weeksMap = {
    1:'周一',
    2:'周二',
    3:'周三',
    4:'周四',
    5:'周五',
    6:'周六',
    7:'周日',
};
let pushStatusMaps = {
    '0':'未推送',
    '1':'推送成功',
    '2':'推送失败'
};
function TableContainer({ dispatch, gatewayList, switchList, data, taskLoading, total, currentPage, btnMaps }){
    let [addVisible, toggleAddVisible] = useState(false);
    let [dispatchVisible, toggleDispatchVisible] = useState(false);
    let [info, setInfo] = useState({ visible:false, forEdit:false, taskInfo:null });
    let [taskType, setTaskType] = useState('1');
    let [value, setValue] = useState('');
    let columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 10 + index + 1}`;
            }
        },
        { title:'任务名称', dataIndex:'task_name'},
        { 
            title:'执行动作', 
            key:'switch_action',
            render:(row)=>{
                return <span className={ row['switch_action'] === 0 || row['task_type'] === 3   ? style['tag-on'] : style['tag-off']}>{ row['task_type'] === 3 ? '自检' : switchActions[row['switch_action']] }</span>
            }
        },
        {
            title:'重复类型',
            dataIndex:'repeat_type',
            render:(value)=>(<span>{ value === 1 ? '周' : value === 2 ? '月' : '年'}</span>)
        },
        { 
            title:'重复日期',
            render:(row)=>{
                if ( row.week_value ){
                    return <span>{ row.week_value.split(',').map(i=>weeksMap[i]).join(', ') }</span>
                } else {
                    let temp = row.exec_date.split(' ');
                    return <span>{ temp[0] }</span>;
                }
            }
        },
        { 
            title:'执行时间', 
            dataIndex:'exec_date',
            render:(value)=>{
                let temp = value.split(' ');
                return <span>{ temp.length > 1 ? temp[1] : temp[0] }</span>
            }
        },
        {
            title:'执行状态',
            dataIndex:'push_status',
            render:(value)=>(<span style={{ color:value === 1 ? '#5eff5a' : '#ff2d2e'}}>{ pushStatusMaps[value] }</span>)
        },
        {
            title:'操作',
            render:(row)=>(
                <div>
                    {
                        btnMaps['sw_task_send']
                        ?
                        <Button style={{ fontSize:'0.8rem', marginRight:'6px'}} type='primary' size='small' onClick={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'switchMach/pushTask', payload:{ resolve, reject, task_id:row.task_id, task_type:taskType } })
                            })
                            .then(()=>{
                                message.success('下发任务成功!');
                                
                            })
                            .catch(msg=>message.error(msg));
                        }}>下发</Button>
                        // <span style={{ color:'#1890ff', marginRight:'1rem', cursor:'pointer' }} onClick={()=>{
                        //     setInfo({ visible:false, forEdit:false, taskInfo:row });
                        //     setActionVisible(true);
                        // }}>下发</span>
                        :
                        null
                    }
                    {
                        btnMaps['sw_task_edit']
                        ?
                        <Button style={{ fontSize:'0.8rem', marginRight:'6px'}} type='primary' size='small' onClick={()=>{
                            setInfo({ visible:true, forEdit:true, taskInfo:row });
                        }}>修改</Button>
                        :
                        null
                    }
                    {
                        btnMaps['sw_task_del'] 
                        ?
                        <Popconfirm 
                            title='确定删除此条任务吗'
                            okText="确定"
                            cancelText="取消"
                            onConfirm={()=>{
                                new Promise((resolve, reject)=>{                          
                                    dispatch({ type:'switchMach/fetchDelTask', payload:{ task_id:row.task_id, task_type:taskType, resolve, reject }})
                                })
                                .then(()=>{
                                    message.success('删除任务成功');
                                })
                                .catch(msg=>{
                                    message.error(msg);
                                })
                            }}
                        >
                            <Button style={{ fontSize:'0.8rem', marginRight:'6px'}} type='primary' size='small' >删除</Button>
                        </Popconfirm>
                       
                        :
                        null
                    }
                    
                </div>
            )
        }
    ];
    return (
        <div style={{ height:'100%', position:'relative' }}>
            {
                taskLoading
                ?
                <Loading />
                :
                null
            }
            <div className={style['button-group-container']} style={{ marginBottom:'1rem' }}>
                {
                    tasks.map(item=>(
                        <div key={item.key} className={ item.key === taskType ? style['button-group-item'] + ' ' + style['selected'] : style['button-group-item']} onClick={()=>{
                            dispatch({ type:'switchMach/fetchTaskList', payload:{ task_type:item.key, task_name:value }});
                            setTaskType(item.key);
                        }}>{ item.title }</div>
                    ))
                }
            </div>
            <div style={{ display:'flex', alignItems:'center', height:'40px', color:'#fff', padding:'0 1rem' }}>
                {/* <span style={{ color:'#03a4fe' }}>重复类型:</span>
                <Select className={style['custom-select']} style={{ width:'100px', margin:'0 20px 0 6px' }} value='1'>
                    <Option value='1'>全部</Option>
                    <Option value='2'>周</Option>
                    <Option value='3'>月</Option>
                    <Option value='4'>年</Option>
                </Select> */}
                <Input className={style['custom-input']} allowClear={true} value={value} onChange={e=>setValue(e.target.value)} onClose={()=>{
                    console.log(value);
                }} />
                <div className={style['custom-button']} style={{ marginRight:'20px' }} onClick={()=>{
                    dispatch({ type:'switchMach/fetchTaskList', payload:{ task_type:taskType, task_name:value }});
                    
                }}><SearchOutlined />查询</div>
                {
                    btnMaps['sw_task_add']
                    ?
                    <div className={style['custom-button']} onClick={()=>setInfo({ visible:true, forEdit:false })}><PlusCircleOutlined />添加任务</div>
                    :
                    null
                }
                {/* <div className={style['custom-button']}><FileAddOutlined />任务库追加</div>
                <div className={style['custom-button']} onClick={()=>toggleDispatchVisible(true)}><CalendarOutlined />任务下发</div> */}
                
            </div>
            <div style={{ height:'calc(100% - 90px)'}}>
                
                <Table 
                    rowKey='task_id'
                    columns={columns}
                    dataSource={data}
                    className={style['self-table-container'] + ' ' + style['dark'] }
                    pagination={{
                        current:currentPage,
                        total,
                        pageSize:10,
                        showSizeChanger:false
                    }}
                    locale={{
                        emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>{ `暂无${ taskType === '1' ? '空开任务' : taskType === '2' ? '空调任务' : '漏保任务'}`}</div>
                    }}
                    onChange={(pagination)=>{
                        dispatch({ type:'switchMach/fetchTaskList', payload:{ task_type:taskType, pageNum:pagination.current, task_name:value }});
                    }}
                />

            </div>
            {/* 添加任务模态弹窗 */}
            <Modal
                width='800px'
                className={style['custom-modal']}
                visible={info.visible}
                destroyOnClose={true}
                onCancel={()=>setInfo({ visible:false, forEdit:false })}
                title={ info.forEdit ? '修改任务' : '添加任务'}
                footer={null}
                
            >
                <AddPlanForm 
                    info={info} 
                    gatewayList={gatewayList}
                    taskType={taskType}
                    onDispatch={action=>dispatch(action)}
                    onClose={()=>setInfo({ visible:false, forEdit:false })} 
                />
            </Modal>
            {/* 任务下发模态弹窗 */}
            {/* <Modal
                width='1000px'
                height='500px'
                className={style['custom-modal']}
                visible={dispatchVisible}
                destroyOnClose={true}
                onCancel={()=>toggleDispatchVisible(false)}
                title='任务下发'
                footer={null}
            >
                <DispatchPlan />
            </Modal> */}
        </div>
    )
}

export default TableContainer;