import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu, Button } from 'antd';
import { PlusOutlined, CalendarOutlined, EllipsisOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import InnerStyle from './AddPlanForm.css';
import TableContainer from './TableContainer';
// import PlanList from './PlanList';

function TimePlanner({ dispatch, switchMach, menu }){
    let { gatewayList, switchList, taskLoading, taskList, total, currentPage } = switchMach;
    useEffect(()=>{
        dispatch({ type:'switchMach/initPlanner'});
        return ()=>{
            dispatch({ type:'switchMach/resetTimePlanner'});
        }
    },[])
    let btnMaps = {};
    if ( menu.child && menu.child.length ){
        menu.child.forEach(item=>{
            btnMaps[item.menu_code] = true;
        })
    }
    return (
        <div>
            <div className={style['card-container']}>
                <TableContainer 
                    dispatch={dispatch}
                    gatewayList={gatewayList}
                    switchList={switchList}
                    taskLoading={taskLoading}
                    data={taskList}
                    total={total}
                    currentPage={currentPage}
                    btnMaps={btnMaps}
                />
            </div>
        </div>
    );
}

export default connect(({ switchMach })=>({ switchMach }))(TimePlanner);