import CryptoJS from 'crypto-js';

//const key = 'hyzn';
/*
//DES加密
export const encryptBy = (message) => {
    var key = 'hyzn';
    function encryptByDES (message, key) {
      var keyHex = CryptoJS.enc.Utf8.parse(key)
      var option = {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding}
      var encrypted = CryptoJS.DES.encrypt(message, keyHex, option);
      var hex = encrypted.ciphertext.toString().toUpperCase();
      var oldHexStr = CryptoJS.enc.Hex.parse(hex);
      return CryptoJS.enc.Base64.stringify(oldHexStr);
    //   return encrypted.ciphertext.toString()
    }
    return encryptByDES(message, key);
}
//DES解密
export const decryptBy = (message) => {
    var key = 'hyzn';
    //DES  ECB模式解密
    function decryptByDES(message,key){
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Hex.parse(message)
    }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
    });
    var result_value = decrypted.toString(CryptoJS.enc.Utf8);
    return result_value;
    }
    return decryptByDES(message, key);
}
*/

const key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF');  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量

export const encryptBy = (word)=>{
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

export const decryptBy = (word)=>{
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

//  防止爬虫抓包模拟用户请求， 时效性2分钟
export function apiToken(){
    let timestamp = parseInt((new Date().getTime())/1000).toString();
    let user_id = localStorage.getItem('user_id');
    let token = encryptBy( user_id ? `${timestamp}&${localStorage.getItem('user_id')}` : timestamp );
    return token;
}

// 用户认证状态 有效期 一天
export function authToken(timestamp, user_id){
    let token = encryptBy( user_id ? `${timestamp}&${user_id}` : timestamp);
    return token;
}

// 用户密码md5加密
export function md5(password, username){
    return CryptoJS.MD5(CryptoJS.MD5(password).toString() + username).toString();
}