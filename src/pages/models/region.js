import { getManagerList, addManager, updateManager, delManager } from '../services/regionService';
const initialState = {
    managerList:[],
    isLoading:true,
    currentPage:1,
    total:0
}

export default {
    namespace:'region',
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
        *fetchManagerList(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { name, page } = action.payload || {};
                page = page || 1;
                let obj = {};
                obj.company_id = company_id;
                obj.page = page;
                obj.pagesize = 15;
                if ( name ){
                    obj.name = name;
                }
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getManagerList, obj);
                if ( data && data.code === '0'){
                    yield put({ type:'getListResult', payload:{ data:data.data, total:data.count, page }});
                } 
            } catch(err){
                console.log(err);
            }  
        },
        *add(action, { put, call, select }){
            try {
                let { values, resolve, reject, forEdit } = action.payload || {};
                let { user:{ company_id }} = yield select();  
                let params = { ...values, company_id };
                if ( forEdit ){
                    params['person_id'] = values.person_id; 
                }      
                let { data } = yield call( forEdit ? updateManager : addManager, params );
                if ( data && data.code === '0'){
                    yield put({ type:'fetchManagerList' });
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
                let { resolve, reject, person_id } = action.payload || {};
                let { data } = yield call(delManager, { person_id });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchManagerList' });
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
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getListResult(state, { payload:{ data, total, page } }){
            return { ...state, managerList:data, total, currentPage:page, isLoading:false };
        },
        
    
        reset(state){
            return initialState;
        }
    }
}