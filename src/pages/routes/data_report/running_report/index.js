import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import style from '@/pages/routes/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import TableContainer from './TableContainer';
import Loading from '@/pages/components/Loading';

function RunningReport({ dispatch, user, dataReport }){
    let { timeType, startDate, endDate, containerWidth } = user;
    let { sourceData, isLoading, currentPage } = dataReport;
    let sidebar = (
        <div>
            <div className={style['card-container-wrapper']} style={{ display:'block', height:'40%', paddingRight:'0' }}>
                <div className={style['card-container']}></div>
            </div>
            <div className={style['card-container-wrapper']} style={{ display:'block' ,height:'60%', paddingRight:'0', paddingBottom:'0' }}>
                <div className={style['card-container']}></div>
            </div>
        </div>
    );
    let content = (
        <div>
            <div className={style['card-container']}>
                {
                    isLoading 
                    ?
                    <Loading />
                    :
                    null
                }
                <TableContainer data={sourceData} dispatch={dispatch} currentPage={currentPage} timeType={timeType} startDate={startDate} endDate={endDate} containerWidth={containerWidth} />
            </div>
        </div>
    );
    useEffect(()=>{
        dispatch({ type:'dataReport/initEleReport' });
        return ()=>{
            dispatch({ type:'dataReport/cancelEleReport'});
        }
    },[])
    return <ColumnCollapse sidebar={sidebar} content={content} />
}

export default connect(({ user, dataReport })=>({ user, dataReport }))(RunningReport);