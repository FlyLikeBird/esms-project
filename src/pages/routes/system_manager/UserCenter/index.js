import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Tabs, Input, Button, message } from 'antd';
import UserForm from './UserForm';
import style from '@/pages/routes/IndexPage.css';

const passwordReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";\'<>?,.\/]).{6,20}$/ ;
let msg = '密码必须包含字母、数字、特殊字符且长度为6-20位';
const { TabPane } = Tabs;

function UpdatePassword({ dispatch, user }){
    const { userInfo, currentCompany } = user;    
    return (
        <div className={style['card-container']} >
            <Tabs
                className={style['custom-tabs']}
            >
                <TabPane tab='登录密码' key='login'>
                    <UserForm type='login' dispatch={dispatch} userInfo={userInfo} currentCompany={currentCompany} />
                </TabPane>
                <TabPane tab='操作密码' key='action'>
                    <UserForm type='action' dispatch={dispatch} userInfo={userInfo} currentCompany={currentCompany} />
                </TabPane> 
            </Tabs>
            
        </div>
    )
}

export default connect(({ user })=>({ user }))(UpdatePassword);