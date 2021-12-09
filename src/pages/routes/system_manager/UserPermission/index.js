import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Drawer, Tree, Button, message } from 'antd';
import style from '@/pages/routes/IndexPage.css';

function formatTreeData(tree){
    if ( tree.length ){
        tree.forEach(node=>{
            node.key = node.menu_id;
            node.title = node.menu_name;
            node.children = node.child;
            if ( node.child && node.child.length ){
                formatTreeData(node.child);
            }
        });
    }
}
function treeSelect(node, result){
    result.push(node.menu_id);
    if ( node.child && node.child.length ){
        node.child.forEach(item=>{
            treeSelect(item, result);
        })
    }
}

let currentRole = '';
function UserPermission({ dispatch, user, permission }){
    let { userMenu } = user;
    let { roleList, userPermission } = permission;
    let [visible, setVisible] = useState(false);
    useEffect(()=>{
       dispatch({ type:'permission/fetchRoleList'}); 
       return ()=>{
           currentRole = '';
       }
    },[]);
    // console.log(userMenu);
    formatTreeData(userMenu);
    let columns = [
        { title:'角色类型', dataIndex:'role_name'},
        {
            title:'操作',
            render:(row)=>(<span style={{ color:'#1890ff', cursor:'pointer' }} onClick={()=>{
                setVisible(true);
                currentRole = row.role_id;
                dispatch({ type:'permission/fetchUserPermission', payload:row.role_id });
            }}>权限设置</span>)
        }
       
    ]
    return (
        <div className={style['card-container']}>
            <Table 
                rowKey='record_id'
                columns={columns}
                dataSource={roleList}
                className={style['self-table-container'] + ' ' + style['dark'] }
                pagination={false}
        
            />
            <Drawer
                title="权限设置"
                placement="right"
                closable={false}
                width="40%"
                onClose={()=>{
                    setVisible(false);
                    dispatch({ type:'permission/changePermission', payload:[] });
                }}
                visible={ visible }
                footer={(
                    <div style={{ padding:'10px' }}>
                        <Button type='primary' style={{ marginRight:'10px' }} onClick={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'permission/setUserPermission', payload:{ resolve, reject, role_id:currentRole }})
                            })
                            .then(msg=>{
                                message.success('设置角色权限成功');
                                setVisible(false);
                            })
                            .catch(msg=>message.error(msg))
                        }}>确定</Button>
                        <Button onClick={()=>{
                            setVisible(false);
                            dispatch({ type:'permission/changePermission', payload:[] });
                        }}>取消</Button>
                    </div>
                )}
            >   
                <Tree
                    rowKey='role_id'
                    className={style['tree-container']}
                    checkable
                    checkStrictly
                    defaultExpandAll
                    treeData={userMenu}
                    checkedKeys={userPermission}
                    onCheck={( checkedKeys , { checkedNodes, node, checked })=>{
                        let selectedKeys = [];
                        treeSelect(node, selectedKeys);
                        let result;
                        if ( node.checked ){
                            // 当前为选中状态，执行取消选择操作, 则选中当前节点的所有子节点
                            result = userPermission.filter(i=>!selectedKeys.includes(i));
                        } else {
                            // 当前为未选中状态，执行选中操作
                            result = userPermission.concat(selectedKeys);
                        }
                        
                        dispatch({ type:'permission/changePermission', payload:result });
                    }}
                />       
            </Drawer>
        </div>
    )
}

export default connect(({ user, permission })=>({ user, permission }))(UserPermission);