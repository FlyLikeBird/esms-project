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
    let temp = yData.concat(y2Data);
    temp.sort((a,b)=>b-a);
    let maxValue = temp[0] || 0;
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
                legend:{
                    data:['安全告警','通讯告警'],
                    icon:'circle',
                    itemWidth:8,
                    itemHeight:8,
                    textStyle:{
                        color:'#fff'
                    }
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
                    min:0,
                    max:maxValue + 20,
                    axisTick:{ show:false },
                    axisLabel:{ color:'#b0b0b0' },
                    axisLine:{ show:false },
                    splitNumber:8,
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