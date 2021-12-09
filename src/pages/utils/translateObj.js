export function translateObj(obj){
    let str='';
    Object.keys(obj).forEach(key=>{
        let temp = '';
        if (Array.isArray(obj[key])  || Object.prototype.toString.call(obj[key]) === '[object Object]' ){
            // url转码会对+号以及&号进行空格替换。
            temp = encodeURIComponent(JSON.stringify(obj[key]));            
            // if (obj[key].length){
            //     obj[key].forEach(item=>{
            //         //  如果item是对象
            //         if ( Object.prototype.toString.call(item) === '[object Object]'){
            //             Object.keys(item).map(objKey=>{
            //                 temp += `${key}[${objKey}]=${item[objKey]}&`
            //             })
            //         //  如果item是字符串
            //         } else {
            //             temp += `${key}[]=${item}&`;
            //         }
            //     });
            //     temp.substring(0,temp.length-1);
            //     str+=temp;
            //     return ;
            // } 
            //  排除 等于0 的情况
        } else if (!obj[key] && Object.prototype.toString.call(obj[key]) !== '[object Number]'){
            temp = '';
        } else {
            // url转码会对+号以及&号进行空格替换。
            temp = encodeURIComponent(obj[key]);
            // temp = obj[key];
        }
        str+=key+'='+ temp + '&';
    })
    return str.substring(0,str.length-1);
}