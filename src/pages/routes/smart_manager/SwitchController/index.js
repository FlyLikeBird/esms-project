import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Skeleton, Tabs } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import Loading from '@/pages/components/Loading';
import TempFormContainer from './TempFormContainer';
import LimitEleFormContainer from './LimitEleFormContainer';
import ControllerFormContainer from './ControllerFormContainer';
import AutoTripFormContainer from './AutoTripFormContainer';
import AutoCombineFormContainer from './AutoCombineFormContainer';
const { TabPane } = Tabs;

let tabList = [
    { tab:'温控参数', key:'1'},
    { tab:'空开控制参数', key:'2' },
    { tab:'空开限制电流', key:'3'},
    { tab:'自动脱扣参数', key:'4'},
    { tab:'自动重合闸参数', key:'5'}
];

let componentMaps = {
    '1':<TempFormContainer />,
    '2':<ControllerFormContainer />,
    '3':<LimitEleFormContainer />,
    '4':<AutoTripFormContainer />,
    '5':<AutoCombineFormContainer />
}

function SwitchController({ dispatch, switchMach }){
    let { gatewayList, gatewayLoading, currentGateway, switchList, switchLoading, currentSwitch, optionType, optionLoading } = switchMach;
   
    return (
        <div className={style['card-container']}>
            {
                optionLoading 
                ?
                <Loading />
                :
                null
            }
            {
                gatewayLoading 
                ?
                <Spin className={style['spin']} />
                :
                <Tabs className={style['custom-tabs'] + ' ' + style['flex-tabs']} activeKey={optionType} onChange={activeKey=>{
                    dispatch({ type:'switchMach/toggleOptionType', payload:activeKey });
                }}>
                    {
                        tabList.map((item,index)=>(
                            <TabPane key={item.key} tab={item.tab}>{ item.key === optionType && componentMaps[optionType] }</TabPane>
                        ))
                    }
                </Tabs>
            }
        </div>
    );
}
export default connect(({ switchMach }) => ({ switchMach }))(SwitchController);