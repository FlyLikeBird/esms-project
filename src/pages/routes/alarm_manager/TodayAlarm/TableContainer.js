import React from 'react';
import { Table, Tag } from 'antd';
import style from '@/pages/routes/IndexPage.css';

function TableContainer({ data }){
    let tableData = [];
    let columns = [{ title:'报警类型', dataIndex:'type_name', key:'type_name', width:'100px', ellipsis: true, fixed:'left' }];
    let sumObj = {};
    Object.keys(data).forEach((key,index)=>{
        if ( index === 0 ){
            data[key].date.forEach(time=>{
                columns.push({ title:time, dataIndex:time, key:time, width:'160px', ellipsis: true });
                sumObj[time] = 0;
            })        
        }
        let valueObj = {}
        data[key].date.forEach((time,index)=>{
            valueObj[time] = data[key].value[index];
            sumObj[time] += valueObj[time];
        });
        tableData.push({ type_name:key, ...valueObj });
    });
    if ( Object.keys(data).length ){
        tableData.unshift({ type_name:'合计', ...sumObj });
    }
   
    return (
        <Table 
            rowKey='type_name'
            columns={columns}
            dataSource={tableData}
            className={style['self-table-container'] + ' ' + style['dark'] }
            pagination={false}
            locale={{
                emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>暂无任何告警信息</div>
            }}
            scroll={{ x:1000 }}
        />
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(TableContainer, areEqual);