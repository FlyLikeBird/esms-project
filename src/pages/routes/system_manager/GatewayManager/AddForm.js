import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message, Tooltip, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import AMapLoader from '@amap/amap-jsapi-loader';

const { Option } = Select;
const { Search } = Input;
let map;
let loaded = false;
let points = [];
function validator(a,value){
    if ( !value || (typeof +value === 'number' && +value === +value && +value >=0  )) {
        return Promise.resolve();
    } else {
        return Promise.reject('请填入合适的阈值');
    }
}

function getDeepValue(node, result){
    if ( node.children && node.children.length ){
        node.children.forEach(item=>{
            result.push({ title:item.title, key:item.key, children:item.children });
            getDeepValue(item, result);
        })
    }
}

function getNodeChildren(node, result){
    result.push({ title:node.title, key:node.key, children:node.children });
    if ( node.children && node.children.length ){
        node.children.forEach(item=>{
            getNodeChildren(item, result);
        })
    }
}

function AddForm({ info, AMap, forMachs, gatewayList, managerList, switchModel, onDispatch, onClose }){
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({});
    // console.log(currentRule);
    useEffect(()=>{        
        if ( !AMap && !forMachs ){
            AMapLoader.load({
                key:'26dbf93c4af827e4953d7b72390e3362',
            })
            .then((MapInfo)=>{
                onDispatch({ type:'user/setMap', payload:MapInfo });
            })
            .catch(e=>{
                console.log(e);
            })
        }
        return ()=>{
            if ( map && map.destroy ){
                map.destroy();
            }
            map = null;
            loaded = false;
            points = [];
        }
    },[]);
    useEffect(()=>{
        if ( AMap ){
            if ( !loaded && visible ) {
                map = new AMap.Map('my-map',{
                    resizeEnable:true,
                    zoom:7,
                });
                loaded = true;
            }
        }
    },[AMap, visible]);
    useEffect(()=>{        
        form.setFieldsValue({
            meter_name : info.forEdit ? info.currentMach.meter_name : null,
            register_code: info.forEdit ? info.currentMach.register_code : null,
            address : info.forEdit ? info.currentMach.address : null,
            gateway_id : info.forEdit ? info.currentMach.gateway_id : null,
            model_code : info.forEdit ? info.currentMach.model_code : null,
            order_by : info.forEdit ? info.currentMach.order_by : null,
            switch_parent : info.forEdit ? info.currentMach.switch_parent ? info.currentMach.switch_parent : null : null,
            person_id : info.forEdit ? info.currentMach.person_id : null
        });
        
        if ( info.currentMach && info.currentMach.lat && info.currentMach.lng ) {
            setPos({ lng:info.currentMach.lng, lat:info.currentMach.lat });
        }
    },[info])
   
    return (
        <div>
            <Form
                {...layout} 
                name="add-form"
                form={form}
                onFinish={values=>{
                    if ( !forMachs && !Object.keys(pos).length ) {
                        message.info('请选择设备坐标');
                        return ;
                    }
                    values.lat = pos.lat;
                    values.lng = pos.lng;
                    if ( info.forEdit ) {
                        values.mach_id = info.currentMach.mach_id;
                    }
                    // console.log(values);
                    new Promise((resolve,reject)=>{
                        onDispatch({ type: forMachs ? 'controller/add' : 'gateway/add', payload:{ values, resolve, reject, forEdit:info.forEdit, forceUpdate:true }});
                    })
                    .then(()=>{
                        onClose();
                        message.success(`${info.forEdit ? '修改' : '添加'}${ forMachs ? '空开' :'网关'}成功`);
                    })
                    .catch(msg=>{
                        message.error(msg);
                    })
                }}
            >
                {
                    forMachs 
                    ?
                    <Form.Item name='gateway_id' label='选择网关' rules={[{ required:true, message:'必须挂载到某个网关下'}]}>
                        <Select>
                            {
                                gatewayList.map((item,index)=>(
                                    <Option value={item.key} key={item.key}>{ item.title }</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    :
                    null
                }
                <Form.Item name='meter_name' label='设备名称' rules={[{ required:true, message:'设备名称不能为空'}]}>
                    <Input />
                </Form.Item>
                {
                    forMachs 
                    ?
                    <Form.Item name='model_code' label='设备类型' rules={[{ required:true, message:'请选择设备类型'}]}>
                        <Select>
                            {
                                switchModel.map((item,index)=>(
                                    <Option value={item.model_code} key={item.model_code}>{ item.model_desc }</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    :
                    null
                }
                <Form.Item name='register_code' label='注册码' rules={[ { required:true, message:'注册码不能为空' }]}>
                    <Input disabled={ info.forEdit ? true : false } />
                </Form.Item>
                {
                    forMachs 
                    ?
                    <Form.Item name='order_by' label='排序值' rules={[ { required:true, message:'请指定设备排序值' }]}>
                        <Input suffix={
                            <Tooltip title='排序值须按照真实连接顺序'>
                                <InfoCircleOutlined />
                            </Tooltip>
                        } />
                    </Form.Item>
                    :
                    null
                }
                {
                    forMachs 
                    ?
                    null
                    :
                    <Form.Item label='设备坐标' >
                        {
                            Object.keys(pos).length 
                            ?
                            <div style={{ display:'flex', alignItems:'center', padding:'0 10px', height:'30px', border:'1px solid #d9d9d9', borderRadius:'2px' }}>
                                <span style={{ color:'#4b96ff', flex:'1', whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden' }}>{ `经度:${pos.lng} | 维度:${pos.lat}` }</span>
                                <span style={{ color:'#4b96ff', cursor:'pointer' }} onClick={()=>setVisible(true)}>重新定位</span>
                            </div>
                            :
                            <Button type='primary' onClick={()=>setVisible(true)}>选择设备所在地</Button>
                        }
                    </Form.Item>
                }
                {
                    forMachs 
                    ?
                    null
                    :
                    <Form.Item name='address' label='地址' rules={[{ required:true, message:'请填入详细地址信息' }]}>
                        <Input placeholder='请填入详细地址信息' />
                    </Form.Item>
                }
                {
                    forMachs 
                    ?
                    <Form.Item label="父级空开" shouldUpdate={(prevValues, currentValues) => prevValues.gateway_id !== currentValues.gateway_id }>                     
                        {({ getFieldValue }) => {       
                            let temp = gatewayList.filter(i=>i.key === getFieldValue('gateway_id'))[0];
                            let result = [];
                        
                            if ( temp ){
                                getDeepValue(temp, result);
                                
                                if ( info.forEdit ){
                                    // 编辑模式下，父级空开不能是父节点的子级树里的节点
                                    let currenNode = result.filter(i=>i.key === info.currentMach.mach_id )[0];
                                    let nodeChildren = [];
                                    getNodeChildren(currenNode, nodeChildren );
                                    nodeChildren = nodeChildren.map(i=>i.key);
                                    result = result.filter(i=>!nodeChildren.includes(i.key));                                              
                                }
                            }                          
                            return (   
                                <Form.Item name="switch_parent">                       
                                    <Select>
                                        {
                                            result.map((item,index)=>(
                                                <Option key={item.key} value={item.key}>{ item.title }</Option>
                                            ))   
                                        }
                                    </Select> 
                                </Form.Item>
                            )
                            
                        }}                    
                    </Form.Item>
                    :
                    null
                }
                {
                    forMachs
                    ?
                    <Form.Item name='person_id' label='责任人'>
                        {
                            managerList && managerList.length 
                            ?
                            <Select>
                                {
                                    managerList.map((item,index)=>(
                                        <Option key={item.person_id} value={item.person_id}>{ item.name }</Option>
                                    ))
                                }
                            </Select>
                            :
                            null
                        }
                    </Form.Item>
                    :
                    null
                }
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <Button type="primary" htmlType="submit">确定</Button>
                    <Button type="primary" style={{margin:'0 10px'}} onClick={()=>{
                        form.resetFields();
                        setPos({});
                        onClose();
                    }}> 取消 </Button>
                </Form.Item>
            </Form>
            <Modal visible={visible} footer={null} onCancel={()=>setVisible(false)} width='1000px' title={
                <div>
                    <Search style={{ width:'260px' }} placeholder='请输入公司名称' onSearch={value=>{            
                        if( AMap && value ){
                            AMap.plugin('AMap.PlaceSearch',function(){
                                let placeSearch = new AMap.PlaceSearch({
                                    extensions:'all',
                                });
                                placeSearch.search(value,function(status, result){
                                    // console.log(status);
                                    // console.log(result);
                                    if ( points.length && map.remove ) map.remove(points);
                                    if ( status === 'complete' && result.poiList.pois && result.poiList.pois.length ) {
                                        // 搜索到结果,默认取第一条搜索值
                                        let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                                        result.poiList.pois.forEach(point=>{ 
                                            let pos = [point.location.lng, point.location.lat];
                                            let marker = new AMap.Marker({
                                                position:pos,
                                                map
                                            });
                                            marker.extData = { company_name:point.name, lng:pos[0], lat:pos[1], address:point.address, province:point.pname, city:point.cityname, area:point.adname };
                                            marker.content = `<div><p style="font-weight:bold;">${point.name}</p><p>地址:${point.address}</p><p>电话:${point.tel}</p></div>`;
                                            marker.on('mouseover', handleShowInfo);
                                            marker.on('click',handleClick);  
                                            points.push(marker);                               
                                        });
                                       
                                        function handleClick(e){
                                            setPos({ lng:e.target.extData.lng, lat:e.target.extData.lat});
                                            setVisible(false);
                                        }
                                        function handleShowInfo(e){
                                            infoWindow.setContent(e.target.content);
                                            infoWindow.open(map, e.target.getPosition());
                                        }
                                        map.setFitView();
                                        
                                    } else {
                                        message.info('请输入完整的关键词查询');
                                    }
                                });
                            })
                        } else {
                            message.info('查询位置不能为空');
                        }
                    }}/>
                </div>
            }>
                <div id='my-map' style={{ width:'940px', height:'600px' }}></div>
            </Modal>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info || prevProps.AMap !== nextProps.AMap ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(AddForm, areEqual);