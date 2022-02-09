import React, { useEffect, useState, useRef } from 'react';
import { Input, Modal, Button, message } from 'antd';
function SwitchItem({ dispatch, item,  modelList }){
    let [visible, setVisible] = useState(false);
    let [value, setValue] = useState(item.meter_name);
    let [editing, setEditing] = useState({});
    let inputRef = useRef();
   
    useEffect(()=>{
        if ( inputRef.current && inputRef.current.focus){
            inputRef.current.focus();
        }
    },[editing])
    return (  
        <div>
            {/* <Modal
                width='400px'
                height='260px'
                title='修改设备名'
                footer={null}
                visible={visible}
                onCancel={()=>setVisible(false)}
                style={{ zIndex:'10' }}
            >
                <Input ref={inputRef} style={{ width:'240px'  }} value={value} onChange={e=>setValue(e.target.value) } />
            </Modal> */}
            {
                Object.keys(editing).length 
                ?
                <div>
                    <Input ref={inputRef} style={{ width:'120px'  }} value={value} onChange={e=>setValue(e.target.value) } onClick={e=>e.stopPropagation()} />
                    <div style={{ textAlign:'center', margin:'0.5rem 0' }}>
                        <Button size='small' type='primary' style={{ marginRight:'6px'}} onClick={e=>{
                            e.stopPropagation();
                            if ( value ){
                                new Promise((resolve, reject)=>{
                                    editing.mach_id = item.mach_id;
                                    editing.meter_name = value;
                                    dispatch({ type:'controller/add', payload:{ values:editing, resolve, reject, forEdit:true }})
                                })
                                .then(()=>{
                                    message.success('修改设备名成功');
                                    // 更新缓存的网关树结构
                                    dispatch({ type:'switchMach/updateCache', payload:{ mach_id:item.mach_id, newValue:value }});
                                    setEditing({});
                                })
                                .catch(msg=>message.error(msg));
                            } else {
                                message.info('设备名不能为空');
                            }
                        }}>确定</Button>
                        <Button size='small' onClick={(e)=>{
                            e.stopPropagation();
                            setEditing({});
                        }}>取消</Button>
                    </div>
                </div>
                :
                <span onClick={(e)=>{
                    e.stopPropagation();
                    let target = modelList.filter(i=>i.mach_id === item.mach_id)[0];
                    setEditing(target);
                  
                }}>{ item.meter_name }</span> 
            }
            
        </div>                                       
                                      
    )
}

export default SwitchItem;