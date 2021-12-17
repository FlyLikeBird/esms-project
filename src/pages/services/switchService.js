import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';
// 获取网关接口
export function getGateway(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/getswitchgateway', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 网关更新
export function refreshGateway(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/updateswitchdoc', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 网关同步
export function syncGateway(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/gatewaysynchro', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getSwitch(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/getswtichlist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}


export function getSwitchData(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/getmeterenergy', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getRealtimeData(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/switchrealtime', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getAutoLoadSwitch(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/autoloadswtich', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function saveAutoLoadSwitch(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/saveswitch', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 漏保自检
export function selfCheck(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/selfverify', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addTask(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/addtask', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateTask(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/updatetask', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function delTask(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/deltask', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function pushTask(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/pushtask', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getTaskList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/gettasklist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function turnOnSwitch(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/switchcombine', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function turnOffSwitch(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/switchtrip', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

// 获取、设置空开温控参数
export function getSwitchTemp(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/getswitchtemp', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function setSwitchTemp(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/setswitchtemp', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 获取、设置空开控制参数
export function setSwitchParams(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/setswtichctrl', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getSwitchParams(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/getswtichctrl', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 获取、设置空开限制电流
export function getSwitchLimitEle(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/getswitchcurrentlimit', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function setSwitchLimitEle(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/setswitchcurrentlimit', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 获取、设置空开自动脱扣参数
export function getSwitchAutoTrip(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/getswitchtripparam', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function setSwitchAutoTrip(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/settripparam', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}


export function getActionList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/getactionlist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 获取、设置空开自动重合闸
export function getSwitchAutoCombine(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/getswtichrecombine', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function setSwitchAutoCombine(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/setswtichrecombine', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}




