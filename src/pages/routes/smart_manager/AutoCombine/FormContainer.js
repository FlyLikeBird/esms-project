import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Radio, Input, InputNumber, Button, Checkbox, message } from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import style from '../SwitchSetter/FormContainer.css';
import ActionConfirm from '@/pages/components/ActionConfirm';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

function checkArr(arr){
    let result = true;
    arr.forEach((item,index)=>{
        if ( index === arr.length - 1) return;
        if ( arr[index+1] > item ) {

        } else {
            result = false;
        }
    })
    console.log(result);
    return result;
}
const FormContainer = ({ dispatch, data }) => {
  let [form] = Form.useForm();
  let [actionVisible, setActionVisible] = useState(false);
  let [disabled, setDisabled] = useState(false);
  useEffect(()=>{

    form.setFieldsValue({
        'lst':data['lst'] || [null],
        'over_temp_trip_enable':data['over_temp_trip_enable'],
        'over_voltage_trip_enable':data['over_voltage_trip_enable'],
        'low_voltage_trip_enable':data['low_voltage_trip_enable'],
        'over_power_trip_enable':data['over_power_trip_enable'],
        'leakage_trip_enable':data['leakage_trip_enable'],
        'direct_short_trip_enable':data['direct_short_trip_enable']
    });
    if ( data['over_temp_trip_enable'] || data['over_voltage_trip_enable'] || data['low_voltage_trip_enable'] || data['over_power_trip_enable'] || data['leakage_trip_enable'] || data['direct_short_trip_enable'] ){
        setDisabled(false);
    } else {
        setDisabled(true);
    }
  },[data])
  return (
      <div>
          <ActionConfirm visible={actionVisible} onClose={()=>setActionVisible(false)} onDispatch={()=>{
                form.validateFields()
                .then(values=>{
                    // console.log(values);
                    let lst = values.lst.filter(i=>i);
                    if ( lst && lst.length ) {
                        if ( lst.length >= 2 ){
                            // 判断重合闸时间的大小是否合理
                            if ( !checkArr(lst) ) {
                                message.error('确保后一次的重合闸时间大于前一次的重合闸时间', 8);
                                return ;
                            }
                        } 
                        new Promise((resolve, reject)=>{
                            values.lst = lst;
                            dispatch({ type:'switchMach/setAutoCombine', payload:{ resolve, reject, values }})
                        })
                        .then(()=>{
                            message.success('自动重合闸设置成功');
                        })
                        .catch(msg=>message.error(msg));
                    } else {
                        values.lst = lst;
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'switchMach/setAutoCombine', payload:{ resolve, reject, values }})
                        })
                        .then(()=>{
                            message.success('自动重合闸设置成功');
                        })
                        .catch(msg=>message.error(msg));
                    }
                })
            }} />
    <Form name="dynamic_form_item" className={style['form-container']} form={form} {...formItemLayoutWithOutLabel} onValuesChange={(a,allValues)=>{
        if ( allValues['over_temp_trip_enable'] || allValues['over_voltage_trip_enable'] || allValues['low_voltage_trip_enable'] || allValues['over_power_trip_enable'] || allValues['leakage_trip_enable'] || allValues['direct_short_trip_enable'] ){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }}>
        <Form.Item {...formItemLayoutWithOutLabel}>
            <Radio.Group onChange={e=>{
                if ( e.target.value === 1){
                    form.setFieldsValue({
                        'over_temp_trip_enable':1,
                        'over_voltage_trip_enable':1,
                        'low_voltage_trip_enable':1,
                        'over_power_trip_enable':1,
                        'leakage_trip_enable':1,
                        'direct_short_trip_enable':1
                    });
                    setDisabled(false);
                } else {
                    form.setFieldsValue({
                        'over_temp_trip_enable':0,
                        'over_voltage_trip_enable':0,
                        'low_voltage_trip_enable':0,
                        'over_power_trip_enable':0,
                        'leakage_trip_enable':0,
                        'direct_short_trip_enable':0
                    });
                    setDisabled(true);
                }
            }}>
                <Radio value={1}>全部激活</Radio>
                <Radio value={0}>全部禁止</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item { ...formItemLayoutWithOutLabel}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item label='过温脱扣' name='over_temp_trip_enable'>
                        <Radio.Group>
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='过压脱扣' name='over_voltage_trip_enable'>
                        <Radio.Group>
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='欠压脱扣' name='low_voltage_trip_enable'>
                        <Radio.Group>
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
        </Form.Item>
        <Form.Item { ...formItemLayoutWithOutLabel}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item label='过载脱扣' name='over_power_trip_enable'>
                        <Radio.Group>
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='漏电脱扣' name='leakage_trip_enable'>
                        <Radio.Group>
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='短路脱扣' name='direct_short_trip_enable'>
                        <Radio.Group>
                            <Radio value={1}>激活</Radio>
                            <Radio value={0}>禁止</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
        </Form.Item>
            
    
                
      <Form.List
        name="lst"
        // validateTrigger={['onChange']}
        // rules={[
        //   {
        //     validator: async (_, names) => {
        //         console.log(names);
        //       if (!names || names.length < 2) {
        //         return Promise.reject(new Error('At least 2 passengers'));
        //       }
        //     },
        //   },
        // ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => {
              return (<Form.Item
                { ...formItemLayout}
                label={`第${field.name + 1}次重合闸`}
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                //   validateTrigger={['onChange', 'onBlur']}
                //   rules={[
                //     {
                //       required: true,
                //       whitespace: true,
                //       message: "Please input passenger's name or delete this field.",
                //     },
                //   ]}
                  noStyle
                >
                    <InputNumber min={1} max={255} disabled={disabled} style={{ width:'90%' }} />
                </Form.Item>
                
                    <span className={style['tag']}>分钟
                        {
                            fields.length > 1 
                            ?
                            <CloseCircleOutlined
                                style={{ fontSize:'1.2rem' }}
                                onClick={() => remove(field.name)}
                            />
                            :
                            null                      
                        }
                        
                    </span>
                          
              </Form.Item>
            )})}
            <Form.Item>
              <Button
                className={style['btn']}
                type='primary'
                onClick={() => add()}
                style={{ width: '90%' }}
                icon={<PlusCircleOutlined />}
              >
                添加自动重合闸时间
              </Button>          
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button style={{ width:'90%'}} type="primary" onClick={()=>setActionVisible(true)}>
            保存
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ) {
        return false ;
    } else {
        return true;
    }
}
export default React.memo(FormContainer, areEqual);