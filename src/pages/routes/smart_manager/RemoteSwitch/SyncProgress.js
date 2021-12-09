import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import ReactEcharts from 'echarts-for-react';

let timer = null;
function SyncProgress({ dispatch, syncGateways, currentGateway }){
    let [percent, setPercent] = useState(syncGateways[currentGateway.key]);
    useEffect(()=>{
        timer = setInterval(()=>{
            percent++;
            if ( percent >= 30 ){
                percent = 30;
                // 计时停止,
                clearInterval(timer);
                dispatch({ type:'switchMach/setSyncGateways', payload:{...syncGateways, [currentGateway.key]:null }});
                message.success('网关同步成功');
                return ;
            }
            setPercent(percent);
            dispatch({ type:'switchMach/setSyncGateways', payload:{ ...syncGateways, [currentGateway.key]:percent }});
        }, 1000)
        return ()=>{
            clearInterval(timer);
            timer = null;
        }
    },[])
    return (
        <ReactEcharts
            style={{ height:'100%', width:'100%' }}
            option={{
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        center:['50%','30%'],
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: percent, name:'', itemStyle:{ color:'rgb(82, 196, 26)' } },
                            {value: 30 - percent, itemStyle:{ color:'#191a2f' }},
                        ]
                    }
                ]
            }}
        />
    )
}

export default SyncProgress;