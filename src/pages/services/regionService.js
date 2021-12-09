import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';

export function getManagerList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/getpersonlist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addManager(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/addperson', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateManager(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/updateperson', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function delManager(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/delperson', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
