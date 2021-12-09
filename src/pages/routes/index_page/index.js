import React, { useRef, useEffect } from 'react';
import Header from '@/pages/components/Header';
import style from '../IndexPage.css';

function IndexPage({ children }){
   
    return (
        <div className={style['container'] + ' ' + style['dark']} >
            <Header />
            <div style={{ height:'calc( 100% - 60px)'}}>
                { children }
            </div>
        </div>
    )
}

export default IndexPage;