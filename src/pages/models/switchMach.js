import { 
    getGateway, getSwitch,  refreshGateway, syncGateway, getSwitchData, getRealtimeData, 
    pushTask, addTask, updateTask, delTask, getTaskList, turnOffSwitch, turnOnSwitch, getActionList,
    getSwitchTemp, setSwitchTemp,
    getSwitchParams, setSwitchParams,
    getSwitchLimitEle, setSwitchLimitEle,
    getSwitchAutoTrip, setSwitchAutoTrip,
    getSwitchAutoCombine, setSwitchAutoCombine
} from '../services/switchService';
import { message } from 'antd';
const initialState = {
    gatewayList:[],
    currentGateway:{},
    gatewayLoading:true,
    switchList:[],
    currentSwitch:{},
    // multi模式下，currentNode可能是网关设备也可能是空开设备
    currentNode:{},
    
    switchLoading:true,
    switchOption:{},
    taskList:[],
    actionList:[],
    actionLoading:true,
    currentPage:1,
    total:0,
    taskLoading:true,
    // 自动读取和存档
  
    // 节点数据,
    optionType:'1',
    switchData:[],
    switchDataLoading:true,
    // 空开实时数据
    realtimeData:{},
    // 批量操作，串行，执行完前一个获取结果再执行下一个，彼此状态独立
    optionType:'1',
    optionLoading:true,
    tempInfo:{},
    setterInfo:{},
    limitEleInfo:{},
    autoTripInfo:{},
    autoCombineInfo:{},
}

export default {
    namespace:'switchMach',
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
        *init(action, { put }){
            let { resolve, forceUpdate } = action.payload || {};
            yield put.resolve({ type:'fetchGateway', payload:{ multi:true }});
            yield put.resolve({ type:'fetchSwitchList', payload:{ forceUpdate }});
            yield put.resolve({ type:'fetchSwitchData' });
            if ( resolve && typeof resolve === 'function' ) resolve();
        },
        *refresh(action, { select, put, call }){
            try {
                let { switchMach:{ currentGateway }} = yield select();
                let { data } = yield call(refreshGateway, { mach_id:currentGateway.key });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchSwitchList' });
                }
            } catch(err){
                console.log(err);
            }
        },
        *sync(action, { select, put, call }){
            let { switchMach:{ currentGateway }} = yield select();
            let { resolve, reject } = action.payload || {};
            let { data } = yield call(syncGateway, { mach_id:currentGateway.key });
            if ( data && data.code === '0'){
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *fetchGateway(action, { put, call, select }){
            try {
                let { multi, single, forceUpdate } = action.payload || {};
                let { user:{ company_id }, switchMach:{ gatewayList }} = yield select();
                if ( !gatewayList.length || forceUpdate ) {
                    yield put({ type:'toggleGatewayLoading'});
                    let { data } = yield call(getGateway, { company_id });
                    if ( data && data.code === '0'){
                        yield put({ type:'getGateway', payload:{ data:data.data, multi, single }});
                    } 
                } else {
                    // 更新网关树的选择模式
                    yield put({ type:'updateGateway', payload:{ multi, single }});
                }     
            } catch(err){
                console.log(err);
            }  
        },
        *fetchSwitchList(action, { put, call, select }){
            try {
                let { user:{ company_id }, switchMach:{ currentGateway }} = yield select();
                yield put({ type:'toggleSwitchLoading'});                
                let { data } = yield call(getSwitch, { company_id, gateway_id:currentGateway.key });
                if ( data && data.code === '0'){
                    yield put({ type:'getSwitch', payload:{ data:data.data }});
                }
                
            } catch(err){
                console.log(err);
            }
        },
        *fetchSwitchData(action, { put, select, call }){
            try {
                let { user:{ company_id, timeType, startDate, endDate }, switchMach:{ currentSwitch }} = yield select();
                console.log(currentSwitch);

                if ( currentSwitch.key ) {
                    yield put({ type:'toggleSwitchDataLoading'});
                    let { data } = yield call(getSwitchData, { company_id, mach_id:currentSwitch.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD') });
                    if ( data && data.code === '0' ) {
                        yield put({ type:'getSwitchData', payload:{ data:data.data }})
                    }
                } 
            } catch(err){
                console.log(err);
            }
        },
        *fetchRealtimeData(action, { put, select, call }){
            try{
                let { user:{ company_id }, switchMach:{ currentSwitch }} = yield select();
                let { resolve, reject } = action.payload || {};
                if ( currentSwitch.key ){
                    yield put({ type:'toggleSwitchDataLoading'});
                    let { data } = yield call(getRealtimeData, { company_id, mach_id:currentSwitch.key });
                    if ( data && data.code === '0' ) {
                        yield put({ type:'getRealtime', payload:{ data:data.data }});
                        if ( resolve && typeof resolve === 'function' ) resolve();
                    } else {
                        if ( reject && typeof reject === 'function' ) reject(data.msg);
                        
                    }
                }           
            } catch(err){
                console.log(err);
            }
        },
        *fetchAddTask(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { values, resolve, reject, forEdit } = action.payload;
                values.company_id = company_id;
                let { data } = yield call( forEdit ? updateTask : addTask, values);
                if ( data && data.code === '0'){
                    yield put({ type:'fetchTaskList' });
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function') reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *initPlanner(action, { put, call, select }){
            yield put.resolve({ type:'fetchGateway'});
            yield put({ type:'fetchTaskList'});
        },
        *fetchTaskList(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { task_type, task_name, pageNum } = action.payload || {};
                task_type = task_type || '1';
                task_name = task_name || '';
                pageNum = pageNum || 1;
                yield put({ type:'toggleTaskLoading'});
                let { data } = yield call(getTaskList, { company_id, task_type, task_name, page:pageNum, pageSize:10 });
                if ( data && data.code === '0'){
                    yield put({ type:'getTaskList', payload:{ data:data.data, pageNum, total:data.count }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *pushTask(action, { put, call, select }){
            let { user:{ company_id }} = yield select();
            let { resolve, reject, task_id } = action.payload || {};
            let { data } = yield call(pushTask, { company_id, task_id });
            if ( data && data.code === '0'){
                yield put({ type:'fetchTaskList'});
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
            }
        },
        *fetchDelTask(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { task_id, resolve, reject } = action.payload;
                let { data } = yield call(delTask, { company_id, task_id });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchTaskList' });
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function') reject(data.msg);
                }
            } catch(err){
                
                console.log(err);
            }
        },
        // 温度，功率、电流，电压，剩余电流，功率因素
        *fetchTurnOn(action, { put, select, call}){
            try {
                let { switchMach:{ switchList }} = yield select();
                let { mach_id, resolve, reject, auto } = action.payload;
                let { data } = yield call(turnOnSwitch, { mach_id });
                let temp = switchList.filter(i=>i.mach_id === mach_id)[0];
                let mach_name = temp ? temp.meter_name : ''
                if ( data && data.code === '0'){
                    if ( resolve && typeof resolve === 'function') resolve();
                    if ( auto ){  
                        message.success(`${mach_name}合闸操作成功!`, 10);
                    } else {
                        yield put({ type:'fetchSwitchList' });
                    }
                } else {
                    if ( auto ){
                        message.error(`${mach_name}合闸操作失败!`, 10);
                    }
                    if ( reject && typeof reject === 'function') reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *fetchTurnOff(action, { put, select, call}){
            try {
                let { switchMach:{ switchList }} = yield select();
                let { mach_id, resolve, reject, auto } = action.payload;
                let { data } = yield call(turnOffSwitch, { mach_id });
                let temp = switchList.filter(i=>i.mach_id === mach_id)[0];
                let mach_name = temp ? temp.meter_name : ''
                if ( data && data.code === '0'){
                    if ( resolve && typeof resolve === 'function') resolve();
                    if ( auto ){  
                        message.success(`${mach_name}分断操作成功!`, 10);
                    } else {
                        yield put({ type:'fetchSwitchList' });
                    }
                } else {
                    if ( auto ){
                        message.error(`${mach_name}分断操作失败!`, 10);
                    }
                    if ( reject && typeof reject === 'function') reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        // 获取/设置空开温控参数
        *initTemp(action, { put }){
            yield put.resolve({ type:'fetchGateway', payload:{ single:true }});
            yield put({ type:'fetchTemp'});
        },
        *fetchTemp(action, { put, select, call }){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                let { data } = yield call(getSwitchTemp, { mach_id:currentSwitch.key });
                if ( data && data.code === '0'){
                    yield put({ type:'getTemp', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *setTemp(action, { put, select, call }){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                let { resolve, reject, values } = action.payload || {};
                let { data } = yield call(setSwitchTemp, { mach_id:currentSwitch.key, ...values });
                if ( data && data.code === '0'){
                    if ( resolve && typeof resolve === 'function') resolve();
                    yield put({ type:'fetchTemp'});
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        // 获取/设置空开控制参数
        *fetchParams(action, { put, select, call }){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                let { data } = yield call(getSwitchParams, { mach_id:currentSwitch.key });
                if ( data && data.code === '0'){
                    yield put({ type:'getParams', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *setParams(action, { put, select, call }){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                let { resolve, reject, values } = action.payload || {};
                let { data } = yield call(setSwitchParams, { mach_id:currentSwitch.key, ...values });
                if ( data && data.code === '0'){
                    if ( resolve && typeof resolve === 'function') resolve();
                    yield put({ type:'fetchParams'});
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        // 获取/设置空开限制电流
        *fetchLimitEle(action, { put, select, call}){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                let { data } = yield call(getSwitchLimitEle, { mach_id:currentSwitch.key });
                if ( data && data.code === '0' ) {
                    yield put({ type:'getLimitEle', payload:{ data:data.data }})
                }
            } catch(err){
                console.log(err);
            }
        },
        *setLimitEle(action, { put, select, call }){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                let { resolve, reject, values } = action.payload || {};
                let { data } = yield call(setSwitchLimitEle, { mach_id:currentSwitch.key, ...values });
                if ( data && data.code === '0'){
                    if ( resolve && typeof resolve === 'function') resolve();
                    yield put({ type:'fetchLimitEle'});
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        // 获取/设置空开自动脱扣
        *fetchAutoTrip(action, { put, select, call }){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                let { data } = yield call(getSwitchAutoTrip, { mach_id:currentSwitch.key });
                if ( data && data.code === '0' ) {
                    yield put({ type:'getAutoTrip', payload:{ data:data.data }})
                }
            } catch(err){
                console.log(err);
            }
        },
        *setAutoTrip(action, { put, select, call }){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                let { resolve, reject, values } = action.payload || {};
                let { data } = yield call(setSwitchAutoTrip, { mach_id:currentSwitch.key, ...values });
                if ( data && data.code === '0'){
                    if ( resolve && typeof resolve === 'function') resolve();
                    yield put({ type:'fetchAutoTrip'});
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        // 获取/设置空开自动重合闸参数
        *fetchAutoCombine(action, { put, select, call }){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                let { data } = yield call(getSwitchAutoCombine, { mach_id:currentSwitch.key });
                if ( data && data.code === '0'){
                    yield put({ type:'getAutoCombine', payload:{ data:data.data }});
                }
            } catch(err){
                
            }
        },
        *setAutoCombine(action, { put, select, call}){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                let { resolve, reject, values } = action.payload || {};
                yield put({ type:'toggleOptionLoading'});
                let { data } = yield call(setSwitchAutoCombine, { ...values, mach_id:currentSwitch.key });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchAutoCombine'});
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function') reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        
        // 添加网关通过地图插件，允许用户输入地址来获取到坐标值
        *fetchAction(action, { put, select, call}){
            try {
                let { user:{ company_id }, } = yield select();
                let { pageNum } = action.payload || {};
                pageNum = pageNum || 1;
                yield put({ type:'toggleActionLoading'});
                let { data } = yield call(getActionList, { company_id, page:pageNum, pageSize:15 });
                if ( data && data.code === '0'){
                    yield put({ type:'getAction', payload:{ data:data.data, pageNum, total:data.count }})
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
        toggleSwitchLoading(state){
            return { ...state, switchLoading:true };
        },
        toggleTaskLoading(state){
            return { ...state, taskLoading:true };
        },
        toggleActionLoading(state){
            return { ...state, actionLoading:true };
        },
        toggleSwitchDataLoading(state){
            return { ...state, switchDataLoading:true };
        },
        toggleOptionLoading(state){
            return { ...state, optionLoading:true };
        },
        getGateway(state, { payload:{ data, multi, single}}){
            let { gateways } = data;
            let currentGateway = gateways && gateways.length ? gateways[0] : {}; 
            let currentSwitch = currentGateway.children && currentGateway.children.length ? currentGateway.children[0] : {};
            if ( gateways.length ) {  
                if ( multi ){
                    gateways.forEach(item=>{
                        if ( item.key === currentGateway.key ) {  
                            item.className = 'selected-parent';
                        }
                    })
                } else if ( single ){
                    gateways.forEach(item=>{
                        if( item.is_gateway ){
                            item.disabled = true;
                        }
                    })
                }                              
            }
            return { ...state, gatewayList:gateways, currentGateway, currentSwitch, currentNode:currentGateway, gatewayLoading:false };
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
        getSwitch(state, { payload:{ data }}){
            let { meterList } = data;
            // meterList = meterList.map((item,index)=>{
            //     if ( index % 2 === 0){
            //         item.meter_name = item.meter_name + '-' + item.meter_name;
            //     }
            //     return item;
                
            // });
            return { ...state, switchList:meterList, switchLoading:false };
        },
        getSwitchData(state, { payload:{ data }}){
            return { ...state, switchData:data, switchDataLoading:false };
        },
        getRealtime(state, { payload:{ data }}){
            return { ...state, realtimeData:data, switchDataLoading:false };
        },
        toggleGateway(state, { payload, updateSwitch }){
            let currentSwitch;
            if ( updateSwitch ){
                currentSwitch = updateSwitch;
            } else {
                currentSwitch = payload.children && payload.children.length ? payload.children[0] : {}
            }
            if ( state.gatewayList.length ) {
                state.gatewayList.forEach(item=>{
                    if ( item.key === payload.key ) {  
                        item.className = 'selected-parent';
                    } else {
                        item.className = '';
                    }
                })
            }
            return { ...state, currentGateway:payload, currentSwitch };
        },
        toggleSwitch(state, { payload }){
            return { ...state, currentSwitch:payload };
        },
        toggleNode(state, { payload }){
            return { ...state, currentNode:payload };
        },
        toggleOptionType(state, { payload }){
            return { ...state, optionType:payload };
        },

        getTemp(state, { payload:{ data }}){
            let { params } = data;
            return { ...state, tempInfo:params };
        },
        getParams(state, { payload:{ data }}){
            let { params } = data;
            return { ...state, setterInfo:params };
        },
        getLimitEle(state, { payload:{ data }}){
            let { params } = data;
            return { ...state, limitEleInfo:params };
        },
        getAutoTrip(state, { payload:{ data }}){
            let { params } = data;
            return { ...state, autoTripInfo:params };
        },
        getAutoCombine(state, { payload:{ data }}){
            let { params } = data;
            return { ...state, autoCombineInfo:params, optionLoading:false }
        },

        getAction(state, { payload:{ data, pageNum, total }}){
            return { ...state, actionList:data, currentPage:pageNum, total, actionLoading:false };
        },
        getTaskList(state, { payload:{ data, pageNum, total }}){
            return { ...state, taskList:data, taskLoading:false, currentPage:pageNum, total };
        },
        // setSyncGateways(state, { payload }){
        //     localStorage.setItem('syncGateways', JSON.stringify(payload));
        //     return { ...state, syncGateways:payload };
        // },
        reset(state){
            return initialState;
        }
    }
}