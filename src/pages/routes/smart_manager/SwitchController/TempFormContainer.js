import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Switch, Input, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import style from './FormContainer.css';
import IndexStyle from '@/pages/routes/IndexPage.css';

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };
  
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

  
function TempFormContainer({ dispatch, switchMach }){
    let { tempInfo } = switchMach;
    const [form] = Form.useForm();
    useEffect(()=>{
        dispatch({ type:'switchMach/initTemp' });
    },[]);
    useEffect(()=>{
        if ( Object.keys(tempInfo).length ){
            form.setFieldsValue({
                'temp_limit_upper':tempInfo.temp_limit_upper,
                'temp_limit_lower':tempInfo.temp_limit_lower
            });
        }
    },[tempInfo])
    return (
        <div style={{ height:'100%', position:'relative' }}>
            <Form className={style['form-container']} form={form} {...formItemLayout} style={{ width:'30%' }}>
                <Row gutter={24}>
                    <Col span={20}>
                        <Form.Item label='温度下限' name='temp_limit_lower' rules={[{ required: true, message: '请输入合适的温度值' }]}>
                            <Input addonAfter="℃"/>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <span className={style['info-text']}>温度范围: 0-255℃</span>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={20}>
                        <Form.Item label='温度上限' name='temp_limit_upper' rules={[{ required: true, message: '请输入合适的温度值' }]}>
                            <Input addonAfter="℃"/>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <span className={style['info-text']}>温度范围: 0-255℃</span>
                    </Col>
                </Row>
            </Form>
            <div style={{ position:'absolute', left:'50%', bottom:'4rem', transform:'translateX(-50%)' }}>
                <div className={IndexStyle['btn']} onClick={()=>{
                    form.validateFields()
                    .then(values=>{
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'switchMach/setTemp', payload:{ resolve, reject, values }})
                        })
                        .then(()=>{
                            message.success('设置温度参数成功')
                        })
                        .catch(msg=>message.error(msg));
                    })
                }}>保存</div>
                <div className={IndexStyle['btn'] + ' ' + IndexStyle['opacity']} onClick={()=>{
                    form.setFieldsValue({
                        'temp_limit_upper':tempInfo.temp_limit_upper,
                        'temp_limit_lower':tempInfo.temp_limit_lower
                    })
                }}>取消</div>
            </div>
        </div>
        
    )
}


export default connect(({ switchMach })=>({ switchMach }))(TempFormContainer);