import { getUserList, getRoleList, createUser, editUser, deleteUser, updatePassword, getRolePermission, editRolePermission } from '../services/userListService';
import { md5 } from '../utils/encryption';

const initialState = {
    list:[],
    // 角色权限相关状态
    roleList:[],
    currentRole:{},
    selectedKeys:[],
    // -- --
    userForm:{},
    currentPage:1,
    total:0,
    isLoading:false,
    // 新增用户和更改用户的模态弹窗
    visible:false,
    forEdit:false,
    selectedRowKeys:[],
    treeLoading:false,
    
}

export default {
    namespace:'userList',
    state:initialState,
    effects:{
        *init(action, { call, put }){
            yield put({ type:'permission/fetchRoleList' });
            yield put({ type:'fetchUserList'});
        },
        *fetchUserList(action, { call, put, select}){  
            let { user:{ company_id }} = yield select();
            let { pageNum, pagesize } = action.payload || {};
            pageNum = pageNum || 1;
            pagesize = pagesize || 15;
            let { data } = yield call(getUserList, { company_id, page:pageNum, pagesize });
            if ( data && data.code === '0'){
                yield put({type:'getUserList', payload:{ data:data.data, count:data.count, currentPage:pageNum }});
            }       
        },
        *add(action, { call, put, select }){
            let { user:{ company_id }} = yield select();
            let { values, resolve, reject, forEdit } = action.payload;
            values.is_actived = values.is_actived ? '1' : '0'; 
            values.company_id = company_id;
            values.confirm_password = values.password = md5(values.password, values.user_name);
            let { data } = yield call( forEdit ? editUser : createUser,values);
            if ( data && data.code == 0 ){
                yield put({type:'fetchUserList'});
                if ( resolve ) resolve();
            } else if ( data && data.code === '1001'){
                yield put({ type:'user/loginOut'});
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *delete(action, { call, put, select}){
            let { userList : { selectedRowKeys }} = yield select();
            let { data } = yield call(deleteUser, { user_id : selectedRowKeys});
            if ( data && data.code == 0 ){
                yield put({type:'fetchUserList'});
            } else if ( data && data.code === '1001') {
                yield put({ type:'user/loginOut'});
            }
        }
    },
    reducers:{
        toggleLoading(state, { payload}){
            return { ...initialState, roleList:state.roleList, isLoading:true }
        },
        toggleTreeLoading(state){
            return { ...state, treeLoading:true };
        },
        getUserList(state, {payload:{ data, count, currentPage }}){
            // //  排除登录的自身账号，只显示下级有管理权限的企业用户列表
            // let list = data.users.filter(user=>user.user_id != localStorage.getItem('user_id'));
            return { ...state, list:data.users, total:count, currentPage, isLoading:false } ;
        },
        getRoleList(state, { payload:{data}}){
            let { roles } = data;
            return { ...state, roleList:roles };
        },
        toggleVisible(state, { payload }){
            let { visible, forEdit, userForm } = payload;
            return { ...state, visible, forEdit, userForm:userForm ? userForm : {}};
        },
        select(state, { payload }){
            return { ...state, selectedRowKeys:payload };
        },
        getPermissionResult(state, { payload:{ data, currentRole }}){
            return { ...state, selectedKeys:data.menuList, currentRole };
        },
        setPermission(state, { payload:{ selectedKeys }}){
            return { ...state, selectedKeys };
        },
        resetRoleManager(state){
            return { ...state, roleList:[], currentRole:{}, selectedKeys:[] };
        },
        resetAdminManager(state){
            return { ...initialState, roleList:state.roleList, currentRole:state.currentRole, selectedKeys:state.selectedKeys };
        }
    }
}