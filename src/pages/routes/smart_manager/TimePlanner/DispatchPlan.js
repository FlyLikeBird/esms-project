import React from 'react';
import { Table, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
const { Option } = Select;
let tableData = [
    { order:'1', title:'空开0000001', line:'1' },
    { order:'1', title:'空开0000001', line:'1' },
    { order:'1', title:'空开0000001', line:'1' },
    { order:'1', title:'空开0000001', line:'1' },
];
let columns = [
    { title:'序号', dataIndex:'order' },
    { title:'设备名称', dataIndex:'title' },
    { title:'线路名称', dataIndex:'line' },
    { title:'下发结果' },
    { title:'下发时间' }
];

function DispatchPlan(){
    return (
        <div>
            <div style={{ height:'40px', marginBottom:'10px', display:'flex', alignItems:'center', justifyContent:'space-between', color:'#fff' }}>
                <div>
                    <span>选择线路:</span>
                    <Select className={style['custom-select']} style={{ width:'120px', marginLeft:'6px' }}>
                        <Option value='1'>线路1</Option>
                        <Option value='2'>线路2</Option>
                        <Option value='3'>线路3</Option>
                    </Select>
                    <Input className={style['custom-input']} style={{ margin:'0 10px' }} allowClear={true} />
                    <div className={style['custom-button']}><SearchOutlined />查询</div>
                </div>
                <div>
                    <div className={style['custom-button']}>下发</div>
                    <div className={style['custom-button']}>一键重发</div>
                </div>
            </div>
            <Table 
                className={style['custom-table']}
                columns={columns}
                dataSource={tableData}
                
            />
        </div>
    )
}

export default DispatchPlan;