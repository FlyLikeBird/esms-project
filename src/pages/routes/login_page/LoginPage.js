import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'dva/router';
import { Table, Button, Card, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import loginBg from '../../../../public/login_bg.png';

import style from './LoginPage.css';

const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
};
const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
};

function LoginPage({ dispatch, user }) {  
    const { thirdAgent } = user;
    const [form] = Form.useForm();
    return (        
        localStorage.getItem('user_id') && location.pathname === '/login'
        ?
        <Redirect to='/' />
        :
        <div className={style.container}>
            <div className={style['logo-container']}>
                <img src={Object.keys(thirdAgent).length ? thirdAgent.logo_path : ''} style={{ marginRight:'20px' }} />
            </div>
            <div className={style['login-container']}>
                <div className={style['title']}>用户登录</div>
                <div className={style['form-container']}>
                    <Form
                        {...layout}
                        className={style['form']}
                        form={form}
                    >
                        <Form.Item                            
                            name="user_name"
                            rules={[{required:true, message:'账号不能为空!'}]}
                        >
                            <Input addonBefore={<UserOutlined />} bordered='false' />
                        </Form.Item>
                        <Form.Item                           
                            name="password"
                            rules={[{required:true, message:'密码不能为空!'}]}
                        >
                            <Input.Password addonBefore={<LockOutlined />} bordered='false' />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" style={{width:'100%', height:'40px'}} onClick={()=>{
                                form.validateFields()
                                .then(values=>{
                                    new Promise((resolve,reject)=>{
                                        dispatch({type:'user/login', payload:values, resolve, reject })
                                    }).then(()=>{})
                                    .catch(msg=>{
                                        message.error(msg);
                                    })
                                })
                            }}>登录</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div>
                    <a href={`/pdf-viewer`} target='_blank'>to pdf</a>
                </div>
            </div>        
            <div className={style['bg-container']} style={{ backgroundImage:`url(${loginBg})` }}></div>    
            {/* <div style={{ position:'absolute', left:'calc( 10% + 140px)', bottom:'20px', fontSize:'0.8rem' }}>粤ICP备20066003号</div> */}
        </div>
    )
}

export default connect(({ user })=>({ user }))(LoginPage);
