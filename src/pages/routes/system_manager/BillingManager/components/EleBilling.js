import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Button, Card, Modal, Select, Spin, Switch, message, Popconfirm, Form, Skeleton, Input, Tag } from 'antd';
import { FireOutlined, DownloadOutlined, DoubleLeftOutlined, DoubleRightOutlined, PlusOutlined } from '@ant-design/icons'
import BillingForm from './BillingForm';
import BillingTable from './BillingTable';
import style from '@/pages/routes/IndexPage.css';

const { Option } = Select;

const allTimeType = {
    1:'峰时段',
    2:'平时段',
    3:'谷时段',
    4:'尖时段'
};
function EleBilling({ dispatch, user, billing }){
    let { companyList, currentCompany, theme } = user;
    let { list, visible, is_actived, rateInfo, tplList } = billing;
    let [tplVisible, setTplVisible] = useState(false);
    let [type, setType] = useState('');
    let [ form ] = Form.useForm();
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'billing/reset'});
        }
    },[]);
    const columns = [
        {
            title: '季度',
            dataIndex: 'quarter_name'
        },
        {
            title: '月份',
            dataIndex: 'month',
            render:(value, row)=>{
                return <div>{`${row.begin_month}月-${row.end_month}月`}</div>
            }
        },
        {
            title: '时段',
            dataIndex: 'tel',
            render: (value, row, index) => {
                const renderNode = (
                    <div>
                        {
                            row.timeList.map((time,index)=>(
                                 <div className={style['item']} key={index}>{`${allTimeType[time.time_type]}: ${time.begin_time}点 - ${time.end_time}点`}</div>
                            ))
                        }
                    </div>
                )
                let obj = {
                    children:renderNode,
                    props:{ className : 'multi-table-cell' }
                }
                return obj;
            },
        },
        {
            title: '费率(元/kwh)',
            dataIndex: 'fee_rate',
            render: (value, row)=>{
                const renderNode = (
                    <div>
                        {
                            row.timeList.map((time,index)=>(
                                 <div className={style['item']} key={index}><span style={{color:'#1890ff'}}>{`${time.fee_rate}元`}</span></div>
                            ))
                        }
                    </div>
                )
                let obj = {
                    children:renderNode,
                    props:{ className : 'multi-table-cell' }
                }
                return obj;
            }
        },
        {
            title:'操作',
            dataIndex:'action',
            render:(value, row)=>{
                return (
                    <div>
                        <a onClick={()=>dispatch({type:'billing/toggleVisible', payload:{ visible:true, forEdit:true, prevItem:row}})}>编辑</a>
                        <Popconfirm title="确定删除此计费方案吗?" onText="确定" cancelText="取消" onConfirm={()=>dispatch({type:'billing/delete', payload:row.quarter_id })}><a style={{margin:'0 10px'}}>删除</a></Popconfirm>
                    </div>
                )
            }
        }
    ]; 
    return (
        Object.keys(rateInfo).length 
        ?
            <div className={style['card-container']}>
                <div style={{ padding:'1rem', display:'flex', alignItems:'center' }}>
                    <Button type="primary" onClick={() => dispatch({type:'billing/toggleVisible', payload:{visible:true}})}>添加计费规则</Button>
                    <Button type='primary' style={{ margin:'0 1rem' }} onClick={()=>{ setTplVisible(true) }}>选择模板</Button>
                    {/* <span>目前状态:</span>
                    <Switch style={{marginLeft:'6px'}} checked={is_actived} checkedChildren="激活中" unCheckedChildren="激活计费" onChange={checked=>{
                        new Promise((resolve, reject)=>{
                            dispatch({type:'billing/active', payload:{ resolve, reject }});
                        })
                        .then(()=>{
                            dispatch({type:'billing/toggleActive'})
                        })
                        .catch(msg=>{
                            message.error(msg);
                        })
                    }} /> */}
                    {/* <div>
                        <span style={{ marginLeft:'20px', paddingRight:'20px', borderRight:`1px solid ${borderColor}` }}>
                            <span>计费类型:</span>
                            <Tag color='blue' style={{ marginLeft:'4px' }}>按{ +rateInfo.calc_type === 1 ? '需量' : '容量'}计费</Tag>
                        </span>
                    </div>
                    <div>
                        <span style={{ marginLeft:'20px', paddingRight:'20px', borderRight:`1px solid ${borderColor}` }}>
                            <span>变压器容量(kva):</span>
                            <span style={{color:'#1890ff', fontSize:'1.2rem', fontWeight:'bold', marginLeft:'4px' }}>{ Math.round(rateInfo.total_kva) }</span>                            
                        </span>
                    </div>
                    <div>
                        <span style={{ marginLeft:'20px', paddingRight:'20px', borderRight:`1px solid ${borderColor}` }}>
                            <span>容量基本电费单价(元/kva):</span>
                            <span style={{color:'#1890ff', fontSize:'1.2rem', fontWeight:'bold', marginLeft:'4px'  }}>{ Math.round(rateInfo.kva_price) }</span>                            
                        </span>
                    </div>
                    <div>
                        <span style={{ marginLeft:'20px', paddingRight:'20px' }}>
                            <span>需量基本电费单价(元/kw):</span>
                            <span style={{color:'#1890ff', fontSize:'1.2rem', fontWeight:'bold', marginLeft:'4px' }}>{ Math.round(rateInfo.demand_price) }</span>                            
                        </span>
                    </div> */}
                        {/* <Button type="primary" shape="round" size="small" onClick={()=>{
                            setFormVisile(true);
                        }}>设置计费信息</Button> */}
                   
                </div>
                {/* <BillingTable dispatch={dispatch} rateInfo={rateInfo} /> */}
                <Table
                    className={style['self-table-container'] + ' ' + style['dark'] + ' ' + style['no-space']}
                    columns={columns}
                    dataSource={list}
                    bordered={true}
                    pagination={false}
                    rowKey="quarter_id"
                    locale={{emptyText:'还没有配置计费方案'}}

                />
                <Modal
                    visible={visible}
                    footer={null}
                    width="50%"
                    destroyOnClose={true}
                    bodyStyle={{ padding:'40px'}}
                    closable={false}
                    onCancel={()=>dispatch({type:'billing/toggleVisible', payload:{ visible:false }})}
                >
                    <BillingForm />
                </Modal>
                <Modal
                    visible={tplVisible}
                    footer={null}
                    destroyOnClose={true}
                    onCancel={()=>setTplVisible(false)}
                >
                    <Select style={{ width:'300px', margin:'2rem 0' }} value={type} onChange={value=>setType(value)}>
                        {
                            tplList.map((item)=>(
                                <Option value={item.tpl_id}>{ item.tpl_name}</Option>
                            ))
                        }
                    </Select>
                    <div>
                        <Button type='primary' style={{ marginRight:'1rem' }} onClick={()=>{
                            if ( type ){
                                new Promise((resolve ,reject)=>{
                                    dispatch({ type:'billing/setBillingTpl', payload:{ tpl_id:type, rate_id:rateInfo.rate_id, resolve, reject }})
                                })
                                .then(()=>{
                                    message.success('复制计费模板成功');
                                    setTplVisible(false);
                                })
                                .catch(msg=>message.info(msg))
                            } else {
                                message.info('请选择要复制的计费模板')
                            }
                        }}>应用模板</Button>
                        <Button onClick={()=>{ setTplVisible(false) }}>取消</Button>
                    </div>
                </Modal>
            </div>
        :
        <Skeleton active className={style['skeleton']} /> 
    )
};

EleBilling.propTypes = {
};

export default connect( ({ user, billing }) => ({ user, billing }))(EleBilling);