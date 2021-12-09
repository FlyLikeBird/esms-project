import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message, Slider, Divider, InputNumber } from 'antd';
import style from '@/pages/routes/IndexPage.css';

const { Option } = Select;

function validator(a,value){
    if ( !value || (typeof +value === 'number' && +value === +value && +value >=0  )) {
        return Promise.resolve();
    } else {
        return Promise.reject('请填入合适的阈值');
    }
}

function RuleForm({ visibleInfo, ruleType, ruleMachs, currentRule, onAdd, onUpdate, onClose }){
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const [form] = Form.useForm();
    const [currentType, setCurrentType] = useState({});
    // console.log(currentRule);
    useEffect(()=>{
        form.setFieldsValue({
            rule_name : visibleInfo.forEdit ? currentRule.rule_name : null,
            // 调整level的顺序
            level: visibleInfo.forEdit ? ( currentRule.level == 3 ? 1 : currentRule.level == 1 ? 3 : 2 ) : 1,
            type_id : visibleInfo.forEdit ? currentRule.type_name : null,
            warning_min : visibleInfo.forEdit ? +currentRule.warning_min : null,
            warning_max : visibleInfo.forEdit ? +currentRule.warning_max : null,
            mach_ids: visibleInfo.forEdit ? currentRule.bindMachs.map(i=>i+'') : [],
            
        })
        if ( visibleInfo.forEdit ){
            let temp = ruleType.filter(i=>i.type_id === currentRule.type_id)[0];
            setCurrentType(temp);
        }
    },[]);
    // console.log(currentType);
    return (
        <Form
            {...layout} 
            name="rule-form"
            form={form}
            onFinish={values=>{
                // console.log(values);
                new Promise((resolve,reject)=>{
                    values.level = values.level == 1  ? 3 : values.level == 3 ? 1 : 2; 
                    if ( visibleInfo.forEdit ){
                        values.rule_id = currentRule.rule_id;
                        values.type_id = currentRule.type_id;
                        onUpdate({ values, resolve, reject});
                    } else {
                        onAdd({ values, resolve, reject });
                    }
                })
                .then(()=>{
                    onClose();
                })
                .catch(msg=>{
                    message.error(msg);
                })
            }}
        >
            <Form.Item name='rule_name' label='规则名称' rules={[{ required:true, message:'规则名称不能为空'}]}>
                <Input />
            </Form.Item>
            <Form.Item name='level' label='告警等级'>
                <Slider min={1} max={3} marks={{ 1:'低',2:'中',3:'高'}}  tooltipVisible={false} />
            </Form.Item>
            {
                visibleInfo.forEdit 
                ?
                <Form.Item name='type_id' label='告警类型'>
                    <Input disabled/>
                </Form.Item>
                :
                <Form.Item name='type_id' label='告警类型' rules={[{ required:true, message:'请指定一种告警类型'}]}>
                    <Select onChange={value=>{
                        let temp = ruleType.filter(i=>i.type_id === value)[0];
                        setCurrentType(temp);
                    }}>
                        {
                            ruleType.length 
                            ?
                            ruleType.map(item=>(
                                <Option key={item.type_id} value={item.type_id}>{ item.type_name }</Option>
                            ))
                            :
                            null
                        }
                    </Select>
                </Form.Item>
            }
            
            <Form.Item name='warning_min' label='最小阈值' rules={[{ validator }]}>
                <Input style={{width:'100%'}}  addonAfter={currentType.unit_name} />
            </Form.Item>
            <Form.Item name='warning_max' label='最大阈值' rules={[{ validator }]}>
                <Input style={{ width:'100%'}} addonAfter={currentType.unit_name}/>
            </Form.Item>
            <Form.Item name='mach_ids' label='关联设备'>
                <Select
                    mode="multiple"
                    allowClear
                    className={style['self-select-container']}
                    placeholder='请选择规则应用于哪些设备'
                    dropdownRender={menu=>(
                        <div>
                            { menu }
                            <Divider style={{ margin:'4px 0'}} />
                            <div style={{ margin:'4px 0'}}>
                                <Button size='small' type='primary' style={{ marginLeft:'14px' }} onClick={()=>{
                                    form.setFieldsValue({
                                        mach_ids:ruleMachs.map(i=>i.mach_id + '')
                                    })
                                }}>全选</Button>
                            </div>
                        </div>
                    )}
                >
                    {
                        ruleMachs && ruleMachs.length 
                        ?
                        ruleMachs.map((mach, index)=>(
                            <Option key={mach.mach_id}>{ mach.meter_name }</Option>
                        ))
                        :
                        null
                    }
                </Select>
            </Form.Item> 
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                <Button type="primary" htmlType="submit">确定</Button>
                <Button type="primary" style={{margin:'0 10px'}} onClick={ onClose }> 取消 </Button>
            </Form.Item>
        </Form>
    )
}

export default RuleForm;