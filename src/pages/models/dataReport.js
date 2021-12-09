import { getExtremeReport, getCostReport, getEleReport, getWarningList, getSameRate, getAdjoinRate } from '../services/dataReportService';
const initialState = {
    sourceData:[],
    isLoading:true,
    currentPage:1,
    total:0,
    cateCode:'1',
    warningStatus:'1',
    eleType:'1'
}

export default {
    namespace:'dataReport',
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
            console.log('all');
            yield put({ type:'cancelExtremeReport'});
            yield put({ type:'cancelCostReport'});  
            yield put({ type:'cancelEleReport'});      
            yield put({ type:'reset'});
        },
        *fetchExtremeReport(action, { call, put, select }){
            yield put({ type:'cancelExtremeReport'});
            yield put.resolve({ type:'cancelable', task:fetchExtremeReportCancelable, action:'cancelExtremeReport' });
            function* fetchExtremeReportCancelable(params){
                try {
                    yield put({ type:'toggleLoading'});
                    let { global:{ companyId, currentAttr, startDate, endDate, timeType, pagesize }, costReport:{ eleType }} = yield select();
                    console.log(companyId);
                    if ( Object.keys(currentAttr).length ){
                        let { data } = yield call(getExtremeReport, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, energy_type:eleType });
                        if ( data && data.code === '0'){
                            yield put({ type:'getCostReport', payload:{ data:data.data }});
                        }                      
                    } else {
                        yield put.resolve({ type:'global/fieldInit'});
                        let { global:{ currentAttr }} = yield select();
                        let { data } = yield call(getExtremeReport, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, energy_type:eleType  });
                        if ( data && data.code === '0'){
                            yield put({ type:'getCostReport', payload:{ data:data.data }});
                        } 
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *fetchSameRate(action, { call, put, select }){
            yield put({ type:'cancelSameRate'});
            yield put.resolve({ type:'cancelable', task:fetchSameRateCancelable, action:'cancelSameRate' });
            function* fetchSameRateCancelable(params){
                try {
                    yield put({ type:'toggleLoading'});
                    let { global:{ companyId, currentAttr, startDate, endDate, timeType }} = yield select();
                    if ( Object.keys(currentAttr).length ){
                        let { data } = yield call(getSameRate, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType });
                        if ( data && data.code === '0'){
                            yield put({ type:'getCostReport', payload:{ data:data.data }});
                        }                      
                    } else {
                        yield put.resolve({ type:'global/fieldInit'});
                        let { global:{ currentAttr }} = yield select();
                        let { data } = yield call(getSameRate, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType  });
                        if ( data && data.code === '0'){
                            yield put({ type:'getCostReport', payload:{ data:data.data }});
                        } 
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *fetchAdjoinRate(action, { call, put, select }){
            yield put({ type:'cancelAdjoinRate'});
            yield put.resolve({ type:'cancelable', task:fetchAdjoinRateCancelable, action:'cancelAdjoinRate' });
            function* fetchAdjoinRateCancelable(params){
                try {
                    yield put({ type:'toggleLoading'});
                    let { global:{ companyId, currentAttr, startDate, endDate, timeType }} = yield select();
                    if ( Object.keys(currentAttr).length ){
                        let { data } = yield call(getAdjoinRate, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType });
                        if ( data && data.code === '0'){
                            yield put({ type:'getCostReport', payload:{ data:data.data }});
                        }                      
                    } else {
                        yield put.resolve({ type:'global/fieldInit'});
                        let { global:{ currentAttr }} = yield select();
                        let { data } = yield call(getAdjoinRate, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType  });
                        if ( data && data.code === '0'){
                            yield put({ type:'getCostReport', payload:{ data:data.data }});
                        } 
                    }
                } catch(err){
                    console.log(err);
                }
            }
        },
        *fetchCostReport(action, { call, put, select }){
            yield put({ type:'cancelCostReport'});
            yield put.resolve({ type:'cancelable', task:fetchCostReportCancelable, action:'cancelCostReport' });
            function* fetchCostReportCancelable(params){
                try {
                    yield put({ type:'toggleLoading'});
                    let { global:{ companyId, currentAttr, startDate, endDate, timeType }} = yield select();                 
                    let { data } = yield call(getCostReport, { company_id:companyId, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType  });
                    if ( data && data.code === '0'){
                        yield put({ type:'getCostReport', payload:{ data:data.data }});
                    }                  
                } catch(err){
                    console.log(err);
                }
            }
        },
        *initEleReport(action, { put }){
            console.log('a');
            yield put.resolve({ type:'fields/init'});
            console.log('b');
            yield put.resolve({ type:'fetchEleReport'});
        },
        *cancelEleReport(action, { put }){
            yield put({ type:'cancelEle'});
            yield put({ type:'reset'});
        },
        *fetchEleReport(action, { call, put, select }){
            yield put({ type:'cancelEle'});
            yield put.resolve({ type:'cancelable', task:fetchEleReportCancelable, action:'cancelEle' });
            function* fetchEleReportCancelable(params){
                try {
                    yield put({ type:'toggleLoading'});
                    let { user:{ company_id, timeType, startDate, endDate }, fields:{ currentAttr }} = yield select();                 
                    let { data } = yield call(getEleReport, { company_id, attr_id:currentAttr.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, energy_type: '2'  });
                    if ( data && data.code === '0'){
                        yield put({ type:'getCostReport', payload:{ data:data.data }});
                    }                 
                } catch(err){
                    console.log(err);
                }
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getCostReport(state, { payload:{ data }}){
            return { ...state, sourceData:data, isLoading:false, currentPage:1 };
        },
        toggleEleType(state, { payload }){
            return { ...state, eleType:payload };
        },
        setPage(state, { payload }){
            return { ...state, currentPage:payload };
        },
        reset(state){
            return initialState;
        }
    }
}