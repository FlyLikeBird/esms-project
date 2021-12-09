import React from 'react';
import ReactEcharts from 'echarts-for-react';


function LineChart({ }){
    let data = [];
    const seriesData = [];
    seriesData.push({
        type:'line',
        symbol:'none',
        data:[10,20,5,40]
    });
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                title:{
                    text:'报警趋势',
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
                
                tooltip:{
                    trigger:'axis'
                },
                xAxis:{
                    type:'category',
                    axisTick:{ show:false },
                    axisLine:{ show:false },
                    axisLabel:{
                        color:'#b5b5bd'
                    },
                    data:['0:00','2:00','4:00','6:00']
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