import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, DatePicker, TimePicker, Button, Input, InputNumber, message  } from 'antd';
import style from './AddPlanForm.css';
import moment from 'moment';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 9, span: 15 },
};
let weeks = [];
for(var i=1;i<=7;i++){
    weeks.push(i);
}
let weeksMap = {
    1:'周一',
    2:'周二',
    3:'周三',
    4:'周四',
    5:'周五',
    6:'周六',
    7:'周日',
}

function DateCom({ currentDate, onChangeDate }){
    let inputRef = useRef();
    useEffect(()=>{
        return ()=>{
            onChangeDate(moment(new Date()));
        }
    },[])
    return (
        <DatePicker ref={inputRef} style={{ width:'100%' }} locale={zhCN} allowClear={false} value={currentDate} onChange={value=>{
            onChangeDate(value);
            if ( inputRef.current && inputRef.current.blur ) inputRef.current.blur();
        }} />
    )
}

let switchActions = [
    { key:'0', title:'空开合闸' },
    { key:'1', title:'空开脱扣' },
    { key:'3', title:'空开温控1路' },
    { key:'4', title:'空开温控2路' }
];
function AddPlanForm({ info, gatewayList, onDispatch, onClose }){
    let [taskType, setTaskType] = useState('1');
    let [form] = Form.useForm();
    let [currentDate, setCurrentDate] = useState(moment(new Date()));
    let [weekData, setWeekData] = useState([]);
    let [selectedMach, setSelectedMach] = useState([]);
    console.log(info);
    useEffect(()=>{
        if ( info.forEdit ){
            // 设置初始值
            form.setFieldsValue({
                task_type:info.taskInfo ? info.taskInfo.task_type : '',
                task_name:info.taskInfo ? info.taskInfo.task_name : '',
                gateway_id : info.taskInfo ? info.taskInfo.gateway_id : null,     
                switch_action:info.taskInfo ? info.taskInfo.switch_action : null,
                repeat_type: info.taskInfo ? info.taskInfo.repeat_type : null,                
            });
        }
        form.setFieldsValue({
            task_type:'1',     
            repeat_type:'1',
            gateway_id:gatewayList.length ? gatewayList[0].key : null
        });
        return ()=>{
            if ( form ){
                form.resetFields();
            }
        }
    },[]);
    return (
       <Form form={form} layout='horizontal' className={style['form-container']} onFinish={values=>{
            // console.log(values);
            // console.log(values.time.format('HH:mm:ss'));
            // console.log(currentDate.format('YYYY-MM-DD'));
            let exec_date, time = values.time.format('HH:mm:ss');
            if ( !selectedMach.length ){
                message.info('还没有选择空开设备');
                return ;
            }
            // 重复类型为周，确保选中周几
            if ( values.repeat_type === '1' ){
                if ( weekData.length ) {
                    exec_date = time;
                    values.week_value = weekData;
                } else {
                    message.info('请指定一周的哪几天');
                    return ;
                }
                
            } else {
                // 重复类型为月和年，选中哪一天
                exec_date = currentDate.format('YYYY-MM-DD') + ' ' + time;
            }
            values.exec_date = exec_date;
            values.mach_ids = selectedMach;
            new Promise((resolve, reject)=>{
                onDispatch({ type:'switchMach/fetchAddTask', payload:{ resolve, reject, values }})
            })
            .then(()=>{
                message.success('添加任务成功');
                onClose();
            })
            .catch(msg=>{
                message.info(msg);
            })
        }}>      
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label='任务类型' name='task_type' rules={[{ required:true, message:'信息不能为空' }]}>
                        <Select onChange={value=>setTaskType(value)}>
                            <Option value='1'>空开任务</Option>
                            {/* <Option value='2'>空调</Option> */}
                            <Option value='3'>漏保任务</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label='任务名称' name='task_name' rules={[{ required:true, message:'信息不能为空' }]}>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label='选择网关' name='gateway_id' rules={[{ required:true, message:'信息不能为空' }]}>
                        <Select>
                            {
                                gatewayList.map((item)=>(
                                    <Option value={item.key}>{ item.title }</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        label='选择设备' 
                        // name='mach_ids' 
                        rules={[{ required:true, message:'信息不能为空' }]}
                        shouldUpdate={(prevValues, currentValues) => { 
                            // if ( prevValues.gateway_id !== currentValues.gateway_id ) {
                            //     setSelectedMach([]);
                            // }
                            return prevValues.gateway_id !== currentValues.gateway_id 
                        }}
                    >
                            {({ getFieldValue }) => {           
                                // console.log(getFieldValue('gateway_id'));
                                let temp = gatewayList.filter(i=>i.key === getFieldValue('gateway_id'))[0];
                                let machList = temp ? temp.children : [];
                                return (                                                                 
                                    machList && machList.length 
                                    ?
                                    <Select mode='multiple' maxTagCount={1} value={selectedMach} onChange={value=>{
                                        console.log(value);
                                        setSelectedMach(value);
                                    }}>
                                        {
                                            machList.map((item,index)=>(
                                                <Option key={item.key} value={item.key}>{ item.title }</Option>
                                            ))
                                        }
                                    </Select>
                                    :
                                    <Input placeholder='该网关下没有挂载设备' disabled={true} />                      
                                )                     
                            }}
                    </Form.Item>
                </Col>
            </Row>
            {

                taskType !== '2' 
                ?
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label='执行动作' name='switch_action' rules={[{ required:true, message:'信息不能为空' }]}>
                            <Select>
                                {
                                    switchActions.map((item)=>(
                                        <Option value={item.key} >{ item.title }</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                :
                null
            }
            
            {/* 空调任务额外的表单选项 */}
            {
                taskType === '2' 
                ?
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label='空调模式' name='air_mode' rules={[{ required:true, message:'信息不能为空' }]}>
                            <Select>
                                <Option value='1'>制冷</Option>
                                <Option value='3'>送风</Option>
                                <Option value='4'>制热</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='空调开关' name='air_action' rules={[{ required:true, message:'信息不能为空' }]}>
                            <Select>
                                <Option value='1'>开</Option>
                                <Option value='2'>关</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                :
                null
            }
            {
                taskType === '2' 
                ?
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label='空调风速' name='air_wind_speed' rules={[{ required:true, message:'信息不能为空' }]}>
                            <Select>
                                <Option value='0'>0档</Option>
                                <Option value='1'>1档</Option>
                                <Option value='2'>2档</Option>
                                <Option value='3'>3档</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='空调防冻' name='air_antifreeze_state' rules={[{ required:true, message:'信息不能为空' }]}>
                            <Select>
                                <Option value='1'>开</Option>
                                <Option value='0'>关</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                :
                null
            }
            {
                taskType === '2' 
                ?
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label='空调温度' name='air_temp' rules={[{ required:true, message:'信息不能为空' }]}>
                            <InputNumber min={0} max={99} style={{ width:'100%' }} placeholder='温度范围为0~99℃' />
                        </Form.Item>
                    </Col>
                </Row>
                :
                null
            }
            <Row gutter={24}> 
                <Col span={12}>
                    <Form.Item label='重复类型' name='repeat_type' rules={[{ required:true, message:'信息不能为空' }]}>
                        <Select>
                            <Option value='1'>周</Option>
                            <Option value='2'>月</Option>
                            <Option value='3'>年</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="重复日期" 
                        shouldUpdate={(prevValues, currentValues) => prevValues.repeat_type !== currentValues.repeat_type}
                        rules={[{ required:true, message:'信息不能为空' }]}
                    >
                        {({ getFieldValue }) => {           
                            return (                          
                                getFieldValue('repeat_type') === '1'
                                ?
                                <Select mode='multiple' maxTagCount={1} value={weekData} onChange={value=>{
                                    setWeekData(value);
                                }}>
                                    {
                                        weeks.map(item=>(
                                            <Option value={item}>{ weeksMap[item] }</Option>
                                        ))
                                    }
                                </Select>
                                :
                                <DateCom currentDate={currentDate} onChangeDate={value=>setCurrentDate(value)} />                            
                            )
                            
                        }}
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label='执行时间' name='time' rules={[ { required:true, message:'请选择执行时间'}]}>
                        <TimePicker style={{ width:'100%' }} locale={zhCN} allowClear={false} />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item { ...tailLayout} >
                <Button size='large' type='primary' htmlType='submit' style={{ marginRight:'14px' }}>确定</Button>
                <Button size='large' onClick={onClose}>取消</Button>
            </Form.Item>
        </Form>
    )
}

export default AddPlanForm;