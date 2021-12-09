import XLSX from 'xlsx';

export function isIncludes(parentArr, childrenArr) {
    // 当父数组为空时，认为不包含子数组的任何元素，返回false;
    if (!parentArr.length) return false;
    let tempArrLength = Array.from(new Set([...parentArr, ...childrenArr])).length
    return tempArrLength === parentArr.length || tempArrLength === childrenArr.length
}

export function selectArr(parentArr, childArr){
    // 计算parentArr 和 childArr 的交集
    let result = [];
    if(!parentArr.length) return result;
    parentArr.forEach(item=>{
        if(childArr.includes(item)) result.push(item);
    })
    return result;
}

export function findMaxAndMin(arr, decimal){
    if (!arr) return {};
    let maxInit = arr[0], minInit = arr[0], maxIndex = 0, minIndex = 0;
    let sum = 0;
    for(var i=0,len=arr.length;i<len;i++){
        sum += +arr[i];
        if ( arr[i] > maxInit ) {
            maxInit = arr[i];
            maxIndex = i;
        } else if ( arr[i] && ( arr[i] < minInit ) ){
            minInit = arr[i];
            minIndex = i;
        }
    }
    return {
        min:{
            value: decimal ? (+minInit).toFixed(2) : Math.round(minInit),
            index:minIndex
        },
        max:{
            value: decimal ? (+maxInit).toFixed(2) : Math.round(maxInit),
            index:maxIndex
        },
        avg: decimal ? (sum/arr.length).toFixed(2) : Math.round(sum/arr.length)
    }
}

export function flattern(arr, result){
    arr.forEach(item=>{
        result.push(item.key);
        if(!item.children) {
            return ;
        } else {
            flattern(item.children, result);
        }
    })
}

export function getDeep(arr, deep = 0){
    
    if ( arr.children && arr.children.length ){
        arr.children.map((item,index)=>{
            let temp = deep;
            getDeep(item, ++temp);
        })
    }
}

export function splitTimePeriod(arr){
    let rateInfo = {};
    let beginMonth;
    arr.forEach(month=>{     
        let between = month.end_month - month.begin_month + 1;
        beginMonth = Number(month.begin_month);
        for( between; between>0;between--){
            // 获取月区间的时段信息
            rateInfo[beginMonth < 10 ? '0'+beginMonth : beginMonth] = getTimeList(month.timeList);
            ++beginMonth;
        }
    });
    return rateInfo;
}

function getTimeList(arr){
    let obj = {};
    let start;
    arr.forEach(time=>{
        let between = time.end_time - time.begin_time - 1;
        start = Number(time.begin_time);
        for(between;between>=0;between--){
            obj[start < 10 ? '0'+start : start] = time.time_type;
            ++start;
        }
    });
    return obj;
}
function sheet2blob(sheet, sheetName) {
	sheetName = sheetName || 'Sheet1';
	var workbook = {
		SheetNames: [sheetName],
		Sheets:{}
	};
	workbook.Sheets[sheetName] = sheet;
	// // 生成excel的配置项
	var wopts = {
		bookType: 'xlsx', // 要生成的文件类型
		bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
		type: 'binary',
        cellStyles:true
	};
	var wbout = XLSX.write(workbook, wopts);
	var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
	// 字符串转ArrayBuffer
	function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}
	return blob;
}

export function downloadExcel(sheet, fileName, merge){
    // let blob = translateDataToSheet(data, null, merge);
    let blob = sheet2blob(sheet, fileName);
    if ( typeof blob === 'object' && blob instanceof Blob ){
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName || '通用excel';
        let event;
        if( window.MouseEvent) {
            event = new MouseEvent('click');
        } else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        a.dispatchEvent(event);
    }
}