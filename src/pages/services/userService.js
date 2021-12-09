import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { authToken, apiToken } from '../utils/encryption';
import config from '../../../config';

export function userAuth(data = {}){
    let token = authToken(localStorage.getItem('timestamp'), localStorage.getItem('user_id'));
    data.token = token;
    let str = translateObj(data);
    return request('/login/getuser', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function agentUserAuth(data = {}){
    let token = authToken(localStorage.getItem('timestamp'), localStorage.getItem('user_id'));
    data.token = token;
    let str = translateObj(data);
    return request('/agent/getcompanymenu', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getNewThirdAgent(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/login/checkthirdagent', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 修改企业用户的logo
export function setCompanyLogo(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/setting/setcompanylogo', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

// 请求中台商的logo
export function getThirdAgentInfo(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/login/getagent', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 获取摄像头accessToken接口
export function getCameraAccessToken(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/camera/getaccesstoken', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getWeather(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/index/getweather', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}


export function login(data = {}){
    let timestamp = parseInt(new Date().getTime()/1000);
    let token = authToken(timestamp);
    data.token = token;
    let str = translateObj(data);
    return request('/login/login', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function changePwd(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/index/updateuserpw', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function changeActionPwd(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/index/updateuseroperpw', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function checkPwd(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/index/checkoperpwd', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function getRoleList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/getrolelist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getUserPermission(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/getrolemenu', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function setUserPermission(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/setrolemenu', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 通用的导出excel接口
export function createExcel(col, row){
    let token = apiToken();
    let url = `http://${config.apiHost}/api/export/createexcel?col=${JSON.stringify(col)}&row=${JSON.stringify(row)}&token=${token}`;
    window.location.href = url;

}

// 第三方地图geoJson数据的请求接口
export function getGeoJson(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/index/geojson', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
