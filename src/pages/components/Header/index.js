import React,{ useEffect, useRef } from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import style from './header.css';
import { Menu, Tag } from 'antd';
import { EyeOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import avatarBg from '../../../../public/avatar-bg.png';
import AlarmCom from './AlarmCom';
import WeatherCom from './WeatherCom';


function isFullscreen(){
    return document.fullscreenElement    ||
           document.msFullscreenElement  ||
           document.mozFullScreenElement ||
           document.webkitFullscreenElement || false;
}

function enterFullScreen(el){
    let func = el.requestFullscreen || el.msRequestFullscreen || el.mozRequestFullscreen || el.webkitRequestFullscreen ;
    if ( func && typeof func === 'function' ) func.call(el);
}

function cancelFullScreen(el ){
    // let func = el.cancelFullsceen || el.msCancelFullsceen || el.mozCancelFullsceen || el.webkitCancelFullsceen 
    //         || document.exitFullscreen || document.msExitFullscreen || document.mozExitFullscreen || document.webkitExitFullscreen ;
    // if ( func && typeof func === 'function' ) func();
    if ( typeof document.exitFullscreen === 'function' ) {
        document.exitFullscreen();
    }
}

function Header({ dispatch, user }){
    const containerRef = useRef();
    const { currentMenu, userMenu, msg, userInfo, currentCompany, thirdAgent, newThirdAgent } = user;
    useEffect(()=>{
        if ( containerRef.current ){
            dispatch({ type:'user/setContainerWidth', payload:containerRef.current.offsetWidth });
        }
        function handleResize(){
            dispatch({ type:'user/setContainerWidth', payload:containerRef.current.offsetWidth });
        }
        function handleKeyDown(e){
            if ( e.keyCode === 122 ) {
                e.preventDefault();
                let dom = isFullscreen();
                if ( dom ) {
                    cancelFullScreen(dom);
                } else {
                    enterFullScreen(document.getElementById('root'));
                }
            }
        }
        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown)
        return ()=>{
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        }
    },[]);
    let isFulled = isFullscreen();
    return (
        <div ref={containerRef} className={style['container']}>
            <div style={{ display:'inline-flex', alignItems:'center' }}>
                <img src={Object.keys(newThirdAgent).length ? newThirdAgent.logo_path : ''} style={{ height:'50%' }} />
                <span className={style['title']}>
                    智慧空开
                    {/* 电气火灾预防管理服务云平台 */}
                </span>
            </div>
            <Menu className={style['header-menu-container']} mode='horizontal' selectedKeys={[currentMenu.menu_code]} onClick={e=>{
                let temp = userMenu.filter(i=>i.menu_code === e.key )[0];
                dispatch({ type:'user/toggleCurrentMenu', payload:temp });
                let targetURL = e.key === '/' ? '' : e.key;
                history.push('/' + targetURL );
            }}>
                {             
                    userMenu.map((item,index)=>(
                        <Menu.Item key={item.menu_code}>{ item.menu_name }</Menu.Item>
                    ))
                }
            </Menu>
            <div className={style['weather-container']}>
                {
                    isFulled
                    ?
                    <FullscreenExitOutlined style={{ fontSize:'1.4rem', margin:'0 10px' }} onClick={()=>{
                        cancelFullScreen();
                    }} />
                    :
                    <FullscreenOutlined style={{ fontSize:'1.4rem', margin:'0 10px' }} onClick={()=>{
                        enterFullScreen(document.getElementById('root'));
                    }} />
                }
                <AlarmCom msg={msg} />
                <WeatherCom />
                <div style={{ display:'inline-flex', alignItems:'center', marginRight:'6px' }}>
                    <div style={{ width:'24px', height:'24px', borderRadius:'50%', backgroundColor:'#8888ac', backgroundRepeat:'no-repeat', backgroundSize:'cover', backgroundImage:`url(${avatarBg})`}}></div>
                    <div>{ currentCompany.company_name || '--' }</div>
                    {/* <Tag color="blue">{ userInfo.role_name }</Tag> */}
                </div>
                <div style={{ cursor:'pointer', zIndex:'2' }} onClick={()=>{
                    dispatch({ type:'user/loginOut'});
                }}>
                    <Tag color='#2db7f5'>退出</Tag>
                </div>
            </div>
        </div>
    )
}

export default connect(({ user })=>({ user }))(Header);