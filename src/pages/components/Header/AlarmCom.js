import React, { useState, useEffect, useRef } from 'react';
import { Popover, Badge } from 'antd';
import { history } from 'umi';
import { createFromIconfontCN, AlertOutlined } from '@ant-design/icons';
import ScrollTable from '../ScrollTable';
let firstMsg = true;
let alarmTimer = null;

const IconFont = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_2314993_bryih7jtrtn.js'
});
function AlarmCom({ msg }){
    const containerRef = useRef();
    const [muted, setMuted] = useState(false);
    useEffect(()=>{  
        var video = document.createElement('video');
        video.style.position = 'absolute';
        video.style.right = '0';
        video.id = 'my-audio';
        video.src = '/alarm.mp4';
        video.muted = true;
        video.autoPlay = true;
        video.loop = true;
        containerRef.current.appendChild(video);
        return ()=>{
            firstMsg = true;
            clearTimeout(alarmTimer);
            alarmTimer = null;
        }
    },[]);
    useEffect(()=>{
        if ( Object.keys(msg).length ){
            if ( !firstMsg && !muted ){
                function run(){   
                    let audio = document.getElementById('my-audio');
                    if ( audio ) {
                        audio.currentTime = 0;
                        audio.muted = false;
                        alarmTimer = setTimeout(()=>{
                            audio.muted = true;
                        },5000);
                    }  
                }
                run();
            } 
            firstMsg = false;
        }
    },[msg])
    // console.log(msg);
    let thead = [{ title:'位置', dataIndex:'region_name', width:'20%', collapse:true }, { title:'设备', dataIndex:'mach_name', width:'20%', collapse:true }, { title:'分类', dataIndex:'type_name', width:'25%', border:true }, { title:'发生时间', dataIndex:'date_time', key:'time', width:'35%' }];

    return (
        <div ref={containerRef} style={{ cursor:'pointer', display:'inline-flex', alignItems:'center'  }}>
            <AlertOutlined style={{ marginRight:'6px', fontSize:'1.2rem' }} onClick={()=>{
            }} />
            <Popover color='#1d1e32' content={<div style={{ width:'500px'}}><ScrollTable scrollNum={5} thead={thead} data={ msg.detail || []} /></div>}>
                <Badge count={msg.count} onClick={()=>{
                    history.push('/sw_warning');
                }} />
            </Popover>
            {/* <video id='my-audio' src={AlarmSound} muted={true} autoPlay={true} loop={true} style={{ position:'absolute', left:'100%' }}></video> */}
            <IconFont style={{ fontSize:'1.2rem', margin:'0 10px'}} type={ muted ? 'iconsound-off' : 'iconsound'} onClick={()=>{
                setMuted(!muted);
                let audio = document.getElementById('my-audio');
                if ( audio ){
                    if ( muted ){
                        audio.muted = false;
                    } else {
                        audio.muted = true;
                    }
                }
                
            }}></IconFont>
            <span style={{ margin:'0 6px' }}>|</span>
        </div>
    )
}

export default AlarmCom;