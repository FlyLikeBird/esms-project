import React, { useEffect } from 'react';
import { Topology } from '@topology/core';
import { register as registerFlowDiagram } from '@topology/flow-diagram';
import Menu from './menu';
import { Tools } from './tools';
registerFlowDiagram();

function TopologyContainer(){
    
    useEffect(()=>{
        var canvas = new Topology('my-canvas', {});
        console.log(canvas);
    },[])
    return (
        <div>
            <Menu Tools={Tools} />
            <div>
                {
                    
                }
            </div>
            <div id='my-canvas' style={{ width:'1000px', height:'400px'}}></div>
        </div>
    )
}

export default TopologyContainer;