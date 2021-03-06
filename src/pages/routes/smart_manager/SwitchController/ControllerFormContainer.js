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
  

function ControllerFormContainer({ dispatch, switchMach }){
    const [form] = Form.useForm();
    let { setterInfo } = switchMach;
    useEffect(()=>{
        dispatch({ type:'switchMach/initParams' });
    },[]);
    useEffect(()=>{
        if ( Object.keys(setterInfo).length ){
            form.setFieldsValue({
                "trip_over_power_percentage":setterInfo['trip_over_power_percentage'],
                "rated_current":setterInfo["rated_current"],
                "rated_voltage":setterInfo["rated_voltage"],
                "alarm_temp":setterInfo["alarm_temp"],
                "trip_temp":setterInfo["trip_temp"],
                "alarm_over_voltage_percentage":setterInfo["alarm_over_voltage_percentage"],
                "alarm_lower_voltage_percentage":setterInfo["alarm_lower_voltage_percentage"],
                "combine_delay_secs":setterInfo["combine_delay_secs"],
                "enable_trip_over_voltage":setterInfo['enable_trip_over_voltage'],
                "trip_over_voltage_percentage":setterInfo["trip_over_voltage_percentage"],
                "enable_trip_lower_voltage":setterInfo['enable_trip_lower_voltage'],
                "trip_lower_voltage_percentage":setterInfo["trip_lower_voltage_percentage"]
            });
        }
    },[setterInfo])
   
    return (
        <div style={{ height:'100%', position:'relative' }}>
        <Form form={form} className={style['form-container']} { ...formItemLayout }>
            <Row gutter={24}>
                <Col span={12}>            
                    <Form.Item label="????????????" name="specification">                     
                        <span style={{ color:'#03a4fe'}}>{ setterInfo.specification === 2 ? 'B?????????' : setterInfo.specification === 3 ? 'C?????????' : setterInfo.specification === 4 ? 'D?????????' : 'C?????????'}</span> 
                    </Form.Item>
                </Col>
                <Col span={12}>            
                    
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>            
                    <Form.Item label="????????????" name="rated_current">                       
                        <Input addonAfter="A" /> 
                    </Form.Item>
                </Col>
                <Col span={12}>            
                    <Form.Item label="????????????" name="rated_voltage">                       
                        <Input addonAfter="V" /> 
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>            
                    <Form.Item label="????????????" name="alarm_temp">                       
                        <Input addonAfter="???" /> 
                    </Form.Item>
                </Col>
                <Col span={12}>            
                    <Form.Item label="????????????" name="trip_temp">                       
                        <Input addonAfter="???" /> 
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>            
                    <Form.Item label="????????????" name="alarm_over_voltage_percentage">                       
                        <Input addonAfter="%" placeholder="????????????1 ~ 100" /> 
                    </Form.Item>
                </Col>
                <Col span={12}>            
                    <Form.Item label="????????????" name="alarm_lower_voltage_percentage">                       
                        <Input addonAfter="%" placeholder="????????????1 ~ 100" /> 
                    </Form.Item>
                </Col>
            </Row>
            
            <Row gutter={24}>
                <Col span={12}>            
                    <Form.Item label="????????????" name="trip_over_power_percentage">                       
                        <Input addonAfter="%" /> 
                    </Form.Item> 
                </Col>
                <Col span={12}> 
                              
                    <Form.Item label="????????????????????????" name="combine_delay_secs">                       
                        <Input addonAfter="???" placeholder="1 ~ 240???" suffix={
                            <Tooltip title='?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????'>
                                <InfoCircleOutlined style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                            </Tooltip>
                        } /> 
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="????????????" name="enable_trip_over_voltage" valuePropName='checked'>
                        <Switch className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="??????????????????" shouldUpdate={(prevValues, currentValues) => prevValues.enable_trip_over_voltage !== currentValues.enable_trip_over_voltage}>                     
                        {({ getFieldValue }) => { 
                            return (   
                                <Form.Item  name="trip_over_voltage_percentage">                       
                                    <Input addonAfter="%" disabled={Number(getFieldValue('enable_trip_over_voltage')) === 0 ? true : false } placeholder="????????????1 ~ 100" /> 
                                </Form.Item>
                            )
                            
                        }}                    
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="????????????" name="enable_trip_lower_voltage" valuePropName='checked'>
                        <Switch className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="??????????????????" shouldUpdate={(prevValues, currentValues) => prevValues.enable_trip_lower_voltage !== currentValues.enable_trip_lower_voltage}>                     
                        {({ getFieldValue }) => {       
                            return (   
                                <Form.Item  name="trip_lower_voltage_percentage">                       
                                    <Input addonAfter="%" disabled={Number(getFieldValue('enable_trip_lower_voltage')) === 0 ? true : false } placeholder="????????????1 ~ 100"  /> 
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
                        values.enable_trip_over_voltage = Number(values.enable_trip_over_voltage);
                        values.enable_trip_lower_voltage = Number(values.enable_trip_lower_voltage);
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'switchMach/setParams', payload:{ values, resolve, reject }})
                        })
                        .then(msg=>{
                            message.success('????????????????????????');
                        })
                        .catch(msg=>message.info(msg))
                    })
                }}>??????</div>
                <div className={IndexStyle['btn'] + ' ' + IndexStyle['opacity']} onClick={()=>{
                    form.setFieldsValue({
                        "trip_over_power_percentage":setterInfo['trip_over_power_percentage'],
                        "rated_current":setterInfo["rated_current"],
                        "rated_voltage":setterInfo["rated_voltage"],
                        "alarm_temp":setterInfo["alarm_temp"],
                        "trip_temp":setterInfo["trip_temp"],
                        "alarm_over_voltage_percentage":setterInfo["alarm_over_voltage_percentage"],
                        "alarm_lower_voltage_percentage":setterInfo["alarm_lower_voltage_percentage"],
                        "combine_delay_secs":setterInfo["combine_delay_secs"],
                        "enable_trip_over_voltage":setterInfo['enable_trip_over_voltage'],
                        "trip_over_voltage_percentage":setterInfo["trip_over_voltage_percentage"],
                        "enable_trip_lower_voltage":setterInfo['enable_trip_lower_voltage'],
                        "trip_lower_voltage_percentage":setterInfo["trip_lower_voltage_percentage"]
                    });
                }}>??????</div>
            </div>
        </div>
    )
}

export default connect(({ switchMach })=>({ switchMach }))(ControllerFormContainer)