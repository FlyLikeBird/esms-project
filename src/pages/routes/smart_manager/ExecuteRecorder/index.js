import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu, Button } from 'antd';
import { PlusOutlined, CalendarOutlined, EllipsisOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import TableContainer from './TableContainer';
function ExecuteRecorder({ dispatch, switchMach }){
    let { actionList, actionLoading, currentPage, total } = switchMach;
    useEffect(()=>{
        dispatch({ type:'switchMach/fetchAction' });
    },[])
    return (
        <div className={style['card-container']}>
            <TableContainer dispatch={dispatch} data={actionList} loading={actionLoading} currentPage={currentPage} total={total} />
        </div>
    );
    
}

export default connect(({ switchMach })=>({ switchMach }))(ExecuteRecorder);