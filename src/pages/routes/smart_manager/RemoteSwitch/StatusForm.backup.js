import React, { useEffect } from 'react';
import { Form, Radio, Table, Row, Col, Button, Input, InputNumber, message } from 'antd';
import style from './StatusForm.css';
import IndexStyle from '@/pages/routes/IndexPage.css';

function FormContainer({ dispatch, data }){
    const [form] = Form.useForm();
    console.log(data);
    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    };
    useEffect(()=>{
        form.setFieldsValue({
            'combine_trip':data.status ? data.status.combine_trip : null,
            'temp_alert':data.status ? data.status.temp_alert : null,
            'temp_trip':data.status ? data.status.temp_trip : null,
            'leakage':data.status ? data.status.leakage : null,
            'hand_trip':data.status ? data.status.hand_trip : null,
            'overload':data.status ? data.status.overload : null,
            'overload_trip':data.status ? data.status.overload_trip : null,
            'trip_lock':data.status ? data.status.trip_lock : null,
            'service_mode':data.status ? data.status.service_mode : null,
            'power_overrun':data.status ? data.status.power_overrun : null,
            'voltage_low':data.status ? data.status.voltage_low : null,
            'voltage_high':data.status ? data.status.voltage_high : null,
            'combine_fail':data.status ? data.status.combine_fail : null,
            'trip_fail':data.status ? data.status.trip_fail : null,
            'hand_combine':data.status ? data.status.hand_combine : null,
            'unusual_combine_trip':data.status ? data.status.unusual_combine_trip : null,
            'direct_short':data.status ? data.status.direct_short : null,
            'auto_recombine':data.status ? data.status.auto_recombine : null,
            'auto_recombine_fail':data.status ? data.status.auto_recombine_fail : null,
            'enable_temp_control':data.status ? data.status.enable_temp_control : null,
            'unusual_knife_travel':data.status ? data.status.unusual_knife_travel : null,
            'unusual_k2':data.status ? data.status.unusual_k2 : null,
            'disable_remote_control':data.status ? data.status.disable_remote_control : null,
            'unusual_mechanical_structure':data.status ? data.status.unusual_mechanical_structure : null,

            

        })
    },[data])
    return (
        <div style={{ height:'100%' }}>
            <Table 
                className={IndexStyle['self-table-container'] + ' ' + IndexStyle['dark'] + ' ' + IndexStyle['small']}
                dataSource={[{
                    'voltage':data.power ? data.power.voltage : '-- --',
                    'current':data.power ? data.power.current : '-- --',
                    'power': data.power ? data.power.power : '-- --',
                    'powerfactor':data.power ? data.power.powerfactor : '-- --',
                    'energy':data.power ? data.power.energy : '-- --',
                }]}
                columns={[{ title:'电压(V)', dataIndex:'voltage' }, { title:'电流(A)', dataIndex:'current'}, { title:'功率(KW)', dataIndex:'power'}, { title:'功率因素(cosΦ)', dataIndex:'powerFactor'}, { title:'电能(KWH)', dataIndex:'energy'}]}
                pagination={false}
            />
        <Form form={form} className={style['form-container']} {...layout} layout='inline' style={{ width:'100%', padding:'1rem 2rem'}}>
            {/* <Form.Item label="电压" name='voltage'>
                <Input addonAfter="V" disabled={true} />
            </Form.Item>
            <Form.Item label="电流" name='current'>
                <Input addonAfter="A" disabled={true}/>
            </Form.Item>
            <Form.Item label="功率" name='power'>
                <Input addonAfter="KW" disabled={true}/>
            </Form.Item>
            <Form.Item label="功率因素" name='powerfactor'>
                <Input addonAfter="cosΦ" disabled={true}/>
            </Form.Item>
            <Form.Item label="电能" name='energy'>
                <Input addonAfter="KWH" disabled={true}/>
            </Form.Item> */}
            <Form.Item label="合闸/脱扣" name='combine_trip' className={style['my-form-item']}>
                <Radio.Group disabled={true} >
                    <Radio value={1}>合闸</Radio>
                    <Radio value={0}>脱扣</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="温度超限" name='temp_alert' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="过温脱扣" name='temp_trip' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="漏电报警" name='leakage' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="手动脱扣标记" name='hand_trip' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="过载报警" name='overload' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="过载脱扣" name='overload_trip' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="脱扣锁死" name='trip_lock' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>       
            <Form.Item label="维修模式" name='service_mode' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="功率超限" name='power_overrun' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="电压过低" name='voltage_low' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="电压过高" name='voltage_high' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>                                  
            <Form.Item label="合闸异常" name='combine_fail' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="脱扣异常" name='trip_fail' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="手动合闸标志" name='hand_combine' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="正常合闸/脱扣" name='unusual_combine_trip' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>                                       
            <Form.Item label="短路报警" name='direct_short' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>   
            <Form.Item label="自动重合闸" name='auto_recombine' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="自动重合闸失败" name='auto_recombine_fail' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="使能温度管控" name='enable_temp_control' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>               
            <Form.Item label="闸刀行程开关异常" name='unusual_knife_travel' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>              
            <Form.Item label="电机行程开关K2异常" name='unusual_k2' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="禁止远程控制" name='disable_remote_control' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>              
            <Form.Item label="机械结构异常" name='unusual_mechanical_structure' className={style['my-form-item']}>
                <Radio.Group disabled={true}>
                    <Radio value={1}>报警</Radio>
                    <Radio value={0}>解除</Radio>
                </Radio.Group>
            </Form.Item>
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

                
                
           