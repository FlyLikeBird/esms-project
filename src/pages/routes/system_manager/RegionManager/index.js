import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Popconfirm, Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import AddForm from './AddForm';
function RegionManager({ dispatch, user, region, menu }){
    let { managerList, currentPage, total } = region;
    let [info, setInfo] = useState({ visible:false, forEdit:false, userInfo:null });
    let [value, setValue] = useState('');
    useEffect(()=>{
        dispatch({ type:'region/fetchManagerList' }); 
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
                return `${ ( currentPage - 1) * 15 + index + 1}`;
            }
        },
        { title:'姓名', dataIndex:'name' },
        { title:'手机号', dataIndex:'mobile' },
        { title:'部门', dataIndex:'department' },
        {
            title:'操作',
            render:(row)=>(
                <div>
                    {
                        btnMaps['sw_person_update']
                        ?
                        <span style={{ cursor:'pointer', color:'#4b96ff', margin:'0 6px' }} onClick={()=>{
                            setInfo({ visible:true, forEdit:true, userInfo:row });
                        }}>修改</span>
                        :
                        null
                    }
                    {
                        btnMaps['sw_person_del']
                        ?
                        <Popconfirm title='确定删除此责任人吗' okText='确定' cancelText='取消' onConfirm={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'region/del', payload:{ resolve, reject, person_id:row.person_id }})
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
                    {
                        btnMaps['sw_person_add']
                        ?
                        <div style={{ display:'flex', alignItems:'center', padding:'1rem' }}>
                            <Button style={{ marginRight:'20px' }} type="primary"  onClick={() => setInfo({ visible:true, forEdit:false }) }>添加责任人</Button>                
                            <Input className={style['custom-input']} allowClear={true} value={value} onChange={e=>setValue(e.target.value)} onClose={()=>{
                                console.log(value);
                            }} />
                            <div className={style['custom-button']} style={{ marginRight:'20px' }} onClick={()=>{
                                if ( value ){
                                    dispatch({ type:'region/fetchManagerList', payload:{ name:value }});
                                } else {
                                    message.info('请输入查询信息');
                                }
                            }}><SearchOutlined />查询</div>
                        </div>
                        :
                        null
                    }
                    
                    <Table
                        className={style['self-table-container'] + ' ' + style['dark'] }
                        columns={columns}
                        dataSource={managerList}
                        locale={{emptyText:'还没有添加任何责任人'}}
                        bordered={true}
                        rowKey="person_id"  
                        pagination={{
                            current:currentPage,
                            total,
                            pageSize:15,
                            showSizeChanger:false
                        }}                  
                        onChange={pagination=>{
                            dispatch({ type:'region/fetchManagerList', payload:{ name:value, page:pagination.current }} )
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
                            onDispatch={action=>dispatch(action)}                            
                            onClose={()=>setInfo({ visible:false, forEdit:false })} 
                        />
                    </Modal>
                </div>
    )
}

export default connect(({ user, region })=>({ user, region }))(RegionManager);