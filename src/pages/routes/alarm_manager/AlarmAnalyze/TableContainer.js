import React from 'react';
import { Table } from 'antd';
import style from '@/pages/routes/IndexPage.css';

let data = [];
for( var i=0;i < 30; i++){
    data.push({
        title:'XXXX项目',
        rate:30,
        machCount:38,
        alarmCount:300,
        orange:0,
        red:10,
        blue:5,
    })
}
function TableContainer(){
    let currentPage = 1;
    let columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 10 + index + 1}`;
            }
        },
        { title:'项目名称', dataIndex:'title', width:160 },
        { title:'隐患评分', dataIndex:'rate'},
        { title:'设备数量', dataIndex:'machCount' },
        { title:'隐患报警数', dataIndex:'alarmCount' },
        { title:'橙色报警数', dataIndex:'orange', render:(value)=>{
            return (<span style={{ color:'#02a3fe'}}>{ value }</span>)
        }},
        { title:'红色报警数', dataIndex:'red', render:(value)=>(<span style={{ color:'#c220fd'}}>{ value }</span>)},
        { title:'故障报警数', dataIndex:'blue', render:(value)=>(<span style={{ color:'#6dcffc'}}>{ value }</span>) }
    ];
    return (
        <Table 
            columns={columns}
            dataSource={data}
            className={style['self-table-container'] + ' ' + style['dark'] }
            pagination={false}
        />
    )
}

export default TableContainer;