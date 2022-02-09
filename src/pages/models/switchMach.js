import { 
    getGateway, getSwitch,  refreshGateway, syncGateway, getSwitchData, getRealtimeData, selfCheck,
    getAutoLoadSwitch, saveAutoLoadSwitch,
    pushTask, addTask, updateTask, delTask, getTaskList, turnOffSwitch, turnOnSwitch, getActionList,
    getSwitchTemp, setSwitchTemp,
    getSwitchParams, setSwitchParams,
    getSwitchLimitEle, setSwitchLimitEle,
    getSwitchAutoTrip, setSwitchAutoTrip,
    getSwitchAutoCombine, setSwitchAutoCombine
} from '../services/switchService';
import { getSwitchList, getSwitchDetail } from '../services/gatewayService';
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
    taskList:[],
    actionList:[],
    actionLoading:true,
    currentPage:1,
    total:0,
    taskLoading:true,
    // 自动读取和存档
    autoLoading:false,
    autoLoadSwitchList:[],
    // 空开的节点数据和详情数据
    switchDetail:{},
    detailLoading:true,
    optionType:'1',
    switchData:[],
    switchDataLoading:true,
    // 空开实时数据
    realtimeData:[],
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
            yield put.resolve({ type:'fetchGateway' });
            yield put({ type:'fetchSwitchList' });
            yield put({ type:'fetchSwitchData' });
            // 获取空开的模型库数据，添加快捷修改设备名功能
            yield put({ type:'controller/fetchSwitchList'});
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
        *fetchSelfCheck(action, { put, call }){
            let { mach_id, resolve, reject } = action.payload || {};
            let { data } = yield call(selfCheck, { mach_id });
            if ( data && data.code === '0'){
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
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
                if ( currentGateway.key ){
                    yield put({ type:'toggleSwitchLoading', payload:true });                              
                    let { data } = yield call(getSwitch, { company_id, gateway_id:currentGateway.key });
                    if ( data && data.code === '0'){
                        yield put({ type:'getSwitch', payload:{ data:data.data }});
                    }
                } else {
                    yield put({ type:'toggleSwitchLoading', payload:false });
                } 
            } catch(err){
                console.log(err);
            }
        },
        *fetchSwitchDetail(action, { put, select, call }){
            yield put.resolve({ type:'cancelSwitchDetail'});
            yield put.resolve({ type:'cancelable', task:fetchSwitchCancelable, action:'cancelSwitchDetail' });
            function* fetchSwitchCancelable(params){
                let { mach_id, referDate } = action.payload || {};
                yield put({ type:'toggleDetailLoading'});
                let { data } = yield call(getSwitchDetail, { mach_id, date_time:referDate.format('YYYY-MM-DD') });
                if ( data && data.code === '0'){
                    yield put({ type:'getSwitchDetail', payload:{ data:data.data }});
                }
            }
        },
        *fetchSwitchData(action, { put, select, call }){
            try {
                let { user:{ company_id, timeType, startDate, endDate }, switchMach:{ currentNode }} = yield select();
                let { resolve, reject } = action.payload || {};
                if ( currentNode.key ) {
                    yield put({ type:'toggleSwitchDataLoading', payload:true });
                    let { data } = yield call(getSwitchData, { company_id, mach_id:currentNode.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD') });
                    if ( data && data.code === '0' ) {
                        yield put({ type:'getSwitchData', payload:{ data:data.data }});
                        if ( resolve && typeof resolve === 'function' ) resolve();
                    } else {
                        if ( reject && typeof reject === 'function' ) reject(data.msg);
                        yield put({ type:'toggleSwitchDataLoading', payload:false });
                    }
                } else {
                    yield put({ type:'toggleSwitchDataLoading', payload:false });
                }
            } catch(err){
                console.log(err);
            }
        },
        *fetchRealtimeData(action, { put, select, call }){
            try{
                let { user:{ company_id }, switchMach:{ currentNode }} = yield select();
                let { resolve, reject } = action.payload || {};
                if ( currentNode.key ){
                    yield put({ type:'toggleSwitchDataLoading', payload:true });
                    let { data } = yield call(getRealtimeData, { company_id, mach_id:currentNode.key });
                    if ( data && data.code === '0' ) {
                        yield put({ type:'getRealtime', payload:{ data:data.data }});
                        if ( resolve && typeof resolve === 'function' ) resolve();
                    } else {
                        if ( reject && typeof reject === 'function' ) reject(data.msg);
                        yield put({ type:'toggleSwitchDataLoading', payload:false });
                    }
                } else {
                    yield put({ type:'toggleSwitchDataLoading', payload:false });
                }
            } catch(err){
                console.log(err);
            }
        },
        // 自动读取网关下空开和存档方案
        *fetchAutoLoad(action, { put, call, select }){
            try {
                let { switchMach:{ currentGateway }} = yield select();
                let { resolve, reject } = action.payload || {};
                let { data } = yield call(getAutoLoadSwitch, { mach_id:currentGateway.key });
                if ( data && data.code === '0'){
                    yield put({ type:'getAutoLoad', payload:{ data:data.data }});
                    if ( resolve && typeof resolve === 'function') resolve();
                } else {
                    if ( reject && typeof reject === 'function') reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *saveAutoLoad(action, { put, call, select }){
            try {
                let { switchMach:{ currentGateway }} = yield select();
                let { resolve, reject, machInfoList } = action.payload || {};
                let { data } = yield call(saveAutoLoadSwitch, { mach_id:currentGateway.key, machInfoList });
                if ( data && data.code === '0'){
                    if ( resolve && typeof resolve === 'function') resolve();
                    yield put({ type:'fetchGateway', payload:{ forceUpdate:true } });
                    yield put({ type:'fetchSwitchList' });
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
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
                    yield put({ type:'fetchTaskList', payload:{ task_type:values.task_type } });
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
            let { resolve, reject, task_id, task_type } = action.payload || {};
            let { data } = yield call(pushTask, { company_id, task_id });
            if ( data && data.code === '0'){
                yield put({ type:'fetchTaskList', payload:{ task_type }});
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
            }
        },
        *fetchDelTask(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { task_id, task_type, resolve, reject } = action.payload;
                let { data } = yield call(delTask, { company_id, task_id });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchTaskList', payload:{ task_type }  });
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
                yield put({ type:'toggleOptionLoading'});
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
        *initParams(action, { put }){
            yield put.resolve({ type:'fetchGateway', payload:{ single:true }});
            yield put({ type:'fetchParams'});
        },
        // 获取/设置空开控制参数
        *fetchParams(action, { put, select, call }){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                yield put({ type:'toggleOptionLoading'});
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
        *initLimitEle(action, { put }){
            yield put.resolve({ type:'fetchGateway', payload:{ single:true }});
            yield put({ type:'fetchLimitEle'});
        },
        // 获取/设置空开限制电流
        *fetchLimitEle(action, { put, select, call}){
            try {
                let { switchMach:{ currentSwitch }} = yield select();
                yield put({ type:'toggleOptionLoading'});
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
                yield put({ type:'toggleOptionLoading'});
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
                yield put({ type:'toggleOptionLoading'});
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
        toggleSwitchLoading(state, { payload }){
            return { ...state, switchLoading:payload };
        },
        toggleTaskLoading(state){
            return { ...state, taskLoading:true };
        },
        toggleActionLoading(state){
            return { ...state, actionLoading:true };
        },
        toggleSwitchDataLoading(state, { payload }){
            return { ...state, switchDataLoading:payload };
        },
        toggleDetailLoading(state){
            return { ...state, detailLoading:true };
        },
        toggleOptionLoading(state){
            return { ...state, optionLoading:true };
        },
        getGateway(state, { payload:{ data, multi, single}}){
            let { gateways } = data;
            // 当更新网关列表时，先判断当前网关对象是否被删除, 如果有则保留当前状态，否则取网关列表的第一个网关对象
            let currentGateway =  gateways.map(i=>i.key).includes(state.currentGateway.key ) && state.currentGateway.key ? state.currentGateway : gateways && gateways.length ? gateways[0] : {}; 
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
            let currentGateway =  temp && temp.length ? temp[0] : {}; 
            let currentSwitch = currentGateway.children && currentGateway.children.length ? currentGateway.children[0] : {};
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
            return { ...state, gatewayList:temp, currentGateway, currentNode:currentGateway, currentSwitch  };
        },
        // 修改设备名不重新请求，直接更新缓存数据
        updateCache(state, { payload:{ mach_id, newValue }}){
            let gatewayList = state.gatewayList.concat();
            let switchList = state.switchList.concat();
            gatewayList.forEach(gateway=>{
                if ( gateway.children && gateway.children.length ){
                    gateway.children.forEach(item=>{
                        if ( item.key === mach_id ) {
                            item.title = newValue;
                        }
                    })
                }
            });
            switchList.forEach(item=>{
                if ( item.mach_id === mach_id ) {
                    item.meter_name = newValue;
                }
            });
            return { ...state, gatewayList, switchList };
        },
        getSwitch(state, { payload:{ data }}){
            let { meterList, gatewayOnline } = data;
            state.currentGateway.is_online = gatewayOnline;
            return { ...state, switchList:meterList, switchLoading:false };
        },
        getSwitchDetail(state, { payload:{ data }}){
            return { ...state, switchDetail:data, detailLoading:false };
        },
        resetDetail(state){
            return { ...state, detailLoading:true, switchDetail:{} };
        },
        getAutoLoad(state, { payload:{ data }}){
            let { dataInfo } = data;
            return { ...state, autoLoadSwitchList:dataInfo || [], autoLoading:true };
        },
        toggleAutoLoading(state, { payload }){
            return { ...state, autoLoading:payload };
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
            // if ( state.gatewayList.length ) {
            //     state.gatewayList.forEach(item=>{
            //         if ( item.key === payload.key ) {  
            //             item.className = 'selected-parent';
            //         } else {
            //             item.className = '';
            //         }
            //     })
            // }
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
            return { ...state, tempInfo:params, optionLoading:false };
        },
        getParams(state, { payload:{ data }}){
            let { params } = data;
            return { ...state, setterInfo:params, optionLoading:false };
        },
        getLimitEle(state, { payload:{ data }}){
            let { params } = data;
            return { ...state, limitEleInfo:params, optionLoading:false };
        },
        getAutoTrip(state, { payload:{ data }}){
            let { params } = data;
            return { ...state, autoTripInfo:params, optionLoading:false };
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