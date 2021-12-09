import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Skeleton } from 'antd';
import style from '@/pages/routes/IndexPage.css';
// import MachTree from './MachTree';
import FormContainer from './FormContainer';
import Loading from '@/pages/components/Loading';

function AutoCombine({ dispatch, switchMach }){
    let { currentSwitch, autoCombineInfo, autoCombineLoading } = switchMach;
    useEffect(()=>{
        dispatch({ type:'switchMach/initAutoCombine' });
    },[]);
    return (
        <div className={style['card-container']}>  
            {
                autoCombineLoading 
                ?
                <Loading />
                :
                null
            }        
            <FormContainer dispatch={dispatch} data={autoCombineInfo} />              
        </div>
    );
}
export default connect(({ switchMach }) => ({ switchMach }))(AutoCombine);