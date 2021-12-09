import React, { useEffect } from 'react';
import { Form, Radio, Row, Col, Button, Input, InputNumber, Tooltip, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import style from '../SwitchSetter/FormContainer.css';

function FormContainer({ dispatch, data }){
    const [form] = Form.useForm();
    console.log(data);
    useEffect(()=>{
        form.setFieldsValue({
            "rated_current":data["rated_current"],
            "rated_voltage":data["rated_voltage"],
            "alarm_temp":data["alarm_temp"],
            "trip_temp":data["trip_temp"],
            "alarm_over_voltage_percentage":data["alarm_over_voltage_percentage"],
            "alarm_lower_voltage_percentage":data["alarm_lower_voltage_percentage"],
            "trip_over_power":data["trip_over_power"],
            "combine_delay_secs":data["combine_delay_secs"],
            "trip_over_voltage_percentage":data["trip_over_voltage_percentage"],
            "trip_lower_voltage_percentage":data["trip_lower_voltage_percentage"]
        });
    },[data])
    return (
        <Form form={form} className={style['form-container']} onFinish={values=>{
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
                    <Form.Item label="过载脱扣" name="trip_over_power">                       
                        <Input addonAfter="W" /> 
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
                <Col span={5}>
                    <Form.Item label="过压脱扣" name="enable_trip_over_voltage">
                        <Radio.Group >
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={19}>
                    <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.enable_trip_over_voltage !== currentValues.enable_trip_over_voltage}>                     
                        {({ getFieldValue }) => {       
                            return (   
                                <Form.Item label="过压脱扣参数" name="trip_over_voltage_percentage">                       
                                    <Input addonAfter="%" disabled={getFieldValue('enable_trip_over_voltage') === 0 ? true : false } placeholder="输入值为1 ~ 100" /> 
                                </Form.Item>
                            )
                            
                        }}                    
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={5}>
                    <Form.Item label="欠压脱扣" name="enable_trip_lower_voltage">
                        <Radio.Group >
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={19}>
                    <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.enable_trip_lower_voltage !== currentValues.enable_trip_lower_voltage}>                     
                        {({ getFieldValue }) => {       
                            return (   
                                <Form.Item label="欠压脱扣参数" name="enable_trip_lower_voltage">                       
                                    <Input addonAfter="%" disabled={getFieldValue('enable_trip_lower_voltage') === 0 ? true : false } placeholder="输入值为1 ~ 100"  /> 
                                </Form.Item>
                            )
                            
                        }}                    
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24} style={{ textAlign:'center' }}>
                    <Button size='large' htmlType='submit' type='primary' style={{ margin:'0 6px' }}>保存</Button>
                    <Button size='large' onClick={()=>{
                        form.setFieldsValue({
                            "over_temp_alarm_enable":data["over_temp_alarm_enable"],
                            "over_temp_alarm_value":data["over_temp_alarm_value"],
                            "over_temp_trip_enable":data["over_temp_trip_enable"],
                            "over_temp_trip_value":data["over_temp_trip_value"],
                            "over_voltage_alarm_enable":data["over_voltage_alarm_enable"],
                            "over_voltage_alarm_value":data["over_voltage_alarm_value"],
                            "over_voltage_trip_enable":data["over_voltage_trip_enable"],
                            "over_voltage_trip_value":data["over_voltage_trip_value"],
                            "low_voltage_alarm_enable":data["low_voltage_alarm_enable"],
                            "low_voltage_alarm_value":data["low_voltage_alarm_value"],
                            "low_voltage_trip_enable":data["low_voltage_trip_enable"],
                            "low_voltage_trip_value":data["low_voltage_trip_value"]
                        })
                    }}>取消</Button>
                </Col>
            </Row>
        </Form>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(FormContainer, areEqual);