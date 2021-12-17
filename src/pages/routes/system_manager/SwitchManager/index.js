import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Popconfirm, message } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import AddForm from '../GatewayManager/AddForm';
function SwitchManager({ dispatch, user, switchMach, menu, controller, region }){
    let { gatewayList } = switchMach;
    let { managerList } = region;
    let { switchList, switchModel, currentPage, total } = controller;
    let [info, setInfo] = useState({ visible:false, forEdit:false, currentMach:null });
    useEffect(()=>{
        dispatch({ type:'controller/init' });
    },[]);
    let btnMaps = {};
    if ( menu.child && menu.child.length ){
        menu.child.forEach(item=>{
            btnMaps[item.menu_code] = true;
        })
    }
    let columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 12 + index + 1}`;
            }
        },
        { title:'设备名', dataIndex:'meter_name' },
        { title:'注册码', dataIndex:'register_code' },
        { title:'设备类型', dataIndex:'model_desc' },
        { title:'所属网关', dataIndex:'gateway' },
        { title:'责任人', dataIndex:'person_name' },
        { title:'排序值', dataIndex:'order_by' },
        // { title:'所属公司', dataIndex:'company_name' },
        {
            title:'操作',
            render:(row)=>(
                <div>
                    {
                        btnMaps['sw_meter_edit'] 
                        ?
                        <span style={{ cursor:'pointer', color:'#4b96ff', margin:'0 6px' }} onClick={()=>{
                            setInfo({ visible:true, forEdit:true, currentMach:row });
                        }}>修改</span>
                        :
                        null
                    }
                    {
                        btnMaps['sw_meter_del']
                        ?
                        <Popconfirm title='确定删除此空开设备吗' okText='确定' cancelText='取消' onConfirm={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'controller/del', payload:{ resolve, reject, mach_id:row.mach_id }})
                            })
                            .then(()=>{
                                
                            })
                            .catch(msg=>message.info(msg))
                        }}><span style={{ cursor:'pointer', color:'#4b96ff', margin:'0 6px' }}>删除</span></Popconfirm>
                        :
                        null
                    }
                    
                </div>
            )
        }
    ];
    
    return (
            <div className={style['card-container']}>
                    {
                        btnMaps['sw_meter_add'] 
                        ?
                        <div style={{ padding:'1rem'}}>
                            <Button type="primary"  onClick={() => setInfo({ visible:true, forEdit:false }) }>添加设备</Button>                
                        </div>
                        :
                        null
                    }
                    <Table
                        className={style['self-table-container'] + ' ' + style['dark'] }
                        columns={columns}
                        dataSource={switchList}
                        locale={{emptyText:'还没有挂载任何设备'}}
                        bordered={true}
                        rowKey="mach_id"   
                        pagination={{
                            current:currentPage,
                            total,
                            pageSize:12,
                            showSizeChanger:false
                        }}                     
                        onChange={pagination=>{
                            dispatch({ type:'controller/fetchSwitchList', payload:{ currentPage:pagination.current }} )
                        }}
                    />
                    <Modal
                        visible={info.visible}
                        footer={null}
                        width="40%"
                        bodyStyle={{ padding:'40px'}}
                        closable={false}
                        className={style['modal-container']}
                        onCancel={()=>setInfo({ visible:false, forEdit:false })}
                    >
                        <AddForm 
                            info={info}
                            gatewayList={gatewayList}
                            managerList={managerList}
                            switchModel={switchModel}
                            onDispatch={action=>dispatch(action)}
                            forMachs={true}
                            onClose={()=>setInfo({ visible:false, forEdit:false })} 
                        />
                    </Modal>
                </div>
    )
}

export default connect(({ user, switchMach, controller, region })=>({ user, switchMach, controller, region }))(SwitchManager);