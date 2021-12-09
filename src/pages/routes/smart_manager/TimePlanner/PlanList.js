import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { PlusOutlined, CalendarOutlined, EllipsisOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import IndexStyle from '@/pages/routes/IndexPage.css';
import style from './AddPlanForm.css';
let plans = []
for(var i=0;i<6;i++){
    plans.push({ title:'工作日照明任务', count:24 })
}
function PlanList({ }){
    let [data, setDate] = useState(plans);
    let [editing, toggleEditting] = useState(false);
    let [value, setValue] = useState('');
    const inputRef = useRef();
    useEffect(()=>{
        if ( editing ){
            if ( inputRef.current && inputRef.current.focus ) {
                inputRef.current.focus();
            }
        } else {
            setValue('');
        }
    },[editing])
    return (
        <div className={IndexStyle['card-container']} style={{ overflow:'auto hidden' }}>
            <div className={IndexStyle['card-title']}>
                <div>方案详情<span style={{ color:'#04a3fe', margin:'0 6px', cursor:'pointer' }} onClick={()=>toggleEditting(true)}><PlusOutlined style={{ fontSize:'1.2rem' }} />添加方案</span></div>
            </div>
            <div className={IndexStyle['card-content']}>
                <div className={style['list-container']}>
                    {
                        editing 
                        ?
                        <div key='add' className={style['list-item']} >
                            <Input style={{ width:'140px'}} ref={inputRef} value={value} onChange={e=>setValue(e.target.value)} />
                            <CheckCircleOutlined style={{ fontSize:'1.2rem', margin:'0 6px', color:'#5eff5a' }} onClick={()=>{
                                if ( value ){
                                    let temp = [{ title:value, count:30 }, ...data ];
                                    setDate(temp);
                                } 
                                toggleEditting(false);
                            }}/>
                            <CloseCircleOutlined style={{ fontSize:'1.2rem', margin:'0 6px', color:'#ff2d2e' }} onClick={()=>toggleEditting(false)} />
                        </div>
                        :
                        null
                    }
                    {
                        data.map((item,index)=>(
                            <div key={index} className={style['list-item']} >
                                <div><CalendarOutlined style={{ margin:'0 4px' }} />{ item.title }</div>
                                <div className={IndexStyle['data']} style={{ color:'#fff', margin:'0 10px' }}>
                                    { item.count }
                                </div>
                                <div className={IndexStyle['data']} style={{ color:'#fff' }}>
                                    <EllipsisOutlined style={{ transform:'rotate(90deg)' }} />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default PlanList;

