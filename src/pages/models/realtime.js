import { getMeterTrend } from '../services/realtimeService';
const initialState = {
    optionType:'1',
    chartLoading:true,
    chartInfo:{}
}

export default {
    namespace:'realtime',
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
            yield put({ type:'cancelChartInfo'});
            yield put({ type:'reset'});
        },
        *init(action, { put }){
            yield put.resolve({ type:'switchMach/fetchGateway', payload:{ single:true } });
            yield put.resolve({ type:'fetchChartInfo'});
        },
        *fetchChartInfo(action, { call, put, select }){
            yield put({ type:'cancelChartInfo'});
            yield put.resolve({ type:'cancelable', task:fetchChartInfoCancelable, action:'cancelChartInfo' });
            function* fetchChartInfoCancelable(params){
                try {
                    yield put({ type:'toggleChartLoading'});
                    let { user:{ company_id, startDate, endDate, timeType }, switchMach:{ currentSwitch }, realtime:{ optionType }} = yield select();                    
                    let { data } = yield call(getMeterTrend, { company_id, mach_id:currentSwitch.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, type:optionType  });
                    if ( data && data.code === '0'){
                        yield put({ type:'getChartInfo', payload:{ data:data.data }});
                    } 
                    
                } catch(err){
                    console.log(err);
                }
            }
        }
    },
    reducers:{
        toggleChartLoading(state){
            return { ...state, chartLoading:true };
        },
        getChartInfo(state, { payload:{ data }}){
            return { ...state, chartInfo:data, chartLoading:false };
        },
        toggleOptionType(state, { payload }){
            return { ...state, optionType:payload };
        },
        
        reset(state){
            return initialState;
        }
    }
}