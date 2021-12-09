
// export function getMonthAndYearData( data, isYear ){
//     let monthCategory = [], yearCategory = [];
//     let monthValue = [], yearValue=[];
//     let monthSum = {}, yearSum = {};
//     let { categoryData, valueData } = data;
//     categoryData.forEach((day,index)=>{
//         let temp = day.split('-');
//         let singleYear = temp[0];
//         let singleMonth = temp[0] + '-' + temp[1];
//         if (!yearSum[singleYear]){
//             yearSum[singleYear] = +valueData[index];
//         } else {
//             yearSum[singleYear] += +valueData[index];
//         }
        
//         if (!monthSum[singleMonth]){
//             monthSum[singleMonth] = +valueData[index];
//         } else {
//             monthSum[singleMonth] += +valueData[index];
//         }
//     });
//     Object.keys(monthSum).forEach(key=>{
//         monthCategory.push(key);
//         monthValue.push(monthSum[key])
//     });
//     Object.keys(yearSum).forEach(key=>{
//         yearCategory.push(key);
//         yearValue.push(yearSum[key]);
//     })
//     return {
//         monthData:{
//             categoryData:monthCategory,
//             valueData:monthValue
//         },
//         yearData:{
//             categoryData:yearCategory,
//             valueData:yearValue
//         }
//     }
// }


export function getDayAndMonthData( data ){
    // 传入的data是以小时为维度的数据
    let monthCategory = [], dayCategory = [];
    let monthValue = [], dayValue=[];
    let monthSum = {}, daySum = {};
    let { categoryData, valueData } = data;
    categoryData.forEach((hourStr,index)=>{
        let temp = hourStr.split('-');
        let singleMonth = temp[0]+'-'+temp[1];
        let singleDay = hourStr.split(' ')[0];
       
        if (!daySum[singleDay]){
            daySum[singleDay] = +valueData[index];
        } else {
            daySum[singleDay] += +valueData[index];
        }
        
        if (!monthSum[singleMonth]){
            monthSum[singleMonth] = +valueData[index];
        } else {
            monthSum[singleMonth] += +valueData[index];
        }
    });
    Object.keys(monthSum).forEach(key=>{
        monthCategory.push(key);
        monthValue.push(monthSum[key])
    });
    Object.keys(daySum).forEach(key=>{
        dayCategory.push(key);
        dayValue.push(daySum[key]);
    });
    return {
        monthData:{
            categoryData:monthCategory,
            valueData:monthValue
        },
        dayData:{
            categoryData:dayCategory,
            valueData:dayValue
        }
    }
}