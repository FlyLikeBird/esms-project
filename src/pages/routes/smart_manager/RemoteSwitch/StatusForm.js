import React, { useEffect } from 'react';
import { Form, Radio, Table, Switch, Row, Col, Button, Input, InputNumber, message } from 'antd';
import style from './StatusForm.css';
import IndexStyle from '@/pages/routes/IndexPage.css';

function FormContainer({ dispatch, data }){
    const [form] = Form.useForm();
    const formItemLayout = {
        labelCol: { span: 16 },
        wrapperCol:{ span: 8}
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
                style={{ padding:'0 2rem'}} 
                className={IndexStyle['self-table-container'] + ' ' + IndexStyle['dark'] + ' ' + IndexStyle['small']}
                dataSource={[{
                    'voltage':data.power ? data.power.voltage : '-- --',
                    'current':data.power ? data.power.current : '-- --',
                    'power': data.power ? data.power.power : '-- --',
                    'powerfactor':data.power ? data.power.powerfactor : '-- --',
                    'energy':data.power ? data.power.energy : '-- --',
                    'temp':data.power ? data.power.temp : '-- --'
                }]}
                columns={[{ title:'??????(V)', dataIndex:'voltage' }, { title:'??????(A)', dataIndex:'current'}, { title:'??????(KW)', dataIndex:'power'}, { title:'????????????(cos??)', dataIndex:'powerFactor'}, { title:'??????(KWH)', dataIndex:'energy'}, { title:'??????(???)', dataIndex:'temp'}]}
                pagination={false}
            />
        <Form form={form} className={style['form-container']} layout='inline' style={{ width:'100%', padding:'0 2rem'}}>
            {/* <Form.Item label="??????" name='voltage'>
                <Input addonAfter="V" disabled={true} />
            </Form.Item>
            <Form.Item label="??????" name='current'>
                <Input addonAfter="A" disabled={true}/>
            </Form.Item>
            <Form.Item label="??????" name='power'>
                <Input addonAfter="KW" disabled={true}/>
            </Form.Item>
            <Form.Item label="????????????" name='powerfactor'>
                <Input addonAfter="cos??" disabled={true}/>
            </Form.Item>
            <Form.Item label="??????" name='energy'>
                <Input addonAfter="KWH" disabled={true}/>
            </Form.Item> */}
            <Form.Item label="??????/??????" name='combine_trip' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="??????????????????" name='temp_alert' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="??????????????????" name='temp_trip' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="????????????" name='leakage' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="??????????????????" name='hand_trip' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="????????????" name='overload' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="??????????????????" name='overload_trip' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="??????????????????" name='trip_lock' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>       
            <Form.Item label="????????????" name='service_mode' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="???" unCheckedChildren="???"  />
            </Form.Item>
            <Form.Item label="????????????" name='power_overrun' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="??????????????????" name='voltage_low' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="??????????????????" name='voltage_high' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>                                  
            <Form.Item label="??????????????????" name='combine_fail' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="??????????????????" name='trip_fail' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="??????????????????" name='hand_combine' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="????????????/????????????" name='unusual_combine_trip' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>                                     
            <Form.Item label="????????????" name='direct_short' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>   
            <Form.Item label="?????????????????????" name='auto_recombine' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="???" unCheckedChildren="???"  />
            </Form.Item>
            <Form.Item label="?????????????????????" name='auto_recombine_fail' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="???" unCheckedChildren="???"  />
            </Form.Item>
            <Form.Item label="??????????????????" name='enable_temp_control' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="???" unCheckedChildren="???"  />
            </Form.Item>               
            <Form.Item label="??????????????????????????????" name='unusual_knife_travel' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="???" unCheckedChildren="???"  />
            </Form.Item>              
            <Form.Item label="??????????????????K2????????????" name='unusual_k2' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>
            <Form.Item label="??????????????????" name='disable_remote_control' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
            </Form.Item>              
            <Form.Item label="????????????????????????" name='unusual_mechanical_structure' className={style['my-form-item']} valuePropName='checked'>
                <Switch disabled className={style['custom-switch']} checkedChildren="??????" unCheckedChildren="??????"  />
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

                
                
           