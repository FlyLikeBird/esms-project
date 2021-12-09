import React, { useState } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Switch, Radio, Button, DatePicker, TimePicker, InputNumber, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import style from './BillingForm.css';

const { Option } = Select;
let num = 0;


const hourList = [];
for(var i=0;i<=24;i++){
    let hour = +i;
    hour = hour < 10 ? '0' + hour +'时' : ''+hour+'时';
    hourList.push(hour);
}

const updateArr = ( value, fields, currentField, type)=>{
    return fields.map(item=>{
        if (item.key === currentField.key ) {
            item[type] = value;
        }
        return item;
    })
}

const initialTimeData = { time_type:1, begin_time:'00时', end_time:'00时', fee_rate:0 };
const BillingForm = ({ dispatch, billing})=>{
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    const { forEdit, prevItem } = billing;
    const { quarter_name, begin_month, end_month } = prevItem;
    const finalFields = forEdit 
        ?
        prevItem.timeList.map(item=> {
            num++;
            let obj = { ...item };
            obj['key'] = num;
            obj.begin_time = item.begin_time + '时';
            obj.end_time = item.end_time + '时';
            return obj;
        })
        :
        [{key:num, ...initialTimeData}];
    const [fields, changeFields] = useState( finalFields );
    return (    
        <Form 
            {...layout} 
            name="billing-form"
            initialValues={{
                quarter_name : forEdit ? quarter_name : '',
                begin_month : forEdit ?  moment(begin_month,'MM') : null,
                end_month : forEdit ?  moment(end_month, 'MM') : null,
            }} 
            onFinish={values=>{
                console.log(values);
                let { begin_month, end_month } = values; 
                new Promise((resolve,reject)=>{
                    dispatch({type:'billing/add', payload:{values, timedata:fields, forEdit, resolve, reject }});               
                })
                .then(()=>{
                    dispatch({type:'billing/toggleVisible', payload:{ visible:false}});
                })
                .catch(msg=>{
                    message.error(msg);
                })
            }}
        >
            <Form.Item name='quarter_name' label="季度名称" rules={[{ required: true, message:'季度名称不能为空' }]}>
                <Input />
            </Form.Item>
            <Form.Item name='begin_month' label="开始月份" rules={[{ required:true, message:'开始月份不能为空'}]}>
                <DatePicker locale={zhCN} picker="month" placeholder="选择开始月份" style={{width:'100%'}} />
            </Form.Item>
            <Form.Item name='end_month' label="结束月份" rules={[{ required:true, message:'结束月份不能为空'}]}>
                <DatePicker locale={zhCN} picker="month" placeholder="选择结束月份" style={{width:'100%'}} />
            </Form.Item>
            <Form.Item  label="时段配置">              
                <div>
                    <Button type="primary" onClick={()=>{
                        ++num;
                        changeFields(fields.concat({ key:num, ...initialTimeData }));
                    }}>添加时段</Button>
                    {
                        fields.map((field, index)=>(
                            <div key={field.key} className={style['field-container']}>
                                <Form.Item labelCol={{span:24}} label="时段类型">
                                    <Select value={`${[field.time_type]}`} onChange={ value => changeFields(updateArr( value, fields, field, 'time_type')) }>
                                        <Option value="4">尖时段</Option>
                                        <Option value="1">峰时段</Option>
                                        <Option value="2">平时段</Option>
                                        <Option value="3">谷时段</Option>                                       
                                    </Select>                                                                                                        
                                </Form.Item>
                                <Form.Item labelCol={{span:24}} label="开始时间" >
                                    <Select value={field.begin_time} onChange={ value=> changeFields(updateArr(value, fields, field, 'begin_time'))}>
                                        {
                                            hourList.map((item)=>(
                                                <Option key={item} value={item}>{item}</Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item labelCol={{span:24}} label="结束时间" >
                                    <Select value={field.end_time} onChange={ value=> changeFields(updateArr(value, fields, field, 'end_time'))}>
                                        {
                                            hourList.map((item)=>(
                                                <Option key={item} value={item}>{item}</Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item labelCol={{span:24}} label="费率(元/kwh)" >
                                    <InputNumber 
                                        min={0} 
                                        style={{width:'100%'}} 
                                        value={field.fee_rate} 
                                        onChange={ value => changeFields(updateArr( value, fields, field, 'fee_rate')) } 
                                    />
                                </Form.Item>
                                {
                                    fields.length !== 1  
                                    ?
                                    <MinusCircleOutlined
                                        style={{marginLeft:'20px'}}
                                        onClick={() => {
                                            let temp = fields.filter(item=>item.key != field.key );
                                            changeFields(temp);
                                        }}
                                    />
                                    :
                                    null
                                }
                            </div>))
                    }
                    </div>
                                       
                                            
            </Form.Item>
            
           
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
                <Button type="primary" htmlType="submit">
                    确定
                </Button>
                <Button type="primary" style={{margin:'0 10px'}} onClick={()=>dispatch({type:'billing/toggleVisible', payload:{ visible:false }})}>
                    取消
                </Button>
            </Form.Item>
        </Form>
    )
}

export default connect(({ billing }) => ({ billing }))(BillingForm);