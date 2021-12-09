import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import style from './AgentManager.css';

function LineChart({ data }){
    let [dataType, setDataType] = useState('energy');
    let seriesData = [];
    seriesData.push({
        type:'line',
        name:dataType === 'energy' ? '能耗' : '成本',
        symbol:'none',
        itemStyle:{
            color:'#3294d7',
        },
        lineStyle:{
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10,
            shadowOffsetY:2
        },
        areaStyle:{
            color:{        
                type:'linear',
                x:0,
                y:0,
                x2:0,
                y2:1,
                colorStops: [{
                    offset: 0, color: '#3294d7' // 0% 处的颜色
                }, {
                    offset: 1, color: 'transparent' // 100% 处的颜色
                }]    
            }
        },
        data:data[dataType]
    })
    return (
        <div style={{ height:'100%'}}>
            <div style={{ position:'absolute', right:'1rem', top:'-4px', zIndex:'2' }}>
                <span onClick={()=>setDataType('energy')} className={ dataType === 'energy' ? style['btn'] + ' ' + style['selected'] : style['btn']}>能耗</span>
                <span onClick={()=>setDataType('cost')} className={ dataType === 'cost' ? style['btn'] + ' '+ style['selected'] : style['btn']}>成本</span>
            </div>
            <ReactEcharts
                notMerge={true}
                style={{ height:'100%' }}
                option={{
                    tooltip:{
                        trigger:'axis'
                    },
                    grid:{
                        top:30,
                        bottom:6,
                        left:10,
                        right:20,
                        containLabel:true
                    },
                    xAxis: {
                        type: 'category',
                        axisTick:{ show:false },
                        axisLabel:{ color:'#b0b0b0' },
                        axisLine:{
                            show:true,
                            lineStyle:{
                                color:'rgba(18, 168, 254, 0.8)'
                            }
                        },
                        data:data.date
                    },
                    yAxis: {
                        type: 'value',
                        name:dataType === 'energy' ? 'kwh' : '元',
                        nameTextStyle:{
                            color:'#b0b0b0'
                        },
                        nameGap:10,
                        axisTick:{ show:false },
                        axisLabel:{ color:'#b0b0b0' },
                        axisLine:{ show:false },
                        splitLine:{
                            lineStyle:{
                                type:'dashed',
                                color:'rgba(50, 148, 215, 0.3)'
                            }
                        }
                    },
                    series: seriesData
                }}
            />
        </div>
        
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data  ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(LineChart, areEqual);