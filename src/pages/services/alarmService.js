import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';

export function getAlarmAnalyze(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/warninganalyz', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function getTodayAlarm(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/switchwarning', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function getAlarmHistory(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/iotswitch/switchwarningrecord', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 告警处理接口
export function getLogType(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/warn/getlogtype', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function confirmRecord(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/warn/operwarning', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getHistoryLog(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/warn/getmachhistorylog', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getProgressLog(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/warn/getrecordlog', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function uploadImg(data={}){
    let token = apiToken();
    let { company_id, file } = data;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('token',token);
    return request('/upload/upload', { 
        method:'POST',
        body:formData
        }); 
}
// 告警规则设置接口
export function getMachs(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/warn/getmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getRuleList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/warn/getrule', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getRuleType(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/warn/getruletype', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addRule(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/warn/addrule', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateRule(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/warn/updaterule', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function deleteRule(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/warn/delrule', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
