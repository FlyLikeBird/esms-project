import { getSwitchList, addSwitch, updateSwitch, deleteSwitch, getSwitchModel } from '../services/gatewayService';
const initialState = {
    switchList:[],
    switchModel:[],
    currentSwitch:{},
    switchLoading:true,
    currentPage:1,
    total:0
}

export default {
    namespace:'controller',
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
        *init(state, { put, select }){
            yield put({ type:'switchMach/fetchGateway' });
            yield put({ type:'fetchSwitchList'});
            yield put({ type:'fetchSwitchModel'});
            yield put({ type:'region/fetchManagerList'});
        },
        *fetchSwitchList(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { currentPage, forceUpdate } = action.payload || {};
                currentPage = currentPage || 1;
                let { data } = yield call(getSwitchList, { company_id, page:currentPage, pagesize:14 });
                if ( data && data.code === '0'){
                    yield put({ type:'getSwitchList', payload:{ data:data.data, currentPage, total:data.count }});
                    // 当网关列表有修改时及时更新其他模块的网关树结构
                    if ( forceUpdate ){
                        yield put({ type:'switchMach/fetchGateway', payload:{ forceUpdate:true }});
                    }
                } 
            } catch(err){
                console.log(err);
            }  
        },
        *fetchSwitchModel(action, { put, call, select }){
            try {
                let { data } = yield call(getSwitchModel);
                if ( data && data.code === '0'){
                    yield put({ type:'getSwitchModel', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *add(action, { put, call, select }){
            try {
                let { values, resolve, reject, forEdit } = action.payload || {};
                let { gateway_id, meter_name, register_code, model_code, order_by, mach_id, person_id, switch_parent } = values;
                let { user:{ company_id }} = yield select();  
                let params = { company_id, meter_name, register_code, gateway_id, model_code, order_by, person_id, switch_parent };
                if ( forEdit ){
                    params['mach_id'] = mach_id; 
                }      
                let { data } = yield call( forEdit ? updateSwitch : addSwitch, params );
                if ( data && data.code === '0'){
                    yield put({ type:'fetchSwitchList', payload:{ forceUpdate:true } });
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
                let { data } = yield call(deleteSwitch, { company_id, mach_id });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchSwitchList', payload:{ forceUpdate:true } });
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
        getSwitchList(state, { payload:{ data, currentPage, total }}){
            return { ...state, switchList:data, currentPage, total };
        },
        getSwitchModel(state, { payload:{ data }}){
            return { ...state, switchModel:data };
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