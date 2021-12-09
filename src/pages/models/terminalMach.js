import { getSwitchList, getSwitchDetail } from '../services/gatewayService';
import moment from 'moment';
var date = new Date();
const initialState = {
    // 所有设备类型
    typeList:[],
    currentType:{},
    // 某种具体设备
    machList:[],
    // 用于加载设备列表
    isLoading:true,
    // 用于加载设备详情
    machLoading:true,
    machDetailInfo:{},
    currentPage:1,
    total:0
}

export default {
    namespace:'terminalMach',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        // 统一管理所有action
        *init(action, { put }){
            yield put.resolve({ type:'fetchMachTypes'});
            yield put.resolve({ type:'fetchSeriesMach'});
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'reset'});
        },
        *fetchMachList(action, { put, select, call }){
            try {
                let { user:{ company_id }} = yield select();
                let { currentPage } = action.payload || {};
                currentPage = currentPage || 1;
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getSwitchList, { company_id, page:currentPage, pagesize:12 });   
                if ( data && data.code === '0'){
                    yield put({ type:'getSwitchList', payload:{ data:data.data, currentPage, total:data.count }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *fetchMachDetail(action, { put, select, call }){
            yield put({ type:'cancelMachDetail'});
            yield put({ type:'cancelable', task:fetchMachDetailCancelable, action:'cancelMachDetail' });
            function* fetchMachDetailCancelable(params){
                let { mach_id, referDate } = action.payload || {};
                referDate = referDate || moment(new Date());
                yield put({ type:'toggleMachLoading'});
                let { data } = yield call(getSwitchDetail, { mach_id, date_time:referDate.format('YYYY-MM-DD') });
                if ( data && data.code === '0'){
                    yield put({ type:'getMachDetail', payload:{ data:data.data }});
                }
            }
        },
        *resetMachDetail(action, { put }){
            yield put({ type:'cancelMachDetail'});
            yield put({ type:'resetMach'});
        },
        // *fetchMachTypes(action, { call, put, select }){
        //     yield put({ type:'cancelMachTypes'});
        //     yield put.resolve({ type:'cancelable', task:fetchMachTypesCancelable, action:'cancelMachTypes' });
        //     function* fetchMachTypesCancelable(params){
        //         try {
        //             let { user:{ company_id }} = yield select();
        //             let { data } = yield call(getMachTypes, { company_id });
        //             if ( data && data.code === '0'){
        //                 yield put({ type:'getMachTypes', payload:{ data:data.data }});
        //             } else {
                        
        //             }
        //         } catch(err){
        //             console.log(err);
        //         }
        //     }
        // },
        // *fetchSeriesMach(action, { call, put, select }){
        //     yield put({ type:'cancelSeriesMach'});
        //     yield put.resolve({ type:'cancelable', task:fetchSeriesMachCancelable, action:'cancelSeriesMach' });
        //     function* fetchSeriesMachCancelable(params){
        //         try {
        //             yield put({ type:'toggleLoading'});
        //             let { user:{ company_id }, terminalMach:{ currentType } } = yield select();
        //             let { page } = action.payload || {};
        //             page = page || 1;
        //             // console.log(currentType);
        //             let { data } = yield call(getSeriesMach, { company_id, type:currentType.key, page, pagesize:12 });
        //             if ( data && data.code === '0'){
        //                 yield put({ type:'getSeriesMach', payload:{ data:data.data, currentPage:page, total:data.count }});
        //             } else {
        //             }
        //         } catch(err){
        //             console.log(err);
        //         }
        //     }
        // },
        // *resetMachDetail(action, { put }){
        //     yield put({ type:'cancelMachDetail'});
        //     yield put({ type:'resetMach'});
        // },
        // *fetchMachDetail(action, { call, put, select }){
        //     yield put.resolve({ type:'cancelable', task:fetchMachDetailCancelable, action:'cancelMachDetail' });
        //     function* fetchMachDetailCancelable(params){
        //         try {
        //             yield put({ type:'toggleMachLoading'});
        //             let { user:{ company_id}, terminalMach:{ currentMach } } = yield select();
        //             let { referDate } = action.payload || {};
        //             referDate = referDate || moment(new Date());
        //             let { data } = yield call(getMachDetail, { company_id, mach_id:currentMach.mach_id, date_time:referDate.format('YYYY-MM-DD')  });
        //             if ( data && data.code === '0'){
        //                 yield put({ type:'getMachDetail', payload:{ data:data.data }});
        //             } else {
        //             }
        //         } catch(err){
        //             console.log(err);
        //         }
        //     }
        // }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        toggleMachLoading(state){
            return { ...state, machLoading:true };
        },
        getSwitchList(state, { payload:{ data, currentPage, total }}){
            return { ...state, machList:data, currentPage, total, isLoading:false };
        },
        getMachDetail(state, { payload:{ data }}){
            return { ...state, machDetailInfo:data, machLoading:false };
        },
        // getMachTypes(state, { payload:{ data }}){
        //     let currentType = data && data.length ? data[0] : {};
        //     data = data.filter(i=>i.key !== 'all');
        //     return { ...state, typeList:data };
        // },
        // getSeriesMach(state, { payload:{ data, currentPage, total }}){
        //     return { ...state, machList:data.meterList || [], total, currentPage, isLoading:false };
        // },
        // getMachDetail(state, { payload:{ data }}){
        //     return { ...state, machDetailInfo:data, machLoading:false };
        // },
        // toggleMachType(state, { payload }){
        //     return { ...state, currentType:payload, machList:[] };
        // },
        setCurrentMach(state, { payload }){
            return { ...state, currentMach:payload };
        },
        resetMach(state){
            return { ...state, machLoading:true, machDetailInfo:{} };
        },
        reset(state){
            return initialState;
        }
    }
}