import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};
function UserForm({ dispatch, type, userInfo, currentCompany }){
    let [form] = Form.useForm();
    useEffect(()=>{
        form.setFieldsValue({
            username:userInfo.user_name,
            company:currentCompany.company_name
        })
    },[])
    return (
        <Form
            { ...layout }
            form={form}
            style={{ width:'50%', position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}
            onFinish={values=>{
                let { old_password, password, confirm_password } = values;
                if ( password !== confirm_password ){
                    message.info('两次新密码输入不一致');
                    return ;
                } else {
                    new Promise((resolve, reject)=>{
                        dispatch({type:'user/changePwd', payload:{ type, user_id:userInfo.user_id, old_password, password, confirm_password, resolve, reject }})
                    })
                    .then(()=>{
                        message.success(`修改${type === 'login' ? '登录':'操作'}密码成功!`);
                        form.setFieldsValue({
                            'old_password':'',
                            'password':'',
                            'confirm_password':''                                
                        });
                    })
                    .catch(msg=>{
                        message.error(msg);
                    })
                }
            }}
        >
            {/* <Form.Item label='用户名' name='username'>
                <Input style={{ width:'100%' }} disabled />
            </Form.Item>
            <Form.Item label='所属公司' name='company'>
                <Input style={{ width:'100%' }} disabled />
            </Form.Item> */}
            <Form.Item label={ type === 'login' ? '原密码' : '登录密码'} name='old_password' rules={[{ required:true, message:'原密码不能为空' }]}>
                <Input.Password style={{ width:'100%' }}  type='password' placeholder='输入原密码' />
            </Form.Item>
            <Form.Item label={ type === 'login' ? '新密码' :'新操作密码'} name='password' rules={[{ required:true, message:'新密码不能为空' }]}>
                <Input.Password style={{ width:'100%' }}  type='password' placeholder='输入新密码' />
            </Form.Item>
            <Form.Item label={ type === 'login' ? '确认密码' : '确认操作密码'} name='confirm_password' rules={[{ required:true, message:'新密码不能为空'}]}>
                <Input.Password style={{ width:'100%' }}  type='password' placeholder='再次输入新密码' />
            </Form.Item> 
            <Form.Item { ...tailLayout}>
                <Button type='primary' htmlType='submit' style={{ width:'100%' }}>修改</Button>
            </Form.Item>
        </Form>
    )
}

export default UserForm;