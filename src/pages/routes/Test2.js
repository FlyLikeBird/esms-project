import React from 'react';
import lbImg2P from '../../../public/lb_2p.png';
import lbImg3P from '../../../public/lb_3p.png';
import lbImg4P from '../../../public/lb_4p.png';

let lbTypesMap = {
    '2':lbImg2P,
    '3':lbImg3P,
    '4':lbImg4P
};

function Test2(){
    return (
        <div style={{ width:'1024px', height:'100%'}}>
            <div style={{ 
                display:'inline-block',
                height:'100%', 
                width:'120px',
                backgroundImage:`url(${lbImg2P})`,
                backgroundSize:'360px 100%',
                backgroundRepeat:'no-repeat',
                // backgroundPosition:`0 0`,
                marginRight:'1rem'
            }}></div>
            <div style={{ 
                display:'inline-block',
                height:'100%', 
                width:'120px',
                backgroundSize:'360px 100%',

                backgroundImage:`url(${lbImg2P})`,
                backgroundRepeat:'no-repeat',
                // backgroundSize:'120px 100%',
                backgroundPosition:`-120px 0`,
                marginRight:'1rem'
            }}></div>
            <div style={{ 
                display:'inline-block',
                height:'100%', 
                width:'120px',
                backgroundSize:'360px 100%',

                backgroundImage:`url(${lbImg2P})`,
                backgroundRepeat:'no-repeat',
                // backgroundSize:'120px 100%',
                backgroundPosition:`-240px 0`,
                marginRight:'1rem'
            }}></div>
        </div>
    )
}
export default Test2;