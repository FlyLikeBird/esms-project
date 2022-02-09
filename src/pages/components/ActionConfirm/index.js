import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Button, Tag, message } from 'antd';
import style from '@/pages/routes/IndexPage.css';
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};
function ActionConfirm2({ dispatch, visible, onClose, onDispatch }){
    let [form] = Form.useForm();
    return (
        <Modal
            width='400px'
            height='260px'
            className={style['custom-modal']}
            title='操作校验'
            footer={null}
            visible={visible}
            onCancel={()=>onClose()}
        >
            <Form
                { ...layout }
                form={form}
                onFinish={values=>{
                    new Promise((resolve, reject)=>{
                        dispatch({ type:'user/checkActionPwd', payload:{ resolve, reject, oper_password:values.oper_password }});
                    })
                    .then(()=>{
                        message.success('操作密码校验成功');
                        onClose();
                        if ( onDispatch && typeof onDispatch === 'function') onDispatch();
                        form.resetFields();
                    })
                    .catch(msg=>message.error(msg));
                }}
            >          
                <Form.Item label='操作密码' name='oper_password' rules={[{ required:true, message:'操作密码不能为空' }]}>
                    <Input.Password style={{ width:'100%' }}  type='password'  />
                </Form.Item> 
                <Form.Item { ...tailLayout}>
                    <Button type='primary' htmlType='submit' >确定</Button>
                    <Button style={{ marginLeft:'1rem' }} onClick={()=>onClose() }>取消</Button>
                </Form.Item>
            </Form>
        
        </Modal>
    )
}
function ActionConfirm({ dispatch, visible, onClose, onDispatch, userName, actionType }){
    let [form] = Form.useForm();
    return (
        <Modal
            width='400px'
            height='260px'
            className={style['custom-modal']}
            title='操作校验'
            footer={null}
            visible={visible}
            onCancel={()=>onClose()}
        >
            <div>
                <div>
                    <span style={{ margin:'0 6px'}}>{ userName }</span>正在操作，请确认<Tag color={ actionType === '分断' ? '#f50' : '#87d068'} style={{ margin:'0 6px' }}>{ actionType }</Tag>条件
                </div>
                <div style={{ textAlign:'center', margin:'2rem 0' }}>
                    <Button type='primary' onClick={()=>{
                        onClose();
                        if ( onDispatch && typeof onDispatch === 'function') onDispatch();
                    }} >确定</Button>
                    <Button style={{ marginLeft:'1rem' }} onClick={()=>onClose() }>取消</Button>
                </div>
            </div>
            {/* <Form
                { ...layout }
                form={form}
                onFinish={values=>{
                    new Promise((resolve, reject)=>{
                        dispatch({ type:'user/checkActionPwd', payload:{ resolve, reject, oper_password:values.oper_password }});
                    })
                    .then(()=>{
                        message.success('操作密码校验成功');
                        onClose();
                        if ( onDispatch && typeof onDispatch === 'function') onDispatch();
                        form.resetFields();
                    })
                    .catch(msg=>message.error(msg));
                }}
            >          
                <Form.Item label='操作密码' name='oper_password' rules={[{ required:true, message:'操作密码不能为空' }]}>
                    <Input.Password style={{ width:'100%' }}  type='password'  />
                </Form.Item> 
                <Form.Item { ...tailLayout}>
                    <Button type='primary' htmlType='submit' >确定</Button>
                    <Button style={{ marginLeft:'1rem' }} onClick={()=>onClose() }>取消</Button>
                </Form.Item>
            </Form> */}
        
        </Modal>
    )
}
export default connect(({ switchMach })=>({ switchMach }))(ActionConfirm);