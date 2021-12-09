import React, { useState} from 'react';
import { Row, Col, Form, Button, Checkbox, message } from 'antd';
import ActionConfirm from '@/pages/components/ActionConfirm';

const formItemLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };
let btnStyle = {
    display:'inline-block',
    verticalAlign:'top', 
    fontWeight:'bold', 
    cursor:'pointer', 
    margin:'0 10px', 
    width:'100px', 
    height:'40px', 
    lineHeight:'40px',
    textAlign:'center',
    color:'#fff'
}
function doPromiseArray(array, action, dispatch){
  let sequence = Promise.resolve();
  array.forEach(function (item, index) {
          // 此处的item 就是 return new promise.....**
          sequence = sequence.then(()=>{
              return new Promise((resolve, reject)=>{
                  dispatch({ type: action === 'combine' ? 'switchMach/fetchTurnOn' : 'switchMach/fetchTurnOff', payload:{ resolve, reject , mach_id:item, auto:true }})
              })
          },()=>{
                return new Promise((resolve, reject)=>{
                    dispatch({ type: action === 'combine' ? 'switchMach/fetchTurnOn' : 'switchMach/fetchTurnOff', payload:{ resolve, reject , mach_id:item, auto:true }})
                })
          })
      });                            
    return sequence;
}
function CombineSwitch({ switchList, dispatch, onClose }){
    let [form] = Form.useForm();
    let [visibleInfo, setVisibleInfo] = useState({ visible:false, action:''});
    return (
        <div>
            <ActionConfirm visible={visibleInfo.visible} onClose={()=>setVisibleInfo({ visible:false, action:''})} onDispatch={()=>{
                form.validateFields()
                .then(values=>{
                    if ( values.mach_ids && values.mach_ids.length ){
                        onClose();
                        doPromiseArray(values.mach_ids, visibleInfo.action, dispatch)
                        .then(()=>{
                            dispatch({ type:'switchMach/fetchSwitchList'});
                        })
                        .catch(msg=>{
                            message.info(msg);
                            dispatch({ type:'switchMach/fetchSwitchList'});
                        })
                    } else {
                        message.info('请先选中设备');
                    }
                })
            }} />
            <Form form={form} name='combine' {...formItemLayout} >
                <Row gutter={24} style={{ marginLeft:'100px'}}>
                    <Col span={12}>
                        <Checkbox style={{ lineHeight:'32px', color:'#fff'}} onChange={e=>{
                            console.log(e.target.checked);
                            if ( e.target.checked ){
                                form.setFieldsValue({
                                    mach_ids:switchList.map(i=>i.mach_id)
                                })
                            } else {
                                form.setFieldsValue({
                                    mach_ids:[]
                                })
                            }
                        }}>全选</Checkbox>
                    </Col>
                </Row>
                <Form.Item name='mach_ids' >             
                    <Checkbox.Group>
                        <Row gutter={24} style={{ marginLeft:'100px'}}>
                        {
                            switchList.map((item,index)=>(
                                <Col span={12} key={index}>
                                    <Checkbox value={item.mach_id} style={{ lineHeight:'32px', color:'#fff'}}>{ item.meter_name }</Checkbox>
                                </Col>
                            ))
                        }
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <div type="primary" style={{ ...btnStyle, backgroundColor:'rgb(24 173 20)' }} onClick={()=>{
                        setVisibleInfo({ visible:true, action:'combine'})
                        // form.validateFields()
                        // .then(values=>{
                        //     if ( values.mach_ids && values.mach_ids.length ){
                        //         onClose();
                        //         doPromiseArray(values.mach_ids, 'combine', dispatch)
                        //         .then(()=>{
                        //             dispatch({ type:'switchMach/fetchSwitchList'});
                        //         })
                        //         .catch(msg=>{
                        //             message.info(msg);
                        //             dispatch({ type:'switchMach/fetchSwitchList'});
                        //         })
                        //     } else {
                        //         message.info('请先选中设备');
                        //     }
                        // })
                    }}>
                       合闸
                    </div>
                    <div type='primary' style={{ ...btnStyle, backgroundColor:'#ff2d2e'}} onClick={()=>{
                        setVisibleInfo({ visible:true, action:'trip'})

                        // form.validateFields()
                        // .then(values=>{
                        //     if ( values.mach_ids && values.mach_ids.length ){
                        //         onClose();
                        //         doPromiseArray(values.mach_ids, 'trip', dispatch)
                        //         .then(()=>{
                        //             dispatch({ type:'switchMach/fetchSwitchList'});
                        //         })
                        //         .catch(msg=>{
                        //             message.info(msg);
                        //             dispatch({ type:'switchMach/fetchSwitchList'});
                        //         })
                        //     } else {
                        //         message.info('请先选中设备');
                        //     }
                        // })
                    }}>分断</div>
                </Form.Item>
            </Form>
        </div>
    )
}

export default CombineSwitch;

