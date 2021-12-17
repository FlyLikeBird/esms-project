import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Menu, Spin } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import ListContainer from './ListContainer';
import TypeBarChart from './TypeBarChart';
import LineChart from './LineChart';
import RegionBarChart from './RegionBarChart';

function AlarmSum({ dispatch, user, alarm }){
    let { sumAlarm } = alarm;
    let loaded = Object.keys(sumAlarm).length ? true : false; 
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'alarm/fetchAlarmSum'});
        }
    },[user.authorized]);
    return (
        <div style={{ height:'100%' }}>
            <div style={{ height:'50%', paddingBottom:'1rem', paddingRight:'0' }}>
                <div className={style['card-container-wrapper']} style={{ width:'50%', paddingBottom:'0' }}>
                    <div className={style['card-container']} style={{ overflow:'hidden' }}>
                        {
                            loaded 
                            ?
                            <TypeBarChart data={sumAlarm.typeRank} />
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                </div>
                <div className={style['card-container-wrapper']} style={{ width:'50%', paddingBottom:'0', paddingRight:'0' }}>
                    <div className={style['card-container']} style={{ overflow:'hidden' }}>
                        {
                            loaded 
                            ?
                            <LineChart data={sumAlarm.warningView} />
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                </div>
            </div>
            <div style={{ height:'50%' }}>
                <div className={style['card-container-wrapper']} style={{ width:'50%', paddingBottom:'0' }}>
                    <div className={style['card-container']} style={{ overflow:'hidden' }}>
                        {
                            loaded 
                            ?
                            <RegionBarChart data={sumAlarm.regionRank} containerWidth={user.containerWidth} />
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                </div>
                <div className={style['card-container-wrapper']} style={{ width:'50%', paddingBottom:'0', paddingRight:'0' }}>
                    <div className={style['card-container']}>
                        {
                            loaded 
                            ?
                            <ListContainer data={sumAlarm.warningRecords || []} />
                            :
                            <Spin size='large' className={style['spin']} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default connect(({ user, alarm })=>({ user, alarm }))(AlarmSum);