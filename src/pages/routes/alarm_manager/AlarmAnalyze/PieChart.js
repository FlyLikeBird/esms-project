import React from 'react';
import ReactEcharts from 'echarts-for-react';

let stylesMap = {
    '1':{
        type:'linear',
        x:0,
        y:0,
        x2:0,
        y2:1,
        colorStops: [{
            offset: 0, color: '#4cbaf7' // 0% 处的颜色
        }, {
            offset: 1, color: '#4ce6e6' // 100% 处的颜色
        }],
        
    },
    '2':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#851af9' // 0% 处的颜色
        }, {
            offset: 1, color: '#a91dfb' // 100% 处的颜色
        }],
    },
    '3':{
        type:'linear',
        x:0,
        y:0,
        x2:0,
        y2:1,
        colorStops: [{
            offset: 0, color: '#ff9f48' // 0% 处的颜色
        }, {
            offset: 1, color: '#ffb455' // 100% 处的颜色
        }],
    },
    '4':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#525286' // 0% 处的颜色
        }, {
            offset: 1, color: '#7a7ab3' // 100% 处的颜色
        }],
    },
} 
let data = [
    {value: 1048, name: '搜索引擎' },
    {value: 735, name: '直接访问'},
    {value: 580, name: '邮件营销'},
    {value: 580, name: '联盟广告'}
]
function PieChart(){
    let seriesData = [];
    let num = 0;
    data.forEach((item,index)=>{
        num += item.value;
        seriesData.push({
            type: 'bar',
            stack:'polar',
            data: [,,item.value],
            coordinateSystem: 'polar',
            barWidth:20,
            z:10 - index,
            name:item.name,
            roundCap: true,
            color:stylesMap[index+1],
            barGap: '-100%' ,
            itemStyle:{
                borderColor:'#191932',
                borderWidth:6
            }
        })
    });
    return (
        <ReactEcharts
            style={{ height:'100%' }}
            notMerge={true}
            option={{
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    left:'60%',
                    top:'center',
                    orient:'vertical',
                    data:seriesData.map(i=>i.name),
                    icon:'circle',
                    formatter:(name)=>{
                        let temp = data.filter(i=>i.name === name)[0];
                        // let temp = findData(name, seriesData);
                        let ratio = num ? (temp.value / num * 100).toFixed(1) : 0.0;
                        return `{title|${name}}\n{value|${ratio}%  ${temp.value}}{title|次}`
                    },
                    textStyle:{
                        rich: {
                            title: {
                                fontSize: 12,
                                lineHeight: 24,
                                color: '#9a9a9a'
                            },
                            value: {
                                fontSize: 16,
                                fontWeight:'bold',
                                lineHeight: 24,
                                color:'#fff'
                            }
                        }
                    }
                },
                angleAxis: {
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    min: 0,
                    max: num,
                    // boundaryGap: ['0', '100'],
                    startAngle: 90
                },
                radiusAxis: {
                    type: 'category',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    data: ['a', 'b', 'c'],
                    z: 10
                },
                polar: {
                    center:['30%','50%'],
                    radius:'60%'
                },
                series: seriesData
            }}
        />
    )
}

export default PieChart;