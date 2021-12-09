import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Button, Card, Modal, Select, Spin, Switch, message, Popconfirm, Form, Input } from 'antd';
import { FireOutlined, DownloadOutlined, DoubleLeftOutlined, DoubleRightOutlined, PlusOutlined } from '@ant-design/icons'
import RuleForm from './components/RuleForm';
import style from '@/pages/routes/IndexPage.css';

const { Option } = Select;

function AlarmSetting({ dispatch, user, alarm, menu }){
    let { companyList, currentCompany } = user;
    let { ruleList, ruleType, ruleMachs } = alarm;
    let [visibleInfo, setVisible] = useState({ visible:false, forEdit:false });
    let [currentRule, setCurrentRule] = useState({});
    useEffect(()=>{
        dispatch({ type:'alarm/initAlarmSetting'});
        return ()=>{
           
        }
    },[]);
    let btnMaps = {};
    if ( menu.child && menu.child.length ){
        menu.child.forEach(item=>{
            btnMaps[item.menu_code] = true;
        })
    }
    const columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return index + 1;
                // return `${ ( pageNum - 1) * pagesize + index + 1}`;
            }
        },
        { title:'规则名称', dataIndex:'rule_name' }, 
        // { title:'所属公司', dataIndex:'company_name' },
        { title:'告警等级(1级为最高)', dataIndex:'level' },
        { title:'告警类型', dataIndex:'type_name'},
        { title:'告警最小阈值', dataIndex:'warning_min', render:(value)=>(<span style={{ color:'#1890ff'}}>{ value }</span>)},
        { title:'告警最大阈值', dataIndex:'warning_max', render:(value)=>(<span style={{ color:'#1890ff'}}>{ value }</span>)},
        { 
            title:'单位',
            dataIndex:'unit_name',
            render:(value)=>{
                if ( !value ){
                    return '-- --'
                } else {
                    return value;
                }
            }
        },
        { 
            title:'创建时间',  
            dataIndex:'create_time',
        },
        {
            title:'操作',
            render:(row)=>{
                return (
                    <div>
                        {
                            btnMaps['sw_warning_rule_edit']
                            ?
                            <a onClick={()=>{
                                setCurrentRule(row);
                                setVisible({ visible:true, forEdit:true });
                            }}>修改</a>
                            :
                            null
                        }
                        {
                            btnMaps['sw_warning_rule_del']
                            ?
                            <Popconfirm title="确定删除此条规则吗?" onText="确定" cancelText="取消" onConfirm={()=> dispatch({type:'alarm/deleteRule', payload:row.rule_id })}><a style={{margin:'0 10px'}}>删除</a></Popconfirm>
                            :
                            null
                        }

                    </div>
                )
            }
        }
    ];

    return (
            <div style={{ height:'100%' }}>
                <div className={style['card-container']}>
                    {
                        btnMaps['sw_warning_rule_add']
                        ?
                        <div style={{ padding:'1rem'}}>
                            <Button type="primary"  onClick={() => setVisible({ visible:true, forEdit:false }) }>添加告警规则</Button>                
                        </div>
                        :
                        null
                    }
                    
                    <Table
                        className={style['self-table-container'] + ' ' + style['dark'] }
                        columns={columns}
                        dataSource={ruleList}
                        locale={{emptyText:'还没有设置规则'}}
                        bordered={true}
                        rowKey="rule_id"
                        pagination={false}
                        // onChange={pagination=>{
                        //     dispatch({ type:'alarm/setPageNum', payload:pagination.current });
                        //     dispatch({ type:'alarm/fetchRecordList', payload:{ cate_code:activeKey, keywords:value }} )
                        // }}
                    />
                    <Modal
                        visible={visibleInfo.visible}
                        footer={null}
                        width="40%"
                        destroyOnClose={true}
                        bodyStyle={{ padding:'40px'}}
                        closable={false}
                        className={style['modal-container']}
                        onCancel={()=>setVisible({ visible:false, forEdit:false })}
                    >
                        <RuleForm 
                            visibleInfo={visibleInfo} 
                            ruleType={ruleType}
                            currentRule={currentRule} 
                            ruleMachs={ruleMachs}
                            onClose={()=>setVisible({ visible:false, forEdit:false })} 
                            onAdd={values=>dispatch({type:'alarm/addRule', payload:values })}
                            onUpdate={values=>dispatch({type:'alarm/updateRule', payload:values})}
                        />
                    </Modal>
                </div>
            </div>    
             
    )
};

AlarmSetting.propTypes = {
};

export default connect( ({ user, alarm }) => ({ user, alarm }))(AlarmSetting);