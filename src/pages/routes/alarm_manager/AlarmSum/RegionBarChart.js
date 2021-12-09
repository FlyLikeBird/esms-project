import React from 'react';
import ReactEcharts from 'echarts-for-react';

let pattern = /\s/g;
// console.log(data);
function findMaxValue(arr){
    if ( arr && arr.length ){
        return arr.concat().sort((a,b)=>b.cnt - a.cnt )[0];
    } else {
        return { cnt:0 };
    }
}
function RegionBarChart({ data, containerWidth }){
    let textColor = '#b0b0b0';
    let maxValue = findMaxValue(data).cnt;
    let sumValue = 0; 
    data.forEach(item=>{
        sumValue += item.cnt;
    });
    let option = {
        tooltip:{
            trigger:'axis'
        },
        yAxis: {
            type: 'category',
            axisTick:{ show:false },
            data: data.map(i=>i.region_name),
            inverse:true,
            axisLabel:{
                color:textColor,
                formatter:value=>{
                    let str = value;
                    if ( value.length > 8 ) {
                        str = value.substring(0, 8) + '...'
                    } else {
                        str = value;
                    }
                    str = str.replace(pattern,'');
                    
                    return str;
                }
            }
        },
        grid:[
            {
                top:40,
                bottom:20,
                left:40,
                right:80,
                containLabel:true
            },
            // {
            //     top:40,
            //     bottom:20,
            //     left:120,
            //     right:40,
            // },
        ], 
        dataZoom:[
            {
                show:true,
                right:6,
                yAxisIndex:0,
                startValue:0,
                endValue:10,
                textStyle:{
                    color:textColor
                }
            }
        ],
        title:{
            text:'区域告警分析',
            left:20,
            top:10,
            textStyle:{
                color:'#fff',
                fontSize:14
            }
        },
        xAxis:{
            type: 'value',
            position:'top',
            axisLabel:{ color:textColor, show:false },
            axisLine:{ show:false },
            axisTick:{ show:false },
            splitLine:{ show:false }
        },
        graphic:{
            type:'text',
            right: containerWidth <= 1440 ? 30 : 60,
            top:20,
            style: {
                fill: textColor,
                text: '故障数     故障占比',
                font: '12px sans-serif'
            }  
        },
        series:[ 
            {
                data:data.map(i=>i.cnt),
                type: 'bar',
                barWidth:10,
                // showBackground:true,
                // backgroundStyle:{
                //     color:'rgba(134,26,248,0.1)',                  
                // },
                itemStyle:{
                    color: {
                        type: 'linear',
                        x: 0,                 // 左上角x
                        y: 0,                 // 左上角y
                        x2: 1,                // 右下角x
                        y2: 0,                // 右下角y
                        colorStops: [{
                            offset: 0, color:'#8319f8' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#aa1dfb' // 100% 处的颜色
                        }],
                    },
                    barBorderRadius:6
                },
                
            },
            {
                data:data.map(i=>maxValue),
                type: 'bar',
                barWidth:10,
                barGap:'-100%',
                itemStyle:{
                    color:'rgba(134,26,248,0.1)',
                    barBorderRadius:6
                },
                label:{
                    show: true,
                    position:'right',
                    // distance: app.config.distance,
                    align:'left',
                    verticalAlign:'middle',
                    offset:[10,0],
                    formatter:params=>{      
                        return `{red|${data[params.dataIndex].cnt}}{weight|${Math.round(data[params.dataIndex].cnt/sumValue * 100)}%}`
                        // console.log(params);
                    },
                    // formatter: '{red|hello}  {weight|world}',
                    fontSize: 12,
                    rich: {
                        red:{
                            width: 36,
                            color:'red',
                            fontSize:14,
                        },
                        weight:{
                            width:36,
                            align:'left',
                            color:'#fff',
                            fontSize:14,
                            align:'center'
                        }

                    },
                },
                tooltip:{
                    show:false
                }
            }
        ]
    };
    // if ( !forIndex ){
    //     option['graphic'] = {
    //         type:'text',
    //         right:60,
    //         top:20,
    //         style: {
    //             fill: textColor,
    //             text: '故障数     故障占比',
    //             font: '12px sans-serif'
    //         }                  
    //     }
    // }
    return (
        <ReactEcharts 
            style={{ height:'100%' }}
            notMerge={true}
            option={option}
                
        />
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.containerWidth !== nextProps.containerWidth ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(RegionBarChart, areEqual);