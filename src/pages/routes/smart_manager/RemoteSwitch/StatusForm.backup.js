import React, { useEffect } from 'react';
import { Form, Radio, Table, Switch, message } from 'antd';
import style from '@/pages/routes/IndexPage.css';
function FormContainer({ dispatch, data }){
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    };
    let tableData = [
        [{ voltage:data.power ? data.power.voltage : 0, current:data.power ? data.power.current : 0, power:data.power ? data.power.power : 0, powerfactor:data.power ? data.power.powerfactor : 0 , energy:data.power ? data.power.energy : 0 }],
        [{
            'combine_trip':data.status ? data.status.combine_trip : 0,
            'temp_alert':data.status ? data.status.temp_alert : 0,
            'temp_trip':data.status ? data.status.temp_trip : 0,
            'leakage':data.status ? data.status.leakage : 0,
            'hand_trip':data.status ? data.status.hand_trip : 0
        }],
        [{
            'overload':data.status ? data.status.overload : 0,
            'overload_trip':data.status ? data.status.overload_trip : 0,
            'trip_lock':data.status ? data.status.trip_lock : 0,
            'service_mode':data.status ? data.status.service_mode : 0,
            'power_overrun':data.status ? data.status.power_overrun : 0,
        }],
        [{
            'voltage_low':data.status ? data.status.voltage_low : 0,
            'voltage_high':data.status ? data.status.voltage_high : 0,
            'combine_fail':data.status ? data.status.combine_fail : 0,
            'trip_fail':data.status ? data.status.trip_fail : 0,
            'hand_combine':data.status ? data.status.hand_combine : 0,
        }],
        [{
            'unusual_combine_trip':data.status ? data.status.unusual_combine_trip : 0,
            'direct_short':data.status ? data.status.direct_short : 0,
            'auto_recombine':data.status ? data.status.auto_recombine : 0,
            'auto_recombine_fail':data.status ? data.status.auto_recombine_fail : 0,
            'enable_temp_control':data.status ? data.status.enable_temp_control : 0,
        }],
        [{
            'unusual_knife_travel':data.status ? data.status.unusual_knife_travel : 0,
            'unusual_k2':data.status ? data.status.unusual_k2 : 0,
            'disable_remote_control':data.status ? data.status.disable_remote_control : 0,
            'unusual_mechanical_structure':data.status ? data.status.unusual_mechanical_structure : 0
        }]
    ];
    let columnData = [
        [
           { title:'电压(V)', dataIndex:'voltage' },
           { title:'电流(A)', dataIndex:'current'},
           { title:'功率(KW)', dataIndex:'power'},
           { title:'功率因素(cosΦ)', dataIndex:'powerfactor'}, 
           { title:'电能(KWH)', dataIndex:'energy'}
        ],
        [
            { 
                title:'合闸/脱扣', 
                dataIndex:'combine_trip', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>合闸</Radio><Radio value={0}>脱扣</Radio></Radio.Group>)
            },
            { 
                title:'温度超限', 
                dataIndex:'temp_alert', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'过温脱扣', 
                dataIndex:'temp_trip', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'漏电报警', 
                dataIndex:'leakage', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'手动脱扣标记', 
                dataIndex:'hand_trip', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
        ],
        [
            { 
                title:'过载报警', 
                dataIndex:'overload', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>合闸</Radio><Radio value={0}>脱扣</Radio></Radio.Group>)
            },
            { 
                title:'过载脱扣', 
                dataIndex:'overload_trip', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'脱扣锁死', 
                dataIndex:'trip_lock', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'维修模式', 
                dataIndex:'service_mode', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'功率超限', 
                dataIndex:'power_overrun', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            }
        ],
        [
            { 
                title:'电压过低', 
                dataIndex:'voltage_low', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>合闸</Radio><Radio value={0}>脱扣</Radio></Radio.Group>)
            },
            { 
                title:'电压过高', 
                dataIndex:'voltage_high', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'合闸异常', 
                dataIndex:'combine_fail', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'脱扣异常', 
                dataIndex:'trip_fail', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'手动合闸标志', 
                dataIndex:'hand_combine', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            }
        ],
        [
            { 
                title:'正常合闸/脱扣', 
                dataIndex:'unusual_combine_trip', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>合闸</Radio><Radio value={0}>脱扣</Radio></Radio.Group>)
            },
            { 
                title:'短路报警', 
                dataIndex:'direct_short', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'自动重合闸', 
                dataIndex:'auto_recombine', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'自动重合闸失败', 
                dataIndex:'auto_recombine_fail', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'使能温度管控', 
                dataIndex:'enable_temp_control', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            }
        ],
        [
            { 
                title:'闸刀行程开关异常', 
                dataIndex:'unusual_knife_travel', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>合闸</Radio><Radio value={0}>脱扣</Radio></Radio.Group>)
            },
            { 
                title:'电机行程开关K2异常', 
                dataIndex:'unusual_k2', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'禁止远程控制', 
                dataIndex:'disable_remote_control', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            },
            { 
                title:'机械结构异常', 
                dataIndex:'unusual_mechanical_structure', 
                render:(value)=>(<Radio.Group value={value} disabled={true}><Radio value={1}>报警</Radio><Radio value={0}>解除</Radio></Radio.Group>)
            }
        ]
    ];    
    return (
        <div style={{ height:'100%' }}>
            {
                columnData.length
                ?
                columnData.map((item,index)=>(
                    <Table 
                        key={index}
                        style={{ padding:'0.5rem 1rem'}}
                        className={style['self-table-container'] + ' ' + style['dark'] + ' ' + style['small']}
                        dataSource={tableData[index]}
                        columns={item}
                        pagination={false}
                    /> 
                ))
                :
                null
            }          
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
export default React.memo(FormContainer, areEqual);

                
                
           