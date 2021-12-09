import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Radio, Switch, Input, InputNumber, Button, Checkbox, message } from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import style from './FormContainer.css';
import IndexStyle from '@/pages/routes/IndexPage.css';
import ActionConfirm from '@/pages/components/ActionConfirm';

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
    return result;
}

const AutoCombineFormContainer = ({ dispatch, switchMach }) => {
    let { autoCombineInfo } = switchMach;
    let [form] = Form.useForm();
    let [actionVisible, setActionVisible] = useState(false);
    let [disabled, setDisabled] = useState(false);
    useEffect(()=>{
        dispatch({ type:'switchMach/fetchAutoCombine'});
    },[])
    useEffect(()=>{
        if ( Object.keys(autoCombineInfo).length ){
            form.setFieldsValue({
                'lst':autoCombineInfo['lst'] || [null],
                'over_temp_trip_enable':autoCombineInfo['over_temp_trip_enable'],
                'over_voltage_trip_enable':autoCombineInfo['over_voltage_trip_enable'],
                'low_voltage_trip_enable':autoCombineInfo['low_voltage_trip_enable'],
                'over_power_trip_enable':autoCombineInfo['over_power_trip_enable'],
                'leakage_trip_enable':autoCombineInfo['leakage_trip_enable'],
                'direct_short_trip_enable':autoCombineInfo['direct_short_trip_enable']
            });
            if ( autoCombineInfo['over_temp_trip_enable'] || autoCombineInfo['over_voltage_trip_enable'] || autoCombineInfo['low_voltage_trip_enable'] || autoCombineInfo['over_power_trip_enable'] || autoCombineInfo['leakage_trip_enable'] || autoCombineInfo['direct_short_trip_enable'] ){
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        }
    },[autoCombineInfo])
  return (
        <div style={{ height:'100%', position:'relative', overflow:'hidden auto' }}>
          <ActionConfirm visible={actionVisible} onClose={()=>setActionVisible(false)} onDispatch={()=>{
                form.validateFields()
                .then(values=>{
                    values.over_temp_trip_enable = Number(values.over_temp_trip_enable);
                    values.over_voltage_trip_enable = Number(values.over_voltage_trip_enable);
                    values.low_voltage_trip_enable = Number(values.low_voltage_trip_enable);
                    values.over_power_trip_enable = Number(values.over_power_trip_enable);
                    values.leakage_trip_enable = Number(values.leakage_trip_enable);
                    values.direct_short_trip_enable = Number(values.direct_short_trip_enable);
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
        <Form name="dynamic_form_item" className={style['form-container']} form={form} style={{ width:'60%' }} onValuesChange={(a,allValues)=>{
            if ( allValues['over_temp_trip_enable'] || allValues['over_voltage_trip_enable'] || allValues['low_voltage_trip_enable'] || allValues['over_power_trip_enable'] || allValues['leakage_trip_enable'] || allValues['direct_short_trip_enable'] ){
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        }}>
        <Form.Item >
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
        <Row gutter={24}>
            <Col span={8}>
                <Form.Item label='过温脱扣重合闸' name='over_temp_trip_enable' valuePropName='checked'>
                    <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label='过压脱扣重合闸' name='over_voltage_trip_enable' valuePropName='checked'>
                    <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label='欠压脱扣重合闸' name='low_voltage_trip_enable' valuePropName='checked'>
                    <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={8}>
                <Form.Item label='过载脱扣重合闸' name='over_power_trip_enable' valuePropName='checked'>
                    <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label='漏电脱扣重合闸' name='leakage_trip_enable' valuePropName='checked'>
                    <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label='短路脱扣重合闸' name='direct_short_trip_enable' valuePropName='checked'>
                    <Switch className={style['custom-switch']} checkedChildren="激活" unCheckedChildren="禁止"  />
                </Form.Item>
            </Col>
        </Row>
            
    
                
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
                    ghost
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
    </Form>
        <div style={{ position:'absolute', left:'50%', bottom:'4rem', transform:'translateX(-50%)' }}>
            <div className={IndexStyle['btn']} onClick={()=>{
                setActionVisible(true);
            }}>保存</div>
            <div className={IndexStyle['btn'] + ' ' + IndexStyle['opacity']} onClick={()=>{
                form.setFieldsValue({
                    'lst':autoCombineInfo['lst'] || [null],
                    'over_temp_trip_enable':autoCombineInfo['over_temp_trip_enable'],
                    'over_voltage_trip_enable':autoCombineInfo['over_voltage_trip_enable'],
                    'low_voltage_trip_enable':autoCombineInfo['low_voltage_trip_enable'],
                    'over_power_trip_enable':autoCombineInfo['over_power_trip_enable'],
                    'leakage_trip_enable':autoCombineInfo['leakage_trip_enable'],
                    'direct_short_trip_enable':autoCombineInfo['direct_short_trip_enable']
                });
            }}>取消</div>
        </div>
    </div>
  );
};

export default connect(({ switchMach })=>({ switchMach }))(AutoCombineFormContainer);