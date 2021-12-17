import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';

export function getLoginLog(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/log/getloginloglist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}


export function getActionLog(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/log/getloglist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}