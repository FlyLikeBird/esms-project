import React from 'react';
import ReactEcharts from 'echarts-for-react';

function LineChart({ xData, yData, y2Data }){
    let seriesData = [];
    seriesData.push({
        type:'line',
        name:'安全告警',
        symbol:'none',
        itemStyle:{
            color:'#16fbfd',
        },
        data:yData
    });
    seriesData.push({
        type:'line',
        name:'通讯告警',
        symbol:'none',
        itemStyle:{
            color:'#129cff'
        },
        data:y2Data
    });
    return (
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
                    data:xData
                },
                yAxis: {
                    type: 'value',
                    name:'次',
                    nameTextStyle:{
                        color:'#b0b0b0'
                    },
                    nameGap:10,
                    axisTick:{ show:false },
                    axisLabel:{ color:'#b0b0b0' },
                    axisLine:{ show:false },
                    interval:1,
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
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.xData !== nextProps.xData  ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(LineChart, areEqual);