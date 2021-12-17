import React from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Button, Select, Switch, Modal, message } from 'antd';

const { Option } = Select;
const phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const passwordReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";\'<>?,.\/]).{8,20}$/ ;
let msg = '密码需是包含字母/数字/特殊字符且长度8-15位的字符串';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

function UserForm({ companyList, roleList, userForm, forEdit, onAdd, onVisible }){
    const { agent_id, agent_name, real_name, company_id, company_name, create_time, email, is_actived, last_login_ip, last_login_time, phone, role_id, role_name, user_id, user_name } = userForm;
    
    return (
        
            <Form 
                {...layout} 
                name="nest-messages" 
                initialValues = {
                    {
                        user_name: forEdit ? user_name :'',
                        real_name:forEdit ? real_name : '',
                        phone: forEdit ? phone :'',
                        email:forEdit ? email :'',
                        role_id : forEdit ? role_id : null,
                        company_id: forEdit ? company_id :null,
                        is_actived:forEdit ? is_actived == 1 ? true : false : true,
                    }
                }
                onFinish={values=>{
                    new Promise((resolve,reject)=>{
                        if(forEdit) {
                            values.user_id = userForm.user_id;
                        }
                        if(onAdd && typeof onAdd === 'function') onAdd({ values, resolve, reject, forEdit});
                    }).then(()=>{
                        message.info(forEdit ? '编辑用户成功':'添加用户成功');
                        if ( onVisible && typeof onVisible === 'function') onVisible({visible:false});
                    }).catch(msg=>{
                        message.error(msg);
                    })                 
                }}
            >
                <Form.Item name='user_name' label="用户名" rules={[{ required: true, message:'用户名不能为空' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name='real_name' label="真实姓名" rules={[{ required: true, message:'请填入您的真实姓名' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name='phone' label="手机号" rules={[{ required:true, message:'请输入联系方式'}, {pattern:phoneReg, message:'请输入合法的手机号码'}]}>
                  <Input />
                </Form.Item>
                <Form.Item name='email' label="邮箱">
                  <Input />
                </Form.Item>
                <Form.Item name='role_id' label="角色权限" rules={[{ required:true, message:'请设置账号的权限'}]}>
                    <Select>
                        {
                            roleList && roleList.length 
                            ?
                            roleList.map((item,index)=>(
                                <Option key={index} value={item.role_id}>{item.role_name}</Option>
                            ))
                            :
                            null
                        }
                    </Select>
                </Form.Item>
                {/* <Form.Item name='company_id' label="所属公司" rules={[{ required:true , message:'请选择所属公司'}]}>
                    <Select>
                            {
                                companyList && companyList.length
                                ?
                                companyList.map((item,index)=>(
                                    <Option key={index} value={item.company_id}>{item.company_name}</Option>
                                ))
                                :
                                null
                            }
                    </Select>
                </Form.Item> */}
                <Form.Item name='is_actived' label="是否启用" valuePropName="checked">
                    <Switch />
                </Form.Item>            
                <Form.Item name='password' label="密码" rules={[{ required:true , message:'密码不能为空'}]}>
                    <Input.Password placeholder="请输入密码" />
                </Form.Item>          
                <Form.Item name='confirm_password' label="确认密码" rules={[{ required:true , message:'密码不能为空'}]}>
                    <Input.Password placeholder="请再次输入密码"/>
                </Form.Item>               
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <Button type="primary" htmlType="submit">
                        { forEdit ? '修改' : '创建' }
                    </Button>
                    <Button style={{ marginLeft:'10px' }} onClick={()=>onVisible({ visible:false })}>取消</Button>
                </Form.Item>
            </Form>
    )
}


export default UserForm;
