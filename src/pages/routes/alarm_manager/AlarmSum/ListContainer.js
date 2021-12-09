import React from 'react';
import { Radio, Select, DatePicker  } from 'antd';
import { ControlOutlined, EnvironmentOutlined, HistoryOutlined  } from '@ant-design/icons';
import style from '../AlarmManager.css';
import IndexStyle from '@/pages/routes/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
const { RangePicker } = DatePicker;

const { Option } = Select;

function ListContainer({ data }){
    return (
        <div style={{ height:'100%'}}>
            {/* <div style={{ height:'120px', borderBottom:'1px solid rgba(255,255,255,0.2)'}}>
                <div style={{ marginBottom:'10px' }}>
                    <span style={{ fontSize:'0.8rem' }}>隐患类型:</span>
                    <Radio.Group className={style['custom-radio']} style={{ marginLeft:'10px' }} value='1'>
                        <Radio.Button value='1'>全部</Radio.Button>
                        <Radio.Button value='2'>隐患</Radio.Button>
                        <Radio.Button value='3'>报警</Radio.Button>
                        <Radio.Button value='4'>事故</Radio.Button>
                        <Radio.Button value='5'>故障</Radio.Button>
                    </Radio.Group>
                </div>
                <div style={{ marginBottom:'10px' }}>
                    <span style={{ fontSize:'0.8rem' }}>工单状态:</span>
                    <Radio.Group className={style['custom-radio']} style={{ marginLeft:'10px' }} value='1'>
                        <Radio.Button value='1'>全部</Radio.Button>
                        <Radio.Button value='2'>未派发</Radio.Button>
                        <Radio.Button value='3'>已派发</Radio.Button>
                        <Radio.Button value='4'>未处理</Radio.Button>
                        <Radio.Button value='5'>已处理</Radio.Button>
                    </Radio.Group>
                </div>
                <div style={{ marginBottom:'10px' }}>
                    <span style={{ fontSize:'0.8rem' }}>其他选项:</span>
                    <Select className={style['custom-select']} style={{ width:'120px', margin:'0  10px' }} value='1'>
                        <Option value='1'>项目1</Option>
                        <Option value='2'>项目2</Option>
                        <Option value='3'>项目3</Option>
                    </Select>
                    <RangePicker className={style['custom-date-picker']} locale={zhCN}  />
                </div>
            </div> */}
                    <div className={style['list-container']} style={{ position:'relative' }}>
                        {
                            data && data.length 
                            ?
                            data.map((item,index)=>(
                                <div className={style['list-item']} key={index}>
                                    <div style={{ width:'16%'}}><span className={IndexStyle['tag-off']}>{ item.type_name }</span></div>
                                    <div className={style['long-text']} style={{ width:'34%'}}><span>设备 : </span><span style={{ color:'#fff'}}>{`${item.mach_name}`}</span></div>
                                    <div className={style['long-text']} style={{ width:'24%'}}><span>位置 : </span><span style={{ color:'#fff'}}>{`${item.region_name}`}</span></div>
                                    <div className={style['long-text']} style={{ display:'inline-flex', alignItems:'center', lineHeight:'1.2rem', width:'26%'}}>
                                        <div>时间 : </div>
                                        <div style={{ marginLeft:'6px' }}>
                                            <div style={{ color:'#fff'}}>{`${item.record_time.split(' ')[0]}`}</div>
                                            <div style={{ color:'#fff'}}>{`${item.record_time.split(' ')[1]}`}</div>
                                        </div>
                                     
                                    </div>
                                </div>
                            ))
                            :
                            <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)' }}>暂时没有告警信息</div>
                        }
                    </div>
            </div>
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(ListContainer, areEqual);