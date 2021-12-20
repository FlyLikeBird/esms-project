import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Input,  Popconfirm, message } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import AddForm from './AddForm';
function GatewayManager({ dispatch, user, gateway, menu }){
    let { gatewayList } = gateway;
    let inputRef = useRef();
    let [info, setInfo] = useState({ visible:false, forEdit:false, currentMach:null });
    let [value, setValue] = useState('');
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'gateway/fetchGateway' });
        }
    },[user.authorized]);
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
                return index + 1;
                // return `${ ( pageNum - 1) * pagesize + index + 1}`;
            }
        },
        { title:'设备名', dataIndex:'meter_name' },
        { title:'注册码', dataIndex:'register_code' },
        { title:'所属公司', dataIndex:'company_name' },
        { title:'地址', dataIndex:'address' },
        // {
        //     title:'坐标',
        //     render:(row)=>(
        //         <span style={{ color:'#4b96ff' }}>{ row.lng ? `[ ${row.lng} , ${row.lat} ]` : '-- --'}</span>
        //     )
        // },
        {
            title:'操作',
            render:(row)=>(
                <div>
                    {
                        btnMaps['sw_gateway_edit']
                        ?
                        <span style={{ cursor:'pointer', color:'#4b96ff', margin:'0 6px' }} onClick={()=>{
                            setInfo({ visible:true, forEdit:true, currentMach:row });
                        }}>修改</span>
                        :
                        null
                    }
                    {
                        btnMaps['sw_gateway_del']
                        ?
                        <Popconfirm title='确定删除此网关设备吗' okText='确定' cancelText='取消' onConfirm={()=>{
                            console.log('a');
                            new Promise((resolve, reject)=>{
                                console.log('b');
                                dispatch({ type:'gateway/del', payload:{ resolve, reject, mach_id:row.mach_id }})
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
    ] 
    return (
            <div className={style['card-container']}>
                    <div style={{ display:'flex', alignItems:'center', height:'50px', color:'#fff', padding:'1rem' }}>              
                        <Input ref={inputRef} placeholder='输入网关名查询' style={{ width:'280px'}} className={style['custom-input']} value={value} onChange={e=>setValue(e.target.value)} suffix={<CloseCircleOutlined style={{ cursor:'pointer' }} onClick={()=>{
                            setValue('');
                            dispatch({ type:'gateway/fetchGateway'});
                            if ( inputRef.current && inputRef.current.blur ) inputRef.current.blur();
                        }} />} />
                        <Button type='primary' style={{ marginRight:'20px' }} onClick={()=>{
                            dispatch({ type:'gateway/fetchGateway', payload:{ keyword:value } });

                        }}><SearchOutlined />查询</Button>
                        {
                            btnMaps['sw_gateway_add']
                            ?
                            <Button type="primary"  onClick={() => setInfo({ visible:true, forEdit:false }) }>添加网关</Button>
                            :
                            null
                        }
                       

                    </div>
                   
                    <Table
                        className={style['self-table-container'] + ' ' + style['dark'] }
                        columns={columns}
                        dataSource={gatewayList}
                        locale={{emptyText:'查询的网关设备为空'}}
                        bordered={true}
                        rowKey="mach_id"
                    
                        pagination={false}
                        // onChange={pagination=>{
                        //     dispatch({ type:'alarm/setPageNum', payload:pagination.current });
                        //     dispatch({ type:'alarm/fetchRecordList', payload:{ cate_code:activeKey, keywords:value }} )
                        // }}
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
                            AMap={user.AMap}
                            onDispatch={action=>dispatch(action)}
                            
                            onClose={()=>setInfo({ visible:false, forEdit:false })} 
                        />
                    </Modal>
                </div>
    )
}

export default connect(({ user, gateway })=>({ user, gateway }))(GatewayManager);