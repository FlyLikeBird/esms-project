import React, { useState, useEffect } from 'react';
import { Form, Radio, Row, Col, Button, Input, InputNumber, message } from 'antd';
import style from './FormContainer.css';
import ActionConfirm from '@/pages/components/ActionConfirm';

function FormContainer({ dispatch, data }){
    const [form] = Form.useForm();
    let [actionVisible, setActionVisible] = useState(false);
    useEffect(()=>{
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
    },[data])
    return (
        <div>
            <ActionConfirm visible={actionVisible} onClose={()=>setActionVisible(false)} onDispatch={()=>{
                form.validateFields()
                .then(values=>{
                    new Promise((resolve, reject)=>{
                        dispatch({ type:'switchMach/fetchSetSwitchOption', payload:{ values, resolve, reject }})
                    })
                    .then(msg=>{
                        // console.log(msg);
                        message.success(msg);
                    })
                    .catch(msg=>message.info(msg))
                })
            }} />
        <Form form={form} className={style['form-container']}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item label="过温报警激活" name="over_temp_alarm_enable">
                        <Radio.Group >
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.over_temp_alarm_enable !== currentValues.over_temp_alarm_enable}>                     
                        {({ getFieldValue }) => {       
                            // console.log(getFieldValue);
                            return (   
                                <Form.Item label="过温报警参数" name="over_temp_alarm_value">                       
                                    <Input addonAfter="℃" disabled={getFieldValue('over_temp_alarm_enable') === 0 ? true : false } /> 
                                </Form.Item>
                            )
                            
                        }}                    
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item label="过温脱扣激活" name="over_temp_trip_enable">
                        <Radio.Group>
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.over_temp_trip_enable !== currentValues.over_temp_trip_enable}>                     
                        {({ getFieldValue }) => {       
                            return (   
                                <Form.Item label="过温脱扣参数" name="over_temp_trip_value">                       
                                    <Input addonAfter="℃" disabled={getFieldValue('over_temp_trip_enable') === 0 ? true : false } /> 
                                </Form.Item>
                            )
                            
                        }}                    
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item label="过压报警激活" name="over_voltage_alarm_enable">
                        <Radio.Group>
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.over_voltage_alarm_enable !== currentValues.over_voltage_alarm_enable}>                     
                        {({ getFieldValue }) => {       
                            return (   
                                <Form.Item label="过压报警参数" name="over_voltage_alarm_value">                       
                                    <Input addonAfter="%" disabled={getFieldValue('over_voltage_alarm_enable') === 0 ? true : false } /> 
                                </Form.Item>
                            )
                            
                        }}                    
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item label="过压脱扣激活" name="over_voltage_trip_enable">
                        <Radio.Group>
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.over_voltage_trip_enable !== currentValues.over_voltage_trip_enable}>                     
                        {({ getFieldValue }) => {       
                            return (   
                                <Form.Item label="过压脱扣参数" name="over_voltage_trip_value">                       
                                    <Input addonAfter="%" disabled={getFieldValue('over_voltage_trip_enable') === 0 ? true : false } /> 
                                </Form.Item>
                            )
                            
                        }}                    
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item label="欠压报警激活" name="low_voltage_alarm_enable">
                        <Radio.Group>
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.low_voltage_alarm_enable !== currentValues.low_voltage_alarm_enable}>                     
                        {({ getFieldValue }) => {       
                            return (   
                                <Form.Item label="欠压报警参数" name="low_voltage_alarm_value">                       
                                    <Input addonAfter="%" disabled={getFieldValue('low_voltage_alarm_enable') === 0 ? true : false } /> 
                                </Form.Item>
                            )
                            
                        }}                    
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item label="欠压脱扣激活" name="low_voltage_trip_enable">
                        <Radio.Group>
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.low_voltage_trip_enable !== currentValues.low_voltage_trip_enable}>                     
                        {({ getFieldValue }) => {       
                            return (   
                                <Form.Item label="欠压脱扣参数" name="low_voltage_trip_value">                       
                                    <Input addonAfter="%" disabled={getFieldValue('low_voltage_trip_enable') === 0 ? true : false } /> 
                                </Form.Item>
                            )
                            
                        }}                    
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24} style={{ textAlign:'center' }}>
                    <Button type='primary' size='large' style={{ margin:'0 6px' }} onClick={()=>setActionVisible(true)}>保存</Button>
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
        </div>
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