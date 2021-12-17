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
    let { limitEleInfo } = switchMach;
    const [form] = Form.useForm();
    useEffect(()=>{
        dispatch({ type:'switchMach/fetchLimitEle' });
    },[]);
    useEffect(()=>{
        if ( Object.keys(limitEleInfo).length ){
            form.setFieldsValue({
                'current_trip_enable':limitEleInfo.current_trip_enable,
                'current_trip_value':limitEleInfo.current_trip_value
            });
        }
    },[limitEleInfo])
    return (
        <div style={{ height:'100%', position:'relative' }}>
            <Form className={style['form-container']} form={form}  style={{ width:'30%' }}>
                <Row gutter={24}>
                    <Col span={20}>
                        <Form.Item label='电流越限脱扣' name='current_trip_enable' valuePropName='checked' >
                            <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={20}>
                        <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.current_trip_enable !== currentValues.current_trip_enable}>                     
                            {({ getFieldValue }) => {   
                                return (   
                                    <Form.Item label="电流上限" name="current_trip_value" rules={[{ required: true, message: '请输入合适的电流值' }]}>                       
                                        <Input addonAfter="A" disabled={Number(getFieldValue('current_trip_enable')) === 0 ? true : false } /> 
                                    </Form.Item>
                                )
                                
                            }}                    
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div className={style['btn-group']}>
                <div className={IndexStyle['btn']} onClick={()=>{
                    form.validateFields()
                    .then(values=>{
                        values.current_trip_enable = Number(values.current_trip_enable);
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'switchMach/setLimitEle', payload:{ resolve, reject, values }})
                        })
                        .then(()=>{
                            message.success('设置限制电流参数成功')
                        })
                        .catch(msg=>message.error(msg));
                    })
                }}>保存</div>
                <div className={IndexStyle['btn'] + ' ' + IndexStyle['opacity']} onClick={()=>{
                    form.setFieldsValue({
                        'current_trip_enable':limitEleInfo.current_trip_enable,
                        'current_trip_value':limitEleInfo.current_trip_value
                    })
                }}>取消</div>
            </div>
        </div>
        
    )
}


export default connect(({ switchMach })=>({ switchMach }))(TempFormContainer);