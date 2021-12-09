import React from 'react';
import { Input, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import Loading from '@/pages/components/Loading';
let tabs = [
    { title:'时控执行记录', key:'1' },
    { title:'阈值执行记录', key:'2' }
]

let actionsMap = {
    '1':'空开合闸',
    '2':'空开分断',
    '3':'任务下发',
    '4':'任务删除',
    '5':'设置自动脱扣参数'
}

function TableContainer({ dispatch, data, loading, currentPage, total }){
    let columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 15 + index + 1}`;
            }
        },
        { title:'设备名称', dataIndex:'meter_name' },
        { title:'注册码', dataIndex:'register_code' },
        // { 
        //     title:'动作类型',
        //     dataIndex:'action_type',
        //     render:(value)=>{
        //         return <span className={style['tag-on']}>{ actionsMap[value] }</span>
        //     }
        // },
        { title:'动作名称', dataIndex:'action_name'},
        { 
            title:'执行结果', 
            dataIndex:'action_res',
            render:(value)=>(
                <span className={ value === 0 ? style['tag-off'] : style['tag-on']}>{ value === 0 ? '失败' : '成功'}</span>
            )
        },
        { title:'执行时间', dataIndex:'action_time' }
        // {
        //     title:'历史查看',
        //     render:()=>{
        //         return <span className={style['custom-button']}>查看</span>
        //     }
        // }
    ]
    return (
        <div style={{ height:'100%' }}>
            {/* <div style={{ height:'50px', padding:'1rem' }}>
                <Input className={style['custom-input']} allowClear={true} />
                <div className={style['custom-button']} style={{ marginRight:'20px' }}><SearchOutlined />查询</div>
            </div>
            <div className={style['button-group-container']}>
                {
                    tabs.map((item,index)=>(
                        <div className={index === 0 ? style['button-group-item'] + ' ' + style['selected'] : style['button-group-item']} key={index}>{ item.title }</div>
                    ))
                }
            </div> */}
             {
                loading
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'100%'}}>
                <Table 
                    rowKey='record_id'
                    columns={columns}
                    dataSource={data}
                    className={style['self-table-container'] + ' ' + style['dark'] }
                    pagination={{
                        current:currentPage,
                        total,
                        pageSize:15,
                        showSizeChanger:false
                    }}
                    locale={{
                        emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>暂无执行记录</div>
                    }}
                    onChange={(pagination)=>{
                        dispatch({ type:'switchMach/fetchAction', payload:{ pageNum:pagination.current }});
                    }}
                />
            </div>
        </div>
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.loading !== nextProps.loading ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(TableContainer, areEqual);