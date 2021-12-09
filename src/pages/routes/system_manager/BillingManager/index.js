import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Tabs, Select, Spin, Switch, Form, Skeleton, Input, Tag } from 'antd';
import { FireOutlined, DownloadOutlined, DoubleLeftOutlined, DoubleRightOutlined, PlusOutlined } from '@ant-design/icons'
import style from '@/pages/routes/IndexPage.css';
import EleBilling  from './components/EleBilling';
import WaterBilling from './components/WaterBilling';
const { Option } = Select;
const { TabPane } = Tabs;

const allTimeType = {
    1:'峰时段',
    2:'平时段',
    3:'谷时段',
    4:'尖时段'
};

function BillingManager({ dispatch, user, fields }){
    let { companyList, currentCompany, theme } = user;
    let { energyList, energyInfo } = fields;
    useEffect(()=>{
        dispatch({ type:'billing/init'});
        return ()=>{
            dispatch({ type:'billing/reset'});
        }
    },[]);
    
    return (
       <div className={style['card-container']}>
            <EleBilling />
            {/* <Tabs className={style['custom-tabs']} activeKey={energyInfo.type_id} onChange={activeKey=>{
                let temp = energyList.filter(i=>i.type_id === activeKey)[0];
                dispatch({ type:'fields/toggleEnergyInfo', payload:temp });
                dispatch({ type:'fields/fetchField'});
            }}>
                {
                    energyList.map((item,index)=>(
                        <TabPane key={item.type_id} tab={item.type_name}>
                            {
                                item.type_code === 'ele' 
                                ?
                                <EleBilling />
                                :
                                item.type_code === 'water'
                                ?
                                <WaterBilling />
                                :
                                null
                            }
                        </TabPane>
                    ))
                }
            </Tabs> */}
           </div>
    )
};

BillingManager.propTypes = {
};

export default connect( ({ user, fields }) => ({ user, fields }))(BillingManager);