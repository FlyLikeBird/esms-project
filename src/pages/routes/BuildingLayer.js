import React, { useState, useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

let AMap = null;
let map = null;
function Test2(){
    const [loading, toggleLoading] = useState(false);
    useEffect(()=>{
        AMapLoader.load({
            key:'26dbf93c4af827e4953d7b72390e3362',
            version:'1.4.15',
            // Loca:{
            //     version:'2.0.0'
            // }
        })
        .then((MapInfo,b)=>{   
            let Loca = window.Loca;
            AMap = MapInfo;
            map = new AMap.Map('my-map',{
                // resizeEnable:true,
                zoom:12,
                // center:[121.48941,31.40527],
                // center:[113.27324,23.15792],
                center: [113.538361, 22.809549],
                viewMode:'3D',
                mapStyle: 'amap://styles/light',
                layers: [
                    new AMap.TileLayer(),
                    // 高德默认标准图层
                    // new AMap.TileLayer.Satellite(),
                    new AMap.TileLayer.RoadNet(),
                    // 楼块图层
                    new AMap.Buildings({
                        zooms: [12, 18],
                        zIndex: 10,
                        heightFactor: 4//2倍于默认高度，3D下有效
                    })
                ],
                pitch:0,
                // showLabel:false,
                // showBuildingBlock:false
            });
            let object3Dlayer = new AMap.Object3DLayer();
            var paramDuck = {
                position: new AMap.LngLat(113.538361, 22.809549), // 必须
                scale: 200, // 非必须，默认1
                height: -100,  // 非必须，默认0
                scene: 0, // 非必须，默认0
            };
            map.add(object3Dlayer);
            map.AmbientLight = new AMap.Lights.AmbientLight([0.7, 0.8, 0.7], 0.8);
            map.DirectionLight = new AMap.Lights.DirectionLight([0, -1, 1], [1, 1, 1], 0.1);
            AMap.plugin(["AMap.GltfLoader"],function(){
                // 创建AMap.GltfLoader插件实例
                var gltf = new AMap.GltfLoader();
            
                // 调用load方法，加载 glTF 模型资源
                var urlDuck = 'https://a.amap.com/jsapi_demos/static/gltf/Duck.gltf';  // 模型资源文件路径，远程/本地文件均可
                // gltf.load(urlDuck, function( gltfDuck ){
                //    // gltfCity 为解析后的gltf对象
                //     gltfDuck.setOption(paramDuck);
                //     // gltfDuck.rotateX(90);
                //     // gltfDuck.rotateZ(-20);
                //     object3Dlayer.add(gltfDuck);
                // });
                var boxURL = 'http://localhost:8001/b.gltf';
                gltf.load(boxURL, (box)=>{
                    console.log(box);
                    box.setOption(paramDuck);
                    box.rotateX(90);
                    box.rotateZ(180);
                    object3Dlayer.add(box);
                })
            
            })
            
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