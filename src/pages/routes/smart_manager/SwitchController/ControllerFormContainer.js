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
                    <Form.Item label="设备规格" name="specification">                     
                        <span style={{ color:'#03a4fe'}}>{ setterInfo.specification === 2 ? 'B型规格' : setterInfo.specification === 3 ? 'C型规格' : setterInfo.specification === 4 ? 'D型规格' : 'C型规格'}</span> 
                    </Form.Item>
                </Col>
                <Col span={12}>            
                    
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>            
                    <Form.Item label="额定电流" name="rated_current">                       
                        <Input addonAfter="A" /> 
                    </Form.Item>
                </Col>
                <Col span={12}>            
                    <Form.Item label="额定电压" name="rated_voltage">                       
                        <Input addonAfter="V" /> 
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>            
                    <Form.Item label="报警温度" name="alarm_temp">                       
                        <Input addonAfter="℃" /> 
                    </Form.Item>
                </Col>
                <Col span={12}>            
                    <Form.Item label="脱扣温度" name="trip_temp">                       
                        <Input addonAfter="℃" /> 
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>            
                    <Form.Item label="过压报警" name="alarm_over_voltage_percentage">                       
                        <Input addonAfter="%" placeholder="输入值为1 ~ 100" /> 
                    </Form.Item>
                </Col>
                <Col span={12}>            
                    <Form.Item label="欠压报警" name="alarm_lower_voltage_percentage">                       
                        <Input addonAfter="%" placeholder="输入值为1 ~ 100" /> 
                    </Form.Item>
                </Col>
            </Row>
            
            <Row gutter={24}>
                <Col span={12}>            
                    <Form.Item label="过载脱扣" name="trip_over_power_percentage">                       
                        <Input addonAfter="%" /> 
                    </Form.Item> 
                </Col>
                <Col span={12}> 
                              
                    <Form.Item label="手动合闸延时脱扣" name="combine_delay_secs">                       
                        <Input addonAfter="秒" placeholder="1 ~ 240秒" suffix={
                            <Tooltip title='仅在收到空开脱扣锁死命令后启用，该情况下用户手动合闸，延时时间到空开自动脱扣。'>
                                <InfoCircleOutlined style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                            </Tooltip>
                        } /> 
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="过压脱扣" name="enable_trip_over_voltage" valuePropName='checked'>
                        <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="过压脱扣参数" shouldUpdate={(prevValues, currentValues) => prevValues.enable_trip_over_voltage !== currentValues.enable_trip_over_voltage}>                     
                        {({ getFieldValue }) => { 
                            return (   
                                <Form.Item  name="trip_over_voltage_percentage">                       
                                    <Input addonAfter="%" disabled={Number(getFieldValue('enable_trip_over_voltage')) === 0 ? true : false } placeholder="输入值为1 ~ 100" /> 
                                </Form.Item>
                            )
                            
                        }}                    
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="欠压脱扣" name="enable_trip_lower_voltage" valuePropName='checked'>
                        <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="欠压脱扣参数" shouldUpdate={(prevValues, currentValues) => prevValues.enable_trip_lower_voltage !== currentValues.enable_trip_lower_voltage}>                     
                        {({ getFieldValue }) => {       
                            return (   
                                <Form.Item  name="trip_lower_voltage_percentage">                       
                                    <Input addonAfter="%" disabled={Number(getFieldValue('enable_trip_lower_voltage')) === 0 ? true : false } placeholder="输入值为1 ~ 100"  /> 
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
                            message.success('设置空开参数成功');
                        })
                        .catch(msg=>message.info(msg))
                    })
                }}>保存</div>
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
                }}>取消</div>
            </div>
        </div>
    )
}

export default connect(({ switchMach })=>({ switchMach }))(ControllerFormContainer)