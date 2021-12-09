import React from 'react';
import { IconFont } from '@/pages/components/IconFont';
import style from './TerminalMach.css';

const iconsMap = {
    'all':'iconVector-4',
    'ele_meter':'iconVector-3',
    'switch':'iconUnion-1',
    'gas':'iconqibiao',
    'water_meter':'iconshuibiao',
    'camera':'iconVector',
    'bar_temp':'iconUnion'
};
function TotalMachList({ dispatch, data }){
    return (
        <div className={style['mach-list-container']}>
            {
                data && data.length 
                ?
                data.map((item,index)=>(
                    <div key={index} className={style['mach-item']} onClick={()=>{
                        dispatch({ type:'terminalMach/toggleMachType', payload:item });
                        dispatch({ type:'terminalMach/fetchSeriesMach'});
                    }}>
                        <div><IconFont type={iconsMap[item.key]} style={{ fontSize:'3rem', color:'#04a3fe' }} /></div>
                        <div style={{ margin:'10px 0'}}>{ item.title }</div>
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                            <span className={style['sub-text']}>设备总数</span>
                            <span>36</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                            <span className={style['sub-text']}>在线数</span>
                            <span>34</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                            <span className={style['sub-text']}>告警数</span>
                            <span>10</span>
                        </div>
                    </div>
                ))
                :
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}>没有终端设备</div>
            }
        </div> 
        
    )
}

export default TotalMachList;