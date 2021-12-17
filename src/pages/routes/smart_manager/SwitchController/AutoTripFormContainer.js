import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Radio, Row, Col, Switch, Button, Input, InputNumber, Tooltip, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import style from './FormContainer.css';
import IndexStyle from '@/pages/routes/IndexPage.css';

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  

function AutoTripFormContainer({ dispatch, switchMach }){
    let { autoTripInfo } = switchMach;
    useEffect(()=>{
        dispatch({ type:'switchMach/fetchAutoTrip' });
    },[]);
    useEffect(()=>{
        if ( Object.keys(autoTripInfo).length ){
            form.setFieldsValue({
                'over_temp_alarm_enable':autoTripInfo.over_temp_alarm_enable,
                'over_temp_alarm_value':autoTripInfo.over_temp_alarm_value,
                'over_temp_trip_enable':autoTripInfo.over_temp_trip_enable,
                'over_temp_trip_value':autoTripInfo.over_temp_trip_value,
                'over_voltage_alarm_enable':autoTripInfo.over_voltage_alarm_enable,
                'over_voltage_alarm_value':autoTripInfo.over_voltage_alarm_value,
                'over_voltage_trip_enable':autoTripInfo.over_voltage_trip_enable,
                'over_voltage_trip_value':autoTripInfo.over_voltage_trip_value,
                'low_voltage_alarm_enable':autoTripInfo.low_voltage_alarm_enable,
                'low_voltage_alarm_value':autoTripInfo.low_voltage_alarm_value,
                'low_voltage_trip_enable':autoTripInfo.low_voltage_trip_enable,
                'low_voltage_trip_value':autoTripInfo.low_voltage_trip_value,
            });
        }
    },[autoTripInfo])
    const [form] = Form.useForm();
    return (
        <div style={{ height:'100%', position:'relative' }}>
            <Form form={form} className={style['form-container']} style={{ width:'50%'}} onFinish={values=>{
                new Promise((resolve, reject)=>{
                    dispatch({ type:'switchMach/fetchSetSwitchController', payload:{ values, resolve, reject }})
                })
                .then(msg=>{
                    // console.log(msg);
                    message.success(msg);
                })
                .catch(msg=>message.info(msg))
            }}>
                <Row gutter={24}>
                    <Col span={8}>            
                        <Form.Item label="过温报警激活" name="over_temp_alarm_enable" valuePropName='checked'>                       
                            <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                        </Form.Item>
                    </Col>
                    <Col span={16}>            
                        <Form.Item label="过温报警参数" shouldUpdate={(prevValues, currentValues) => prevValues.over_temp_alarm_enable !== currentValues.over_temp_alarm_enable}>                     
                            {({ getFieldValue }) => {   
                                return (   
                                    <Form.Item noStyle name="over_temp_alarm_value">                       
                                        <Input addonAfter="℃" disabled={getFieldValue('over_temp_alarm_enable') === false ? true : false } placeholder="输入值为1 ~ 100" /> 
                                    </Form.Item>
                                )
                                
                            }}                    
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>            
                        <Form.Item label="过温脱扣激活" name="over_temp_trip_enable" valuePropName='checked'>                       
                            <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                        </Form.Item>
                    </Col>
                    <Col span={16}>            
                        <Form.Item label="过温脱扣参数" shouldUpdate={(prevValues, currentValues) => prevValues.over_temp_trip_enable !== currentValues.over_temp_trip_enable}>                     
                            {({ getFieldValue }) => {
                                return (   
                                    <Form.Item noStyle name="over_temp_trip_value">                       
                                        <Input addonAfter="℃" disabled={Number(getFieldValue('over_temp_trip_enable')) === 0 ? true : false } placeholder="输入值为1 ~ 100" /> 
                                    </Form.Item>
                                )                               
                            }}                    
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>            
                        <Form.Item label="过压报警激活" name="over_voltage_alarm_enable" valuePropName='checked'>                       
                            <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                        </Form.Item>
                    </Col>
                    <Col span={16}>            
                        <Form.Item label="过压报警参数" shouldUpdate={(prevValues, currentValues) => prevValues.over_voltage_alarm_enable !== currentValues.over_voltage_alarm_enable}>                     
                            {({ getFieldValue }) => {
                                return (   
                                    <Form.Item noStyle name="over_voltage_alarm_value">                       
                                        <Input addonAfter="%" disabled={Number(getFieldValue('over_voltage_alarm_enable')) === 0 ? true : false }  /> 
                                    </Form.Item>
                                )    
                            }}                    
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>            
                        <Form.Item label="过压脱扣激活" name="over_voltage_trip_enable" valuePropName='checked'>                       
                            <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                        </Form.Item>
                    </Col>
                    <Col span={16}>            
                        <Form.Item label="过压脱扣参数" shouldUpdate={(prevValues, currentValues) => prevValues.over_voltage_trip_enable !== currentValues.over_voltage_trip_enable}>                     
                            {({ getFieldValue }) => {
                                return (   
                                    <Form.Item  noStyle name="over_voltage_trip_value">                       
                                        <Input addonAfter="%" disabled={Number(getFieldValue('over_voltage_trip_enable')) === 0 ? true : false }  /> 
                                    </Form.Item>
                                )    
                            }}                    
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>            
                        <Form.Item label="欠压报警激活" name="low_voltage_alarm_enable" valuePropName='checked'>                       
                            <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                        </Form.Item>
                    </Col>
                    <Col span={16}>            
                        <Form.Item label="欠压报警参数" shouldUpdate={(prevValues, currentValues) => prevValues.low_voltage_alarm_enable !== currentValues.low_voltage_alarm_enable}>                     
                            {({ getFieldValue }) => {
                                return (   
                                    <Form.Item noStyle name="low_voltage_alarm_value">                       
                                        <Input addonAfter="%" disabled={Number(getFieldValue('low_voltage_alarm_enable')) === 0 ? true : false }  /> 
                                    </Form.Item>
                                )    
                            }}                    
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>            
                        <Form.Item label="欠压脱扣激活" name="low_voltage_trip_enable" valuePropName='checked'>                       
                            <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                        </Form.Item>
                    </Col>
                    <Col span={16}>            
                        <Form.Item label="欠压脱扣参数" shouldUpdate={(prevValues, currentValues) => prevValues.low_voltage_trip_enable !== currentValues.low_voltage_trip_enable}>                     
                            {({ getFieldValue }) => {
                                return (   
                                    <Form.Item noStyle name="low_voltage_trip_value">                       
                                        <Input addonAfter="%" disabled={Number(getFieldValue('low_voltage_trip_enable')) === 0 ? true : false }  /> 
                                    </Form.Item>
                                )    
                            }}                    
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div className={style['btn-group']} >
                <div className={IndexStyle['btn']} onClick={()=>{
                    form.validateFields()
                    .then(values=>{
                        values.over_temp_alarm_enable = Number(values.over_temp_alarm_enable);
                        values.over_temp_trip_enable = Number(values.over_temp_trip_enable);
                        values.over_voltage_alarm_enable = Number(values.over_voltage_alarm_enable);
                        values.over_voltage_trip_enable = Number(values.over_voltage_trip_enable);
                        values.low_voltage_alarm_enable = Number(values.low_voltage_alarm_enable);
                        values.low_voltage_trip_enable = Number(values.low_voltage_trip_enable);
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'switchMach/setAutoTrip', payload:{ resolve, reject, values }})
                        })
                        .then(()=>{
                            message.success('设置自动脱扣参数成功')
                        })
                        .catch(msg=>message.error(msg));
                    })
                }}>保存</div>
                <div className={IndexStyle['btn'] + ' ' + IndexStyle['opacity']} onClick={()=>{
                    form.setFieldsValue({
                        'over_temp_alarm_enable':autoTripInfo.over_temp_alarm_enable,
                        'over_temp_alarm_value':autoTripInfo.over_temp_alarm_value,
                        'over_temp_trip_enable':autoTripInfo.over_temp_trip_enable,
                        'over_temp_trip_value':autoTripInfo.over_temp_trip_value,
                        'over_voltage_alarm_enable':autoTripInfo.over_voltage_alarm_enable,
                        'over_voltage_alarm_value':autoTripInfo.over_voltage_alarm_value,
                        'over_voltage_trip_enable':autoTripInfo.over_voltage_trip_enable,
                        'over_voltage_trip_value':autoTripInfo.over_voltage_trip_value,
                        'low_voltage_alarm_enable':autoTripInfo.low_voltage_alarm_enable,
                        'low_voltage_alarm_value':autoTripInfo.low_voltage_alarm_value,
                        'low_voltage_trip_enable':autoTripInfo.low_voltage_trip_enable,
                        'low_voltage_trip_value':autoTripInfo.low_voltage_trip_value,
                    });
                }}>取消</div>
            </div>
        </div>
    )
}

export default connect(({ switchMach })=>({ switchMach }))(AutoTripFormContainer);