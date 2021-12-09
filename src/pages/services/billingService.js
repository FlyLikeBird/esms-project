import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';

export function getBilling(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/feerate/getratelist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addBilling(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/feerate/addquarter', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function editBilling(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/feerate/editquarter', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}


export function getBillingTpl(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/feerate/copytplform', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function copyBillingTpl(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/feerate/copytpl', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function deleteBilling(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/feerate/delquarter', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function isActive(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/feerate/activerate', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function isUnActive(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/feerate/unactive', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function editRate(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/feerate/editrate', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getFeeRate(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/energycost/getcostrate', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function setWaterRate(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/feerate/setwaterate', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

