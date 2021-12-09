import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message, Tooltip, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import AMapLoader from '@amap/amap-jsapi-loader';

const { Option } = Select;
const { Search } = Input;

function validator(a,value){
    if ( !value || (typeof +value === 'number' && +value === +value && +value >=0  )) {
        return Promise.resolve();
    } else {
        return Promise.reject('请填入合适的阈值');
    }
}

function AddForm({ info, onDispatch, onClose }){
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const [form] = Form.useForm();
    useEffect(()=>{
        form.setFieldsValue({
            name : info.forEdit ? info.userInfo.name : null,
            mobile: info.forEdit ? info.userInfo.mobile : null,
            department : info.forEdit ? info.userInfo.department : null
        });
        
    },[info])
   
    return (
            <Form
                {...layout} 
                name="add-form"
                form={form}
                onFinish={values=>{
                    
                    if ( info.forEdit ) {
                        values.person_id = info.userInfo.mach_id;
                    }
                    // console.log(values);
                    new Promise((resolve,reject)=>{
                        onDispatch({ type:'region/add', payload:{ values, resolve, reject, forEdit:info.forEdit }});
                    })
                    .then(()=>{
                        onClose();
                        message.success(`${info.forEdit ? '修改' : '添加'}负责人成功`);
                    })
                    .catch(msg=>{
                        message.error(msg);
                    })
                }}
            >
                <Form.Item name='name' label='姓名' rules={[{ required:true, message:'姓名不能为空'}]}>
                    <Input />
                </Form.Item>
                <Form.Item name='mobile' label='手机号' rules={[{ required:true, message:'手机号不能为空'}]}>
                    <Input />
                </Form.Item>
        
                <Form.Item name='department' label='部门' rules={[ { required:true, message:'部门信息不能为空' }]}>
                    <Input />
                </Form.Item>
                
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <Button type="primary" htmlType="submit">确定</Button>
                    <Button type="primary" style={{margin:'0 10px'}} onClick={()=>{
                        form.resetFields();
                        onClose();
                    }}> 取消 </Button>
                </Form.Item>
            </Form>        
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(AddForm, areEqual);