import React, { useState, useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Spin } from 'antd';
import icon from '../../../../public/arrow-normal.png';
import style from './AgentManager.css';
let map = null;
function AgentMap({ companyList, msg, AMap, dispatch }) {
    const [loaded, toggleLoaded] = useState(false);
    useEffect(()=>{
        if ( !AMap ){
            AMapLoader.load({
                key:'26dbf93c4af827e4953d7b72390e3362',
            })
            .then((MapInfo)=>{                
                // 经纬度转换成容器内像素坐标
                let lng = 113.27324;
                let lat = 23.15792;
                // 添加canvas图层            
                // 添加标记点
                // 南宁（108.27331，22.78121），广州（113.27324，23.15792） 福州（119.27345，26.04769) 惠州(114.38257,23.08464)
                dispatch({ type:'user/setMap', payload:MapInfo });   
            })
        }
        return ()=>{
            if ( map && map.destroy ){
                map.destroy();
            }
            map = null;
        }
    },[]);
    useEffect(()=>{
        if ( AMap ){
            map = new AMap.Map('my-map',{
                resizeEnable:true,
                zoom:7,
                mapStyle: 'amap://styles/darkblue'
            });
            toggleLoaded(true);        
        }
    },[AMap])
    useEffect(()=>{
        if ( msg.detail && msg.detail.length ){
            if ( AMap ){
                let info = msg.detail[0];
                let company = companyList[0] || {};
                // console.log(info);
                // console.log(company);
                var points = [[108.27331,22.78121],[113.27324,23.15792],[119.27345,26.04769]];   
                companyList.forEach(item=>{
                    let marker = new AMap.Marker({
                        position:new AMap.LngLat(item.lng,item.lat),
                        title:'',
                        icon:icon
                    });
                    map.add(marker);
                });
                var content = `
                    <div class=${style['info-container']} onClick="">
                        <div class=${style['info-title']}>${info.warning_info}</div>
                        <div class=${style['info-sub-text']}>${info.date_time}</div>
                        <div>公司 : ${company.company_name}</div>
                        <div>告警类型 : ${info.type_name}</div>
                        <div>告警区域 : ${info.region_name}</div>
                        <div>终端编号 : ${info.mach_name}</div>
                    </div>
                `;
                var position = new AMap.LngLat(company.lng, company.lat);
                var infoWindow = new AMap.InfoWindow({
                    isCustom:true,
                    content,
                    offset: new AMap.Pixel(0,-50)
                });
                // console.log(infoWindow);
                infoWindow.open(map,position);
            }  
        }
    },[msg, AMap])
    return (
        <div style={{ height:'100%' }}>
            {
                loaded 
                ?
                null
                :
                <Spin size='large' className={style['spin']}></Spin>
            }
            <div id='my-map' style={{ height:'100%' }}></div>
        </div>
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.msg !== nextProps.msg || prevProps.AMap !== nextProps.AMap ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(AgentMap, areEqual);