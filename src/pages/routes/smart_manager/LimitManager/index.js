import React, { useState } from 'react';
import { Menu, Button } from 'antd';
import { PlusOutlined, CalendarOutlined, EllipsisOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import InnerStyle from '../TimePlanner/AddPlanForm.css';
import TableContainer from './TableContainer';

let plans = []

for(var i=0;i<6;i++){
    plans.push({ title:`阈值方案${i+1}`, count:24 })
}
function LimitManager(){
   
    return (
        <div>
            <div className={style['card-container-wrapper']} style={{ display:'block', height:'16%', paddingRight:'0' }}>
                <div className={style['card-container']} style={{ overflow:'auto' }}>
                    <div className={style['card-title']}>
                        <div>阈值方案<span style={{ color:'#04a3fe', margin:'0 6px' }}><PlusOutlined />添加方案</span></div>
                    </div>
                    <div className={style['card-content']}>
                        <div className={InnerStyle['list-container']}>
                            {
                                plans.map((item,index)=>(
                                    <div key={index} className={InnerStyle['list-item']} >
                                        <div><CalendarOutlined style={{ margin:'0 4px' }} />{ item.title }</div>
                                        <div className={style['data']} style={{ color:'#fff', margin:'0 10px' }}>
                                            { item.count }
                                        </div>
                                        <div className={style['data']} style={{ color:'#fff' }}>
                                            <EllipsisOutlined style={{ transform:'rotate(90deg)' }} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={style['card-container-wrapper']} style={{ display:'block' ,height:'84%', paddingRight:'0', paddingBottom:'0' }}>
                <div className={style['card-container']}>
                    <TableContainer />
                </div>
            </div>
        </div>
    );
}

export default LimitManager;