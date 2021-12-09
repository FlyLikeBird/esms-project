import React from 'react';
import ReactEcharts from 'echarts-for-react';


let pattern = /\s/g;
function TypeBarChart({ data }){
    let textColor = '#b0b0b0';
    let seriesData = [];
    if ( data ){
        Object.keys(data).forEach(key=>{
            seriesData.push({ name:key, value:data[key] });
        })
    }
    
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
                    data: seriesData.map(i=>i.name),
                    axisLabel:{
                        color:textColor,
                        // fontSize:,
                        formatter:value=>{
                            if ( seriesData.length && seriesData.length > 5 ) {
                                let str = value;
                                if ( value.length > 8 ) {
                                    str = value.substring(0, 8);
                                } else {
                                    str = value;
                                }
                                str = str.replace(pattern,'');

                                return str.split('').join('\n');
                            } else {
                                return value;
                            }                  
                        }
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
                    data:seriesData.map(i=>i.value),
                    type: 'bar',
                    barMaxWidth:14,
                    // barWidth:30,
                    itemStyle:{
                        color: {
                            type: 'linear',
                            x: 0,                 // 左上角x
                            y: 0,                 // 左上角y
                            x2: 0,                // 右下角x
                            y2: 1,                // 右下角y
                            colorStops: [{
                                offset: 0, color:'#fea812' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#ffca1f' // 100% 处的颜色
                            }],
                        },
                        barBorderRadius:6
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
export default React.memo(TypeBarChart, areEqual);