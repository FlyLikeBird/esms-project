import React, { useState } from 'react';
import { Select, Input, Button, Modal, Table } from 'antd';
import { SearchOutlined, PlusCircleOutlined, FileAddOutlined, CalendarOutlined  } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
// import AddPlanForm from './AddPlanForm';
// import DispatchPlan  from './DispatchPlan';
const { Option } = Select;

let tableData = [];
for(var i=0;i<40;i++){
    tableData.push({ order:i+1, title:'电压上限', value:244, unit:'V', action:'分断' });
}
function TableContainer(){
    let [addVisible, toggleAddVisible] = useState(false);
    let [dispatchVisible, toggleDispatchVisible] = useState(false);
    let columns = [
        { title:'序号', dataIndex:'order' },
        { title:'阈值属性', dataIndex:'title'},
        { title:'阈值数', render:(row)=>{
            return (<span style={{ color:'#ff2d2e' }}>{row.value + row.unit}</span>)
        } },
        { title:'越限操作', dataIndex:'action', render:(value)=>{
            return (<span >{ value }</span>)
        }}
    ];
    return (
        <div style={{ height:'100%' }}>
            <div style={{ display:'flex', alignItems:'center', height:'50px', color:'#fff', padding:'1rem' }}>
                <div className={style['custom-button']} onClick={()=>toggleAddVisible(true)}><PlusCircleOutlined />添加</div>
                <div className={style['custom-button']} onClick={()=>toggleDispatchVisible(true)}><CalendarOutlined />阈值下发</div>
            </div>
            <div style={{ height:'calc(100% - 50px)'}}>
                <Table 
                    columns={columns}
                    dataSource={tableData}
                    className={style['self-table-container'] + ' ' + style['dark'] }
                    pagination={{
                        pageSize:10,
                        showSizeChanger:false
                    }}
                />

            </div>
            {/* 添加任务模态弹窗 */}
            {/* <Modal
                width='800px'
                height='400px'
                className={style['custom-modal']}
                visible={addVisible}
                destroyOnClose={true}
                onCancel={()=>toggleAddVisible(false)}
                title='添加任务'
                footer={null}
                
            >
                <AddPlanForm onClose={()=>toggleAddVisible(false)} />
            </Modal> */}
            {/* 任务下发模态弹窗 */}
            {/* <Modal
                width='1000px'
                height='500px'
                className={style['custom-modal']}
                visible={dispatchVisible}
                destroyOnClose={true}
                onCancel={()=>toggleDispatchVisible(false)}
                title='任务下发'
                footer={null}
            >
                <DispatchPlan />
            </Modal> */}
        </div>
    )
}

export default TableContainer;