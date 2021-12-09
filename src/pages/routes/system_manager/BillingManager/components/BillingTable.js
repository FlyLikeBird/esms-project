import React, { useState, useEffect } from 'react';
import { Table, Tag, Modal, Form, Radio, Input, Button, message } from 'antd';
import style from '@/pages/routes/IndexPage.css';
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
function BillingTable({ dispatch, rateInfo }){
    let [form] = Form.useForm();
    let [visible, setVisible] = useState(false);
    let columns = [
        { title:'计费类型', dataIndex:'calc_type', render:(value)=>{
            return <Tag color='blue'>{ value === 1 ? '需量' : '容量'}计费</Tag>
        } },
        { title:'变压器容量(KVA)', dataIndex:'total_kva' },
        { title:'容量基本电费单价(元/KVA)', dataIndex:'kva_price'},
        { title:'需量基本电费单价(元/KW)', dataIndex:'demand_price' },
        { title:'操作', render:(row)=>{
            return <span style={{ color:'#1890ff', cursor:'pointer' }} onClick={()=>setVisible(true)}>编辑</span>
        }}
    ];
    useEffect(()=>{
        form.setFieldsValue({
            calc_type:rateInfo.calc_type,
            total_kva:rateInfo.total_kva,
            kva_price:rateInfo.kva_price,
            demand_price:rateInfo.demand_price
        });
    },[]);
    return (
        <div>
            <Table
                className={style['self-table-container'] + ' ' + style['dark'] + ' ' + style['no-space']}
                columns={columns}
                dataSource={[{ calc_type:rateInfo.calc_type, total_kva:rateInfo.total_kva, kva_price:rateInfo.kva_price, demand_price:rateInfo.demand_price }]}
                bordered={true}
                pagination={false}
            />
            <Modal
                visible={visible}
                footer={null}
                width="50%"
                destroyOnClose={true}
                bodyStyle={{ padding:'40px'}}
                closable={false}
                onCancel={()=>setVisible(false)}
            >
                <Form form={form} {...layout} onFinish={values=>{
                    new Promise((resolve, reject)=>{
                        values.rate_id = rateInfo.rate_id;
                        dispatch({ type:'billing/editRate', payload:{ resolve, reject, values }})
                    })
                    .then(()=>{
                        setVisible(false);
                    })
                    .catch(msg=>message.info(msg))
                }}>
                    <Form.Item name='calc_type' label="计费类型" rules={[{ required: true, message:'计费类型不能为空' }]}>
                        <Radio.Group>
                            <Radio value={1}>按需量计费</Radio>
                            <Radio value={2}>按容量计费</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name='total_kva' label="变压器容量(KVA)" rules={[{ required: true, message:'变压器容量不能为空' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='kva_price' label="容量基本电费单价(元/KVA)" rules={[{ required: true, message:'容量基本电费单价不能为空' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='demand_price' label="需量基本电费单价(元/KW)" rules={[{ required: true, message:'需量基本电费单价不能为空' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                        <Button type="primary" htmlType="submit">
                            确定
                        </Button>
                        <Button type="primary" style={{margin:'0 10px'}} onClick={()=>setVisible(false)}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.rateInfo !== nextProps.rateInfo ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(BillingTable, areEqual);