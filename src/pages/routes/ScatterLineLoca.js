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
                zoom:3,
                viewMode:'3D',
                mapStyle: 'amap://styles/darkblue',
                pitch: 30,
                showLabel:false
            });
            let labelLayer = new AMap.LabelsLayer({
                rejectMapMask: true,
                collision: true,
                animation: true,
            });
            map.add(labelLayer);
            let loca = new Loca.Container({
                map
            });
            var linkLayer = new Loca.LinkLayer({
                zIndex: 20,
                opacity: 1,
                visible: true,
                zooms: [2, 22],
            });
            let scatterLayer1 = new Loca.ScatterLayer({
                zIndex:10,
                opacity:0.8,
                visible:true,
                zooms:[2,20]
            });
            let scatterLayer2 = new Loca.ScatterLayer({
                zIndex:10,
                opacity:0.8,
                visible:true,
                zooms:[2,20]
            });
            let scatterLayer3 = new Loca.ScatterLayer({
                zIndex:10,
                opacity:0.8,
                visible:true,
                zooms:[2,20]
            });
            let centerPoint = new Loca.GeoJSONSource({
                data:{
                    type:'FeatureCollection',
                    features:[
                        {
                            type:'Feature',
                            geometry:{
                                type:'Point',
                                coordinates:[116.39,39.9]
                            }
                        }
                    ]
                }
            });
            scatterLayer3.setSource(centerPoint);
            scatterLayer3.setStyle({
                size: [100000, 100000],
                unit: 'meter',
                texture: 'https://a.amap.com/Loca/static/static/center-point.png'
            });
            loca.add(scatterLayer3);
            var filterGeoJSON = (json, type)=>{
                var newJSON = {
                    type:'FeatureCollection',
                    features:[...json.features.filter(i=>i.properties.type === type)]
                };
                return new Loca.GeoJSONSource({ data:newJSON });
            }
            var setLabelLayer = (data)=>{
                labelLayer.clear();
                data.features.forEach(item=>{
                    let labelMarker = new AMap.LabelMarker({
                        name:item.properties.flagName,
                        position:item.geometry.coordinates,
                        zooms:[2,22],
                        opacity:1,
                        zIndex:10,
                        text:{
                            content:item.properties.country,
                            direction:'bottom',
                            // offset:[0,-15],
                            style:{
                                fontSize:13,
                                fontWeight:'normal',
                                fillColor:'#fff'
                            }
                        }
                    });
                    labelLayer.add(labelMarker);
                });
                labelLayer.add(new AMap.LabelMarker({
                    name: 'china',
                    position: [116.39, 39.9],
                    zooms: [2, 22],
                    opacity: 1,
                    zIndex: 10,
                    rank: 100,
                    text: {
                        content: '中国',
                        direction: 'bottom',
                        offset: [0, -5],
                        style: {
                            fontSize: 13,
                            fontWeight: 'normal',
                            fillColor: '#fff',
                        },
                    },
                }))
            }
            let scatterGeoMap;
            var lineGeoMap;
            
            fetch('https://a.amap.com/Loca/static/static/diplomacy-point.json')
            .then((res) => res.json())
            .then((data)=>{
                scatterGeoMap = data;
                setLabelLayer(scatterGeoMap[50]);
                let source1 = filterGeoJSON(scatterGeoMap[50], 0);
                let source2 = filterGeoJSON(scatterGeoMap[50],1);
                console.log(source1);
                console.log(source2);
                scatterLayer1.setSource(source1);
                scatterLayer2.setSource(source2);
                scatterLayer1.setStyle({
                    size: [500000, 500000],
                    unit: 'meter',
                    animate: true,
                    duration: 1000,
                    texture: 'https://a.amap.com/Loca/static/static/green.png',
                })
                scatterLayer2.setStyle({
                    size: [500000, 500000],
                    unit: 'meter',
                    animate: true,
                    duration: 1000,
                    texture: 'https://a.amap.com/Loca/static/static/orange.png',
                });
                loca.add(scatterLayer1);
                loca.add(scatterLayer2);
                console.log(loca);
                
                loca.animate.start();
            })
            fetch('https://a.amap.com/Loca/static/static/diplomacy-line.json')
            .then((res) => res.json())
            .then(data=>{
                lineGeoMap = Object.entries(data).reduce((sum, cur)=>{
                    var [key, geo] = cur;
                    sum[key] = new Loca.GeoJSONSource({
                        data:geo
                    });
                    return sum;
                },{});
                linkLayer.setSource(lineGeoMap[50]);
                linkLayer.setStyle({
                    lineColors:function(index,item){
                        return item.link.properties.type === 0 ? ['#25CDEA', '#12BFBF'] : ['#FFD87B', '#FF4F00'];
                    },
                    height:function(index,item){
                        return item.distance / 3;
                    },
                    smoothSteps:200
                });
                loca.add(linkLayer);
            })
            // console.log(Loca.GeoJSONSource);
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