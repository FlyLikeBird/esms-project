import React, { useRef, useEffect, useState } from 'react';

let temp = [
    { type:'lb', content:'1'},
    { type:'kk', content:'2'},
    { type:'kk', content:'3'},
    { type:'kk', content:'4'},
];
// 记录每个item的中心位置
let posToIndex = {};

function sortData(data){
    let posArr = [], sum = 0; 
    data.forEach((item,index)=>{
        let temp = sum + ( item.type === 'lb' ? 80 : 60 );
        posArr.push(temp);
        sum += ( item.type === 'lb' ? 160 : 120 ) + 20;
    });
    return posArr;
}
let styleObj = {
    display:'inline-block',
    verticalAlign:'top',
    width:'120px',
    height:'240px',
    border:'1px solid #fff',
    backgroundColor:'green',
    marginRight:'20px',
    fontSize:'1.4rem',
    cursor:'move',
};
let styleObj2 = {
    display:'inline-block',
    verticalAlign:'top',
    width:'160px',
    height:'240px',
    border:'1px solid #fff',
    backgroundColor:'green',
    marginRight:'20px',
    fontSize:'1.4rem',
    cursor:'move'
};
let canDrag = false, 
    canMouseUp = false, 
    currentTarget = null, 
    prevIndex = 0,
    currentIndex = 100, 
    currentDom = null, 
    hasInsert = false,
    posX = 0, posY = 0, 
    moveX = 0, moveY = 0;
function Ceshi(){
    const containerRef = useRef();
    const [data, setData] = useState(temp);
    let posArr = useRef([]);
    useEffect(()=>{
        posArr.current = sortData(data);
    },[data])
    useEffect(()=>{
        let items = document.getElementsByClassName('draggable-item');         
        function handleMouseDown(e){
            canDrag = true;
            posX = e.pageX;
            posY = e.pageY;
            currentTarget = e.target;
            let doms = document.getElementsByClassName('draggable-item');
            doms.forEach(item=>{
                if ( item.attributes['data-index'].value === e.target.attributes['data-index'].value ){
                    prevIndex = currentIndex = +item.attributes['data-index'].value;
                }
            })
            // console.log(currentIndex);
            // console.log(posX, posY);
        }
        function handleMouseUp(){
            console.log('mouseup');
            if ( canDrag ){
                if ( currentDom ){
                    let items = document.getElementsByClassName('draggable-item');
                    items.forEach(item=>{
                        item.style.opacity = '1';
                    })
                    if ( containerRef.current && items[items.length - 1]){
                        containerRef.current.removeChild(items[items.length - 1]);
                    }
                }
                canDrag = false;
                currentDom = null;
                canMouseUp = false;
                hasInsert = false;   
                prevIndex = 0;
                currentIndex = 0;
                moveX = 0;
                moveY = 0;        
                // 删除绝对定位的临时div
                currentTarget.style.opacity = '1';
                currentTarget = null;
            }                         
        }

        function handleMouseMove(e){
            if ( canDrag ){
                moveX = currentTarget.offsetLeft + e.pageX - posX;
                moveY = currentTarget.offsetTop + e.pageY - posY;  
                if ( !hasInsert ){
                    canMouseUp = true;
                    let div = document.createElement('div');
                    Object.keys(styleObj).forEach(key=>{
                        div.style[key] = styleObj[key];
                    });
                    div.className = 'draggable-item';
                    div.style.position = 'absolute';
                    div.style.width = currentTarget.attributes['data-type'].value === 'lb' ? '160px' : '120px';
                    currentDom = div;
                    containerRef.current.appendChild(div);
                    hasInsert = true;
                    currentTarget.style.opacity = '0.2';
                    // currentDom.addEventListener('mousemove', handleMouseMove);
                    // currentDom.addEventListener('mouseup', handleMouseUp);
                    // console.log(div);
                }              
                if ( currentDom ){
                    currentDom.style.top = moveY + 'px';
                    currentDom.style.left = moveX + 'px';
                    // 判断浮动项当前的位置处于哪一个索引的位置  
                    // console.log(posArr.current);              
                    for( let i=0;i<posArr.current.length; i++){
                        // 如果是第一项,左侧临界点
                        if ( moveX < posArr.current[0] ) {
                            currentIndex = 0;
                        } else if ( moveX >= posArr.current[posArr.current.length - 1]  ){
                            // 如果是最后一项，右侧临界点
                            currentIndex = posArr.current.length - 1;
                        } else {
                            // 如果是中间项
                            if ( moveX >= posArr.current[currentIndex + 1] ) {
                                // console.log('+++++');
                                currentIndex = currentIndex + 1;
                            }
                            if ( moveX < posArr.current[currentIndex - 1]) {
                                // console.log('-----');
                                currentIndex = currentIndex - 1;
                            }
                        }
                        // console.log(currentIndex);
                    }
                    // 监听索引值的变化，有变化时才执行dom排序操作
                    if ( prevIndex !== currentIndex ){
                        // console.log('func()...');
                        // console.log(prevIndex, currentIndex);
                        currentTarget.style.opacity = '1';
                        setData(data=>{
                            let newArr = data.concat();
                            let temp = newArr[prevIndex];
                            newArr[prevIndex] = newArr[currentIndex];
                            newArr[currentIndex] = temp;
                            return newArr;
                        })
                        
                    }
                    prevIndex = currentIndex;
                }
            }
        }
        
        items.forEach((item,index)=>{
            item.addEventListener('mousedown', handleMouseDown);
        });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    },[])
    return (
        <div ref={containerRef} style={{ position:'relative' }}>
            {
                data.map((item,index)=>(
                    <div key={index} className="draggable-item" style={{...styleObj, width:item.type === 'lb' ? '160px' : '120px', opacity:currentIndex === index ? '0.2' : '1' }} data-index={index} data-type={item.type}>
                        { item.content }
                    </div>
                ))
            }
        </div>
    )
}

export default Ceshi;