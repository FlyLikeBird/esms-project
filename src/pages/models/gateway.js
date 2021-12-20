import { getIndexData, getGatewayList, addGateway, updateGateway, deleteGateway } from '../services/gatewayService';
const initialState = {
    monitorInfo:{},
    gatewayList:[],
    currentGateway:{},
    gatewayLoading:true,
    currentPage:1,
    total:0
}

export default {
    namespace:'gateway',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'reset'});
        },
        *fetchIndexInfo(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { data } = yield call(getIndexData, { company_id });
            if ( data && data.code === '0'){
                yield put({ type:'getIndexData', payload:{ data:data.data }});
            }
        },
        *fetchGateway(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { keyword, forceUpdate } = action.payload || {};
                let { data } = yield call(getGatewayList, { company_id, keyword });
                if ( data && data.code === '0'){
                    yield put({ type:'getGateway', payload:{ data:data.data }});
                    if ( forceUpdate ){
                        // 当网关列表有修改时及时更新其他模块的网关树结构
                        yield put({ type:'switchMach/fetchGateway', payload:{ forceUpdate:true }});
                    }
                } 
            } catch(err){
                console.log(err);
            }  
        },
        *add(action, { put, call, select }){
            try {
                let { values, resolve, reject, forEdit } = action.payload || {};
                let { mach_id, meter_name, register_code, lng, lat, address } = values;
                let { user:{ company_id }} = yield select();  
                let params = { company_id, meter_name, register_code, lng, lat, address };
                if ( forEdit ){
                    params['mach_id'] = mach_id; 
                }      
                let { data } = yield call( forEdit ? updateGateway : addGateway, params );
                if ( data && data.code === '0'){
                    yield put({ type:'fetchGateway', payload:{ forceUpdate:true } });
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *del(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { resolve, reject, mach_id } = action.payload || {};
                let { data } = yield call(deleteGateway, { company_id, mach_id });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchGateway', payload:{ forceUpdate:true } });
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        }
    },
    reducers:{
        toggleGatewayLoading(state){
            return { ...state, gatewayLoading:true };
        },
        getIndexData(state, { payload:{ data }}){
            return { ...state, monitorInfo:data };
        },
        getGateway(state, { payload:{ data }}){
            return { ...state, gatewayList:data, gatewayLoading:false };
        },
        updateGateway(state, { payload:{ multi, single }}){
            let temp = state.gatewayList.concat();
            if ( multi ){
                temp.forEach(item=>{
                    if ( item.key === state.currentGateway.key ) {  
                        item.className = 'selected-parent';
                    }
                    item.disabled = false;
                });
            } else if ( single ){
                temp.forEach(item=>{
                    if( item.is_gateway ){
                        item.disabled = true;
                    }
                    item.className='';
                })
            } else {
                temp.forEach(item=>{
                    item.className = '';
                    item.disabled = false;
                })
            }
            return { ...state, gatewayList:temp };
        },
    
        reset(state){
            return initialState;
        }
    }
}