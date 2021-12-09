import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Skeleton } from 'antd';
import style from '@/pages/routes/IndexPage.css';
// import MachTree from './MachTree';
import FormContainer from './FormContainer';

function SwitchSetter({ dispatch, switchMach }){
    let { gatewayList, gatewayLoading, currentGateway, switchList, switchLoading, switchOption, currentSwitch } = switchMach;
    useEffect(()=>{
        dispatch({ type:'switchMach/initSwitchOption' });
    },[])
    return (
        <div className={style['card-container']} style={{ overflowX:'auto', overflowY:'hidden' }}>
            <FormContainer dispatch={dispatch} data={switchOption} />
        </div>
    );
}
export default connect(({ switchMach }) => ({ switchMach }))(SwitchSetter);