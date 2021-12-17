import { getLoginLog, getActionLog } from '../services/logService';

const initialState = {
    logData:{},
    logType:'',
    currentPage:1,
    total:0,
    isLoading:false,  
};

export default {
    namespace:'log',
    state:initialState,
    effects:{
        *fetchLog(action, {call, select, all, put}){ 
            try {
                let { user:{ company_id, userInfo }} = yield select();
                let { currentPage, logType } = action.payload || {};
                currentPage = currentPage || 1;
                logType = logType || 'login'
                yield put({type:'toggleLoading'});
                let { data } = yield call(
                    logType === 'login' ? getLoginLog : getActionLog,
                    { company_id, agent_id:userInfo.agent_id, page:currentPage, pagesize:12 } 
                );
                if ( data && data.code === '0'){
                    yield put({type:'getLoginLog', payload:{ data:data.data, total:data.count, currentPage }});
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
        getLoginLog(state, { payload:{ data, currentPage, total }}){
            return { ...state, logData:data, currentPage, total, isLoading:false };
        },
        reset(){
            return initialState;
        }
    }
}
