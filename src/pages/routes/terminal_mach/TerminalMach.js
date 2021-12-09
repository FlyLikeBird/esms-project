import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import style from '../IndexPage.css';
import TotalMachList from './TotalMachList';
import TypedMachList from './TypedMachList';
import MachDetail from './MachDetail';
import Loading from '@/pages/components/Loading';
// function TerminalMach({ dispatch, terminalMach }){
//     let { typeList, currentType, machList, total, currentMach, machDetailInfo, machLoading, currentPage, isLoading } = terminalMach;
//     let sidebar = (
//         <div>
//             <div className={style['card-container-wrapper']} style={{ display:'block', height:'40%', paddingRight:'0' }}>
//                 <div className={style['card-container']}></div>
//             </div>
//             <div className={style['card-container-wrapper']} style={{ display:'block' ,height:'60%', paddingRight:'0', paddingBottom:'0' }}>
//                 <div className={style['card-container']}></div>
//             </div>
//         </div>
//     );
//     let content = (
//         <div>
//             <div className={style['card-container']}>
//                 {
//                     Object.keys(currentType).length 
//                     ?
//                     <TypedMachList currentType={currentType} dispatch={dispatch} data={machList} total={total} currentPage={currentPage} isLoading={isLoading} />
//                     :
//                     <TotalMachList data={typeList} dispatch={dispatch} />
//                 }
//             </div>
//             <Modal 
//                 visible={Object.keys(currentMach).length ? true : false}
//                 footer={null}
//                 className={style['custom-modal']}
//                 bodyStyle={{ backgroundColor:'#000' }}
//                 width='80vw'
//                 height='80vh'
//                 destroyOnClose={true}
//                 onCancel={()=>{
//                     dispatch({ type:'terminalMach/resetMachDetail'})
//                 }}
//             >
//                 <MachDetail 
//                     dispatch={dispatch}
//                     currentMach={currentMach}
//                     machLoading={machLoading}
//                     data={machDetailInfo}
                    
//                 />
//             </Modal>
//         </div>
//     );
//     useEffect(()=>{
//         return ()=>{
//             dispatch({ type:'terminalMach/cancelAll'});
//         }
//     },[])
//     return <ColumnCollapse sidebar={sidebar} content={content} />
// }

function TerminalMach({ dispatch, user, terminalMach }){
    let { machList, currentPage, total, machDetailInfo, machLoading, isLoading } = terminalMach;
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'terminalMach/fetchMachList'})
        }
    },[user.authorized])
    return (
            <div className={style['card-container']} style={{ borderRadius:'0' }}>
                {
                    isLoading 
                    ?
                    <Loading />
                    :
                    null
                }
                <TypedMachList dispatch={dispatch} data={machList} total={total} currentPage={currentPage} />
                
                
                <Modal 
                   visible={Object.keys(machDetailInfo).length ? true : false}
                   footer={null}
                   className={style['custom-modal']}
                   bodyStyle={{ backgroundColor:'rgba(0, 0, 0, 0.8)' }}
                   width='80vw'
                   height='80vh'
                   onCancel={()=>{
                       dispatch({ type:'terminalMach/resetMachDetail'})
                   }}
               >
                   <MachDetail 
                       dispatch={dispatch}
                    //    currentMach={currentMach}
                       machLoading={machLoading}
                       data={machDetailInfo}
                   />
               </Modal>
            </div>
             
    )
}
export default connect(({ user, terminalMach })=>({ user, terminalMach }))(TerminalMach);
