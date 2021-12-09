import React from 'react';
import ReactEcharts from 'echarts-for-react';

let pattern = /\s/g;
// console.log(data);
function LineChart({ data }){
    let textColor = '#b0b0b0';
    return (
        <ReactEcharts 
            style={{ height:'100%' }}
            notMerge={true}
            option={{
                tooltip:{
                    trigger:'axis'
                },
                xAxis: {
                    type: 'category',
                    axisTick:{ show:false },
                    data:data.date,
                    axisLabel:{
                        color:textColor,
                    }
                },
                grid:{
                    top:50,
                    bottom:20,
                    left:20,
                    right:30,
                    containLabel:true
                },
                title:{
                    text:'故障类型分析',
                    left:20,
                    top:10,
                    textStyle:{
                        color:'#fff',
                        fontSize:14
                    }
                },
                itemStyle:{
                    color:'#ff7b7b',
                },
                yAxis:[
                {
                    type: 'value',
                    axisLabel:{ color:textColor },
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#22264b'
                        }
                    }
                },
                {
                    type: 'value',
                    name:'(单位:次)',
                    nameTextStyle:{ color:textColor },
                    axisLabel:{ color:textColor },
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#22264b'
                        }
                    }
                }
                ],
                series:[{
                    data:data.value,
                    type: 'line',
                    symbol:'none',
                    // barWidth:30,
                    itemStyle:{
                        color:'#4df8e2'
                    },
                    label:{
                        formatter:'{b}'
                    }
                }]
            }}
        />
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(LineChart, areEqual);