import React, { useState } from 'react';
import { Menu } from 'antd';
import style from '@/pages/routes/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import PieChart from './PieChart';
import LineChart from './LineChart';
import TableContainer from './TableContainer';

let sumInfo = [
    { key:'day', value:10, lastValue:5, ratio:'20.0%' },
    { key:'month', value:20, lastValue:15, ratio:'20.0%' },
    { key:'year', value:50, lastValue:5, ratio:'20.0%' },
];
function AlarmAnalyze(){
    let sidebar = (
        <div>
            <div className={style['card-container-wrapper']} style={{ display:'block', height:'40%', paddingRight:'0' }}>
                <div className={style['card-container']}></div>
            </div>
            <div className={style['card-container-wrapper']} style={{ display:'block' ,height:'60%', paddingRight:'0', paddingBottom:'0' }}>
                <div className={style['card-container']}></div>
            </div>
        </div>
    );
    let content = (
        <div>
            <div className={style['card-container-wrapper']} style={{ display:'block', height:'40%', paddingRight:'0' }}>
                <div className={style['card-container-wrapper']} style={{ width:'40%', paddingBottom:'0' }}>
                    {
                        sumInfo.map((item,index)=>(
                            <div key={index} style={{ height:'33.3%', paddingBottom:index === sumInfo.length - 1 ? '0' : '1rem' }}>
                                <div className={style['card-container']} style={{ display:'flex', alignItems:'center', justifyContent:'space-around' }}>
                                    <div>
                                        <div style={{ width:'40px', height:'40px', lineHeight:'40px', textAlign:'center', color:'#fff', borderRadius:'10px', backgroundColor:item.key === 'day' ? '#af2aff' : item.key === 'month' ? '#6dcffb' : '#ffb863' }}>
                                            { item.key === 'day' ? '日' : item.key === 'month' ? '月' : '年'}
                                        </div>
                                    </div>
                                    <div>
                                        <div>{ `${item.key === 'day' ? '今日' : item.key === 'month' ? '当月' : '今年'}报警数`}</div>
                                        <div className={style['data']} style={{ color:'#fff'}}>{ item.value }</div>
                                    </div>
                                    <div>
                                        <div>{ `${item.key === 'day' ? '昨日' : item.key === 'month' ? '上月' : '去年'}同期`}</div>
                                        <div className={style['data']} style={{ color:'#fff'}}>{ item.lastValue }</div>
                                    </div>
                                    <div>
                                        <div>趋势</div>
                                        <div className={style['data']} style={{ color:'#fff'}}>{ item.ratio }</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className={style['card-container-wrapper']} style={{ width:'60%', paddingRight:'0', paddingBottom:'0' }}>
                    <div className={style['card-container']}>
                        <LineChart />
                    </div>
                </div>
            </div>    
            <div className={style['card-container-wrapper']} style={{ display:'block', height:'60%', paddingRight:'0', paddingBottom:'0' }}>
                <div className={style['card-container-wrapper']} style={{ width:'40%', paddingBottom:'0' }}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>警报分类</div>
                        <div className={style['card-content']}>
                            <PieChart />
                        </div>
                    </div>
                </div>
                <div className={style['card-container-wrapper']} style={{ width:'60%', paddingBottom:'0', paddingRight:'0' }}>
                    <div className={style['card-container']}>
                        <div className={style['card-title']}>警报排名</div>
                        <div className={style['card-content']}>
                            <TableContainer />
                        </div>
                    </div>
                    
                </div>
            </div>  
        </div>
    );
    return <ColumnCollapse sidebar={sidebar} content={content} />
}

export default AlarmAnalyze;