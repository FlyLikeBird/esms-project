import React from 'react';
import { Table } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';
import style from '@/pages/routes/IndexPage.css';
import { downloadExcel } from '@/pages/utils/array';
import XLSX from 'xlsx';
let category = [
    { title:'A相电压(V)', type:'U1' },
    { title:'B相电压(V)', type:'U2' },
    { title:'C相电压(V)', type:'U3' },
    // { title:'平均相电压(V)', type:'Uavg' },
    { title:'AB线电压(V)', type:'U12' },
    { title:'BC线电压(V)', type:'U23' },
    { title:'CA线电压(V)', type:'U31' }
    // { title:'平均线电压', type:'Ullavg' }
];
function TableContainer({ data, dispatch, timeType, currentPage, containerWidth }){
    let dateColumns = [];
    if ( data && data.length ){
        if ( data[0].view ){
            Object.keys(data[0].view).forEach(key=>{
                dateColumns.push({
                    title: timeType === '1' ? key.split(' ')[1] : key,
                    width:'120px',
                    index:key,
                    addStyle:true,
                    render:(row)=>{
                        return (
                            <div>
                                {
                                    category.map((item,index)=>(
                                        <div style={{ padding:'6px', borderBottom: index === category.length - 1 ? 'none' : '1px solid #1e2141'}}>{ row.view[key][item.type] }</div>
                                    ))
                                }
                            </div>
                        )
                    }
                })
            });
        }
        // 重新排序
        dateColumns.sort((a,b)=>{
            let timeA = new Date(a.index).getTime();
            let timeB = new Date(b.index).getTime();
            return timeA - timeB;
        })
    }
    let columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 10 + index + 1}`;
            }
        },
        {
            title:'属性',
            width:'200px',
            ellipsis:true,
            fixed:'left',
            dataIndex:'attr_name'
        },
        {
            title:'参数名称',
            width:'120px',
            fixed:'left',
            addStyle:true,
            render:(row)=>{
                return (
                    <div>
                        {
                            category.map((item,index)=>(
                                <div style={{ padding:'6px', borderBottom: index === category.length - 1 ? 'none' : '1px solid #1e2141'}}>{ item.title }</div>
                            ))
                        }
                    </div>
                )
            }
        },
        ...dateColumns
    ];
    columns = columns.map((col)=>{
        if ( !col.addStyle ) {
            return col;
        } else {
            return {
                ...col,
                onCell:()=>({
                    className:style['self-cell-wrapper']
                })
            }
        }
    });
    return (
        <div style={{ height:'100%', position:'relative' }}>
            <div style={{ height:'40px' }}>
                <CustomDatePicker optionStyle={{ padding:'10px 14px'}} onDispatch={()=>{
                    dispatch({ type:'dataReport/fetchEleReport' });
                }} />
            </div>
            <div style={{ height:'calc( 100% - 90px)', overflow:'hidden' }}>
                <div className={style['custom-button']} style={{ position:'absolute', top:'10px', right:'10px' }} onClick={()=>{
                    let fileTitle = '数据管理-运行报表';
                    let aoa = [], thead = [];
                    columns.forEach(col=>{
                        thead.push(col.title);
                    });
                    aoa.push(thead);
            
                    data.forEach((item,index)=>{
                        let isNull = false;
                        category.forEach(sub=>{
                            let temp = [];                                 
                            if ( !isNull ){
                                temp.push(index + 1);
                                temp.push(item.attr_name);
                            } else {
                                temp.push(null);
                                temp.push(null);
                            }
                            temp.push(sub.title);
                            dateColumns.forEach(time=>{
                                temp.push(item.view[time.index][sub.type]);
                                
                            });
                            aoa.push(temp); 
                            isNull = true;                                                                                                    
                        });
                    });
                    var sheet = XLSX.utils.aoa_to_sheet(aoa);
                    sheet['!cols'] = thead.map(i=>({ wch:16 }));
                    downloadExcel(sheet, fileTitle + '.xlsx');
                }}>
                    <FileExcelOutlined />
                </div>
                <Table 
                    columns={columns}
                    dataSource={data}
                    className={style['self-table-container'] + ' ' + style['dark'] + ' ' + style['no-space']}
                    scroll={{
                        x:1000,
                        y:containerWidth < 1440 ? 450 : 600
                    }}
                    onChange={(pagination)=>{
                        dispatch({ type:'dataReport/setPage', payload:pagination.current });
                    }}
                    pagination={{
                        total:data.length,
                        current:currentPage,
                        showSizeChanger:false,
                        pageSize:10
                    }}
                />
            </div>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.currentPage !== nextProps.currentPage ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(TableContainer, areEqual);