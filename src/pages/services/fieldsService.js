import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';


export function addField(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/addfield', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getFieldType(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/getfieldtype', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getFieldAttrs(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/getfieldtree', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addFieldAttr(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/addfieldattr', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function editFieldAttr(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/editfieldattr', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function deleteFieldAttr(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/delfieldattr', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getFields(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/getfields', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}


export function editField(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/editfield', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function deleteField(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/delfield', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getAttrDevice(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/getattrmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getAllDevice(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/getattruseablemach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addAttrDevice(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/addattrmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function deleteAttrDevice(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/delattrmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}