import { getRoleList, getUserPermission, setUserPermission } from '../services/userService';
const initialState = {
    // role_type字段,值越大，权限越低，用户不能更改自身角色权限
    roleList:[],
    userPermission:[]
}

export default {
    namespace:'permission',
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
        *fetchRoleList(action, { put, call, select }){
            let { data } = yield call(getRoleList);
            if ( data && data.code === '0'){
                yield put({ type:'getRoleListResult', payload:{ data:data.data }});
            }
        },
        *fetchUserPermission(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { data } = yield call(getUserPermission, { company_id, role_id:action.payload, app_type:'2'})
                if ( data && data.code === '0'){
                    yield put({ type:'getUserPermissionResult', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            
            }  
        },
        *setUserPermission(action, { put, call, select }){
            let { user:{ company_id}, permission:{ userPermission }} = yield select();
            let { resolve, reject, role_id } = action.payload;
            let { data } = yield call(setUserPermission, { company_id, role_id, app_type:'2', menu_data:userPermission });
            if ( data && data.code === '0'){
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        }
    },
    reducers:{
        toggleGatewayLoading(state){
            return { ...state, gatewayLoading:true };
        },
        getRoleListResult(state, { payload:{ data }}){
            let { roles } = data;
            return { ...state, roleList:roles };
        },
        getUserPermissionResult(state, { payload:{ data }}){
            let { menuList } = data;
            return { ...state, userPermission:menuList };
        },
        changePermission(state, { payload }){
            return { ...state, userPermission:payload };
        },
        reset(state){
            return initialState;
        }
    }
}