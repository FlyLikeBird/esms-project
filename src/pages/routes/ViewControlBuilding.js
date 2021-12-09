import React, { useState, useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
let AMap = null;
let map = null;
function Test2(){
    const [loading, toggleLoading] = useState(false);
    useEffect(()=>{
        AMapLoader.load({
            key:'26dbf93c4af827e4953d7b72390e3362',
            version:'2.0',
            Loca:{
                version:'2.0.0'
            }
        })
        .then((MapInfo,b)=>{   
            let Loca = window.Loca;
            AMap = MapInfo;
            map = new AMap.Map('my-map',{
                // resizeEnable:true,
                zoom:12,
                // center:[121.48941,31.40527],
                // center:[113.27324,23.15792],
                center: [121.304018, 31.217688],
                viewMode:'3D',
                mapStyle: 'amap://styles/darkblue',
                pitch:0,
                showLabel:false,
                showBuildingBlock:false
            });
            
            let loca = new Loca.Container({
                map
            });
            loca.ambLight = {
                intensity: 4.2,
                color: '#babedc',
            };
            loca.dirLight = {
                intensity: 0.46,
                color: '#d4d4d4',
                target: [0, 0, 0],
                position: [0, -1, 1],
            };
            loca.pointLight = {
                color: 'rgb(15,19,40)',
                position: [121.5043258, 31.2392241, 2600],
                intensity: 25,
                // 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失。
                distance: 3900,
            };
            let geo = new Loca.GeoJSONSource({
                url:'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sh_building_center.json'
            });
            console.log(geo);
            var polygon = new Loca.PolygonLayer({
                zIndex:100,
                shininess:10,
                hasSide:true,
                cullface:'back',
                depth:true
            });
            polygon.setSource(geo);
            polygon.setStyle({
                topColor:'#111',
                textureSize: [1000, 820],
                texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/windows.jpg',
                height:(index,feature)=>{
                    return feature.properties.h;
                },
            });
            polygon.hide();
            loca.add(polygon);
            map.on('complete',()=>{
                loca.animate.start();
                setTimeout(animate,2000);
            });
            function animate(){
                var speed = 1;
                // map.setZoom(12, true);
                // map.setPitch(0, true);
                
                // map.setCenter([121.304018, 31.217688], true);
                loca.viewControl.addAnimates([{
                    center: {
                        value: [121.500419, 31.238089],
                        control: [[121.424503326416,
                                   31.199146851153124], [121.46656036376952,
                                                         31.245828642661486]],
                        timing: [0.3, 0, 0.1, 1],
                        duration: 4000 / speed,
                      },
                }],()=>{
                    loca.viewControl.addAnimates([{
                        pitch: {
                          value: 50,
                          control: [[0.3, 0], [1, 50]],
                          timing: [0.3, 0, 1, 1],
                          duration: 3000 / speed,
                        },
                        zoom: {
                            value: 17,
                            control: [[0.3, 15], [1, 17]],
                            timing: [0.3, 0, 0.7, 1],
                            duration: 4000 / speed,
                        },
                        // center:{
                        //     value: [121.500419, 31.238089],
                        //     control: [[121.424503326416,
                        //         31.199146851153124], [121.46656036376952,
                        //                               31.245828642661486]],
                        //     timing:[0.31, 0.71, 0.66, 0.32],
                        //     duration:3000
                        // },
                        
                        // zoom: {
                        //     value: 15.9,
                        //     control: [[0, 12.8], [1, 15.9]],
                        //     timing: [0, 0, 0.8, 1],
                        //     duration: 3000 / speed,
                        //   },
                    }],function(){
                        polygon.show(1000);
                        loca.viewControl.addAnimates([{
                            rotation: {
                                value: 90, // 动画终点的地图旋转角度
                                control: [[0.4, 10], [0.6, 40]], // 控制器，x是0～1的起始区间，y是rotation值
                                timing: [0.42, 0, 0.4, 1],
                                duration: 2000,
                            }
                        }])
                        
                    })
                })
            }
        })
        return ()=>{
            if ( map && map.destroy ){
                map.destroy();
            }
            AMap = null;
            map = null;
        }
    },[]);
    return (
        <div id='my-map' style={{ height:'100%' }}></div>
    )
}

export default Test2;