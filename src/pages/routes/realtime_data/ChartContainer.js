import React from 'react';
import { Radio, DatePicker } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import style from '../IndexPage.css';
import LineChart from './LineChart';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';

const buttons = [
    { title:'电压', code:'1', unit:'V' },
    { title:'电流', code:'2', unit:'A' },
    { title:'功率', code:'3', unit:'KW' },
    { title:'功率因素', code:'4', unit:'cosΦ' },
    { title:'小时电能', code:'5', unit:'KWH' },
    { title:'费用', code:'6', unit:'元' },
    { title:'温度', code:'7', unit:'℃' },
];

function ChartContainer({ dispatch, data, loading, timeType, startDate, optionType, theme }){
    let info = buttons.filter(i=>i.code === optionType)[0] ;
    // console.log(data);
    return (
        <div style={{ height:'100%', position:'relative' }}>
            {
                loading 
                ?
                <Loading />
                :
                null
            }
            
            <div className={style['button-group-container']}>
                {
                    buttons.map((item,index)=>(
                        <div key={index} className={ item.code === optionType ? style['button-group-item'] + ' ' + style['selected'] : style['button-group-item'] } onClick={()=>{
                            dispatch({ type:'realtime/toggleOptionType', payload:item.code });
                            dispatch({ type:'realtime/fetchChartInfo'});
                        }}>{ item.title }</div>
                    ))
                }
            </div>            
            <CustomDatePicker theme={theme} onDispatch={()=>{
                dispatch({ type:'realtime/fetchChartInfo'});
            }} />
            <div style={{ height:'calc( 100% - 90px)'}}>
                <LineChart theme={theme} xData={data.date} yData={data.energy}  info={info} startDate={startDate} timeType={timeType} />
            </div>
        </div>
    )
}

export default ChartContainer;