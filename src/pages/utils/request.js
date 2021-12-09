import fetch from 'dva/fetch';
import config from '../../../config';

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, otherProxy) {
    let proxy = otherProxy || config.proxy;
    let finalURL = `http://${config.apiHost}${proxy}${url}`;
    return fetch(finalURL, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => ({ data }))
        .catch(err => ({ err }));
}

export function requestImg(url, options) {
    let finalURL = `http://${config.apiHost}${config.proxy}${url}`;
    return fetch(finalURL, options)
        .then(checkStatus)
        .then(response=>{
            return response.blob();
        })
        .then(blob=>{
            return new Promise((resolve)=>{
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = function(){
                    resolve(reader.result);
                }
            })
            
        })
        .catch(err => ({ err }));
}

// export function fetchImg(url){
//     // let temp = url.split('/');
//     // // '/' 保证是根路径
//     // 每次访问的url都添加一个随机数作为参数，这样浏览器就不会把缓存的图片再次显示，而是会重新向服务器提出获取图片资源的请求。
//     let finalURL;
//     let temp = url.split('/');
//     // url = temp.slice(1,temp.length).join('/') + '?' + Math.random().toFixed(2);
//     url = temp.slice(1,temp.length).join('/');
//     // finalURL = `http://${config.apiHost}/${url}`;
//     return fetch(url,{
//             mode:'cors',
//             method:'GET',
//             responseType:'blob'
//         })
//         .then(response=>response.blob())
//         .then(blob=>{        
//             return new Promise((resolve)=>{
//                 let reader = new FileReader();
//                 reader.readAsDataURL(blob);
//                 reader.onload = function(){
//                     resolve(reader.result);
//                 }
//             })
//         })
// }