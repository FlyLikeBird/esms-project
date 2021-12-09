import React from 'react';
import { Spin } from 'antd';
import style from './Loading.css';

function Loading(){
    return (
        <div className={style['mask']}>
            <Spin className={style['spin']} size='large' />
        </div>
    )
}

export default Loading;