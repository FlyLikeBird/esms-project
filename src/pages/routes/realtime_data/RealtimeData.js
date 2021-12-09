import React, { useEffect } from 'react';
import { Tabs, Tree, Spin, message } from 'antd';
import { connect } from 'dva';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import style from '@/pages/routes/IndexPage.css';
import ChartContainer from './ChartContainer';
const { TabPane } = Tabs;

function RealtimeData({ dispatch, user, switchMach, realtime }){
    let { timeType, startDate, endDate } = user;
    let { gatewayList, gatewayLoading, currentSwitch } = switchMach;
    let { chartInfo, chartLoading, optionType } = realtime;
   
    let sidebar = (
        <div>
        <div className={style['card-container'] + ' ' + style['topRadius']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
            <div className={style['card-title']}>网关列表</div>
            <div className={style['card-content']}>
                {
                    gatewayLoading
                    ?
                    <Spin className={style['spin']} />
                    :
                    <Tree
                        className={style['custom-tree']}
                        defaultExpandAll={true}
                        // expandedKeys={expandedKeys}
                        // onExpand={temp=>{
                        //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                        // }}
                        selectedKeys={[currentSwitch.key ]}
                        treeData={gatewayList}
                        onSelect={(selectedKeys, {node})=>{   
                            if ( node.is_gateway ) {
                                // 如果是网关设备
                                message.info('请选择网关下的空开设备');
                            } else {
                                // 如果是空开设备
                                if ( node.key !== currentSwitch.key ) {
                                    dispatch({ type:'switchMach/toggleSwitch', payload:node });
                                    dispatch({ type:'realtime/fetchChartInfo'});
                                }              
                            }                          
                           
                        }}
                    />
                }
            </div>
        </div>
        </div>
    );
    let content = (
        <div>
            <div className={style['card-container']} style={{ overflow:'hidden' }}>
                
                {
                    Object.keys(chartInfo).length 
                    ?
                    <ChartContainer theme='dark' data={chartInfo} loading={chartLoading} startDate={startDate} timeType={timeType} optionType={optionType} dispatch={dispatch} />
                    :
                    <Spin className={style['spin']} size='large' />
                }
            </div>
            
        </div>
    );
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'realtime/init'});                      
        }
    },[user.authorized])
    return <ColumnCollapse sidebar={sidebar} content={content} />
}

export default connect(({ user, switchMach, realtime })=>({ user, switchMach, realtime }))(RealtimeData);

