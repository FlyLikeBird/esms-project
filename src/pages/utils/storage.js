export const reg = /\?company_name=(\.)/;
export function getCompanyId(query){
    let company_id;
    let temp = JSON.parse(localStorage.getItem('companysMap'));
    if ( !query ){
        if ( temp && temp[0]) {
            let key = Object.keys(temp[0])[0];
            company_id = temp[0][key];
        }
    } else {
        let match = reg.exec(query);
        console.log(match);
        temp.forEach((item)=>{
            let key = Object.keys(item)[0];
            if ( decodeURI(key) === match[1]) {
                company_id = item[key];
            }
        });
    }
    return company_id;
}

export function storage(companyId, key, value){
    // 绑定相关公司的状态信息
    let companyInfo = localStorage.getItem('company_info');
    let final;
    if(!companyInfo) {
        // 新增公司信息
        if ( key && value ){
            // 设置要缓存的公司相关信息
            final = { [companyId] : { [key] : value } };
            localStorage.setItem('company_info', JSON.stringify(final));
        }
    } else {
        companyInfo = JSON.parse(companyInfo);
        let  currentCompanyInfo = companyInfo[companyId];
        // 
        if ( currentCompanyInfo ) {
            if ( key && value ) {
                currentCompanyInfo[key] = value;
                final = { ...companyInfo, [companyId]:currentCompanyInfo  };
                localStorage.setItem('company_info', JSON.stringify(final) );
            } else {
                return companyInfo[companyId];
            }
        } else {
            if ( key && value ){
                final = { ...companyInfo, [key] : value };
                localStorage.setItem('company_info', JSON.stringify(final));
            } else {
                return companyInfo[companyId];
            }
        }
    }
}