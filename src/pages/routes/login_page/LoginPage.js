import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'dva/router';
import { Table, Button, Card, Form, Modal, Input, message } from 'antd';
import { LockOutlined, UserOutlined, DownloadOutlined, FilePdfOutlined } from '@ant-design/icons';
import loginBg from '../../../../public/login_bg.jpg';
import switchBg from '../../../../public/switch_bg.jpg';
import switchImg from '../../../../public/switch.webp';
import style from './LoginPage.css';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
};
const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
};

function LoginPage({ dispatch, user }) {  
    const { thirdAgent } = user;
    const [form] = Form.useForm();
    const [dataURL, setDataURL] = useState(null);
    const [visible, setVisible] = useState(false);
    const [numPages, setNumPages] = useState(null);
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);    
    }
    useEffect(()=>{
        fetch('/openapi.pdf')
        .then(response=>{
            return response.blob();
        })
        .then(blob=>{
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = ()=>{            
                setDataURL(reader.result);
            }
        })
        .catch(err => ({ err }));
    },[])
    return (        
        localStorage.getItem('user_id') && location.pathname === '/login'
        ?
        <Redirect to='/' />
        :
        <div className={style.container} >
            <div className={style['logo-container']}>
                <img src={Object.keys(thirdAgent).length ? thirdAgent.logo_path : ''} style={{ marginRight:'20px' }} />
            </div>
            <div style={{ position:'fixed', right:'1rem', top:'1rem', zIndex:'2' }} onClick={()=>{
                if ( dataURL ){
                    let linkBtn = document.createElement('a');
                    linkBtn.download = '开发api.pdf' ;          
                    linkBtn.href = dataURL;
                    let event;
                    if( window.MouseEvent) {
                        event = new MouseEvent('click');
                    } else {
                        event = document.createEvent('MouseEvents');
                        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    }
                    linkBtn.dispatchEvent(event);
                } else {
                    message.info('文件还在加载，请稍后再点击下载');
                }
            }}>
                <FilePdfOutlined style={{ color:'#fff' }} />
                <a style={{ color:'#fff'}}>开放api</a>
            </div>
            <div className={style['title-container']}>智慧空开监控系统</div>
            <div className={style['login-container']}>
                <div className={style['img-container']} style={{ backgroundImage:`url(${switchBg})`}}><img src={switchImg} style={{ width:'60%', marginLeft:'50px', marginTop:'50px'}} /></div>
                <div className={style['form-container']}>
                    <div className={style['title']}>用户登录</div>
                    <Form
                        {...layout}
                        className={style['form']}
                        form={form}
                    >
                        <Form.Item                            
                            name="user_name"
                            rules={[{required:true, message:'账号不能为空!'}]}
                        >
                            <Input addonBefore={<UserOutlined />} bordered='false' />
                        </Form.Item>
                        <Form.Item                           
                            name="password"
                            rules={[{required:true, message:'密码不能为空!'}]}
                        >
                            <Input.Password addonBefore={<LockOutlined />} bordered='false' />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" style={{width:'100%', height:'40px'}} onClick={()=>{
                                form.validateFields()
                                .then(values=>{
                                    new Promise((resolve,reject)=>{
                                        dispatch({type:'user/login', payload:values, resolve, reject })
                                    }).then(()=>{})
                                    .catch(msg=>{
                                        message.error(msg);
                                    })
                                })
                            }}>登录</Button>
                        </Form.Item>
                    </Form>
                </div>
                
                {/* <div style={{ textAlign:'center' }}><a onClick={()=>setVisible(true)} style={{ marginRight:'1rem' }}>开放api.pdf</a><a style={{ marginRight:'1rem' }} onClick={()=>setVisible(true)}>查看</a><a style={{ marginRight:'1rem' }} onClick={()=>{
                    if ( dataURL ){
                        let linkBtn = document.createElement('a');
                        linkBtn.download = '开发api.pdf' ;          
                        linkBtn.href = dataURL;
                        let event;
                        if( window.MouseEvent) {
                            event = new MouseEvent('click');
                        } else {
                            event = document.createEvent('MouseEvents');
                            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        }
                        linkBtn.dispatchEvent(event);
                    } else {
                        message.info('文件还在加载，请稍后再点击下载');
                    }
                }}>下载</a></div> */}
            </div>        
            <div className={style['bg-container']} style={{ backgroundImage:`url(${loginBg})` }}></div>
            <Modal
                width='1000px'
                bodyStyle={{ padding:'0' }}
                visible={visible}
                onCancel={()=>setVisible(false)}
            >
                <Document
                    file={dataURL}
                    onLoadSuccess={onDocumentLoadSuccess}     
                >
                  {
                      new Array(numPages).fill('').map((item,index)=>(
                          <Page key={index} width={1000} pageNumber={index+1} />
                      ))
                  }
                </Document>
            </Modal>    
            {/* <div style={{ position:'absolute', left:'calc( 10% + 140px)', bottom:'20px', fontSize:'0.8rem' }}>粤ICP备20066003号</div> */}
        </div>
    )
}

export default connect(({ user })=>({ user }))(LoginPage);
