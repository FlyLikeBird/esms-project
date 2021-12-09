import React from 'react';
import ReactEcharts from 'echarts-for-react';

function LineChart({ xData, yData, y2Data, y3Data, title, multi }){
    const seriesData = [];
    if ( multi ){
        if ( yData ) {
            seriesData.push({
                type:'line',
                name:'A相',
                data:yData,
                itemStyle:{
                    color:'#eff400'
                },
                symbolSize:0
            });
        }
        if ( y2Data ){
            seriesData.push({
                type:'line',
                name:'B相',
                data:y2Data,
                itemStyle:{
                    color:'#00ff00'
                },
                symbolSize:0
            });
        }
        if ( y3Data ){
            seriesData.push({
                type:'line',
                name:'C相',
                data:y3Data,
                itemStyle:{
                    color:'#ff0000'
                },
                symbolSize:0
            });
        }
    } else {
        seriesData.push({
            type:'line',
            data:yData,
            itemStyle:{
                color:'#eff400'
            },
            symbolSize:0
        });
    }
    
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                tooltip:{
                    trigger:'axis'
                },
                title:{
                    text:title,
                    left:10,
                    top:6,
                    textStyle:{
                        fontSize:14,
                        color:'#fff'
                    }
                },
                grid:{
                    top:50,
                    bottom:20,
                    left:20,
                    right:20,
                    containLabel:true
                },
                legend:{
                    left:'center',
                    top:10,
                    show:seriesData.length > 1 ? true : false ,
                    data:seriesData.map(i=>i.name),
                    textStyle:{
                        color:'#b5b5bd'
                    }
                },
               
                xAxis:{
                    type:'category',
                    axisTick:{ show:false },
                    axisLine:{
                        lineStyle:{
                            color:'#4e6b91'
                        }
                    },
                    axisLabel:{
                        color:'#b5b5bd'
                    },
                    data:xData
                },
                yAxis:{
                    type:'value',
                    splitLine:{
                        lineStyle:{
                            color:'#21213c'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        color:'#b5b5bd'
                    },
                },
                series:seriesData
            }}
        />
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data  ) {
        return false;
    } else {
        return true;
    }
}
export default LineChart;