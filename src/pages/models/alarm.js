import { 
    getAlarmAnalyze, getTodayAlarm, 
    getAlarmHistory,  getLogType, confirmRecord, getProgressLog, uploadImg,
    getMachs, 
    getRuleList, getRuleType, addRule, updateRule, deleteRule 
} from '../services/alarmService';
const initialState = {
    sumAlarm:{},
    todayAlarm:{},
    sourceData:[],
    isLoading:true,
    currentPage:1,
    total:0,
    cateCode:'0',
    logTypes:[],
    progressLog:[],
    historyLog:[],
    // 告警规则状态
    ruleList:[],
    ruleType:[],
    ruleMachs:[]
}

export default {
    namespace:'alarm',
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
           
            yield put({ type:'reset'});
        },
        *fetchAlarmSum(action, { call, put, select }){        
            try {
                let { user:{ company_id }} = yield select();
                let { data } = yield call(getAlarmAnalyze,  { company_id });
                if ( data && data.code === '0'){
                    yield put({ type:'getAlarmAnalyze', payload:{ data:data.data }});
                }                      
                 
            } catch(err){
                console.log(err);
            }  
        },
        *initTodayAlarm(action, { call, put }){
            yield put.resolve({ type:'switchMach/fetchGateway'})
            yield put.resolve({ type:'fetchTodayAlarm'});
        },
        *fetchTodayAlarm(action, { call, put, select }){
            try {
                let { user:{ company_id, startDate, endDate }, switchMach:{ currentNode }, alarm:{ cateCode }} = yield select();
                let params = {};
                params.company_id = company_id;
                params.cate_code = cateCode;
                params.begin_date = startDate.format('YYYY-MM-DD');
                params.end_date = endDate.format('YYYY-MM-DD'); 
                if ( currentNode.is_gateway ) {
                    params.gateway_id = currentNode.key;
                } else {
                    params.mach_id = currentNode.key;
                }
                let { data } = yield call(getTodayAlarm, params);
                if ( data && data.code === '0') {
                    yield put({ type:'getTodayAlarm', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *initAlarmHistory(action ,{ call, put }){
            yield put.resolve({ type:'switchMach/fetchGateway'});
            yield put({ type:'fetchAlarmHistory' });
            yield put({ type:'fetchLogType'});
        },
        *fetchLogType(action, { put, call }){
            let { data } = yield call(getLogType);
            if ( data && data.code === '0'){
                yield put({ type:'getLogType', payload:{ data:data.data }});
            }
        },
        *fetchProgressInfo(action, { call, put}){
            try {
                let { data } = yield call(getProgressLog, { record_id:action.payload });
                if ( data && data.code === '0' ){
                    yield put({type:'getProgress', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *confirmRecord(action, { select, call, put, all }){
            try {
                let { user:{ company_id }} = yield select();
                let { resolve, reject, values } = action.payload;
                // photos字段是上传到upload接口返回的路径
                let uploadPaths;
                if ( values.photos && values.photos.length ) {
                    let imagePaths = yield all([
                        ...values.photos.map(file=>call(uploadImg, { file }))
                    ]);
                    uploadPaths = imagePaths.map(i=>i.data.data.filePath);
                } 
                let { data } = yield call(confirmRecord, { company_id, record_id:values.record_id, photos:uploadPaths, log_desc:values.log_desc, oper_code:values.oper_code, type_id:values.type_id });                 
                if ( data && data.code === '0'){
                    resolve();
                    yield put({ type:'fetchAlarmHistory'});
                } else {
                    reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *fetchAlarmHistory(action, { call, put, select }){
            try {
                let { pageNum } = action.payload || {};
                let { user:{ company_id, startDate, endDate }, switchMach:{ currentNode }, alarm:{ cateCode }} = yield select();
                let params = {};
                pageNum = pageNum || 1;
                params.company_id = company_id;
                params.cate_code = cateCode;
                params.begin_date = startDate.format('YYYY-MM-DD');
                params.end_date = endDate.format('YYYY-MM-DD'); 
                if ( currentNode.is_gateway ) {
                    params.gateway_id = currentNode.key;
                } else {
                    params.mach_id = currentNode.key;
                }
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getAlarmHistory, params);
                if ( data && data.code === '0') {
                    yield put({ type:'getHistory', payload:{ data:data.data, pageNum }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *initAlarmSetting(action, { call, put }){
            yield put({ type:'fetchRule'});
            yield put({ type:'fetchMachs'});
            yield put({ type:'fetchRuleType'});
        },
        // 安全设置相关code
        *fetchRule(action, { select, call, put }){
            try {
                let { user:{ company_id }} = yield select();
                let { data } = yield call(getRuleList, { company_id });
                if ( data && data.code === '0'){
                    yield put({type:'getRule', payload:{ data:data.data }});
                }
            } catch(err) {  
                console.log(err);
            }
        },
        *fetchMachs(action, { select, call, put}){
            try{
                let { user:{ company_id }} = yield select();
                let { data } = yield call(getMachs, { company_id });
                if ( data && data.code === '0'){
                    yield put({ type:'getMachs', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *fetchRuleType(action, { select, call, put}){
            try {
                let { user:{ company_id }} = yield select();
                let { data } = yield call(getRuleType, { company_id });
                if ( data && data.code === '0'){
                    yield put({type:'getRuleType', payload: { data:data.data }})
                }
            } catch(err){
                console.log(err);
            }
        },
        *addRule(action, { select, call, put}){
            try {
                let { user:{ company_id }} = yield select();
                let { values, resolve, reject } = action.payload;
                values.company_id = company_id;
                values.level = values.level == 1 ? 3 : values.level == 3 ? 1 : 2;
                let { data } = yield call(addRule, values);
                if ( data && data.code === '0'){
                    yield put({type:'fetchRule'});
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *updateRule(action, { call, put}){
            try {
                let { values, resolve, reject } = action.payload;
                let { data } = yield call(updateRule, values);
                if ( data && data.code === '0'){
                    yield put({type:'fetchRule'});
                    if ( resolve ) resolve();
                } else if ( data && data.code === '1001') {
                    yield put({ type:'user/loginOut'});
                } else {
                    if ( reject ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *deleteRule(action , { call, put}){
            try {
                let rule_id = action.payload;
                let { data } = yield call(deleteRule, { rule_id });
                if ( data && data.code === '0'){
                    yield put({type:'fetchRule'});
                } else if ( data && data.code === '1001') {
                    yield put({ type:'user/loginOut'});
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
        getAlarmAnalyze(state, { payload:{ data }}){
            return { ...state, sumAlarm:data };
        },
        getTodayAlarm(state, { payload:{ data }}){
            return { ...state, todayAlarm:data };
        },
        toggleAlarmType(state, { payload }){
            return { ...state, cateCode:payload };
        },
        getHistory(state, { payload:{ data, pageNum }}){
            return { ...state, sourceData:data, currentPage:pageNum, isLoading:false };
        },
        getLogType(state, { payload:{ data }}){
            return { ...state, logTypes:data };
        },
        getProgress(state, { payload :{ data }}){
            return { ...state, progressLog:data };
        },
        getRule(state, { payload : { data }}){
            return { ...state, ruleList:data };
        },
        getRuleType(state, { payload:{data}}){
            return { ...state, ruleType:data };
        },
        getMachs(state, { payload:{ data }}){
            return { ...state, ruleMachs:data };
        },
        setPage(state, { payload }){
            return { ...state, currentPage:payload };
        },
        reset(state){
            return initialState;
        }
    }
}