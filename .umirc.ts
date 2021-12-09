import { defineConfig } from 'umi';

export default defineConfig({
    title:'ESMS智慧空开管理系统',
    links:[{ rel:'icon', href:'./avatar.png'}],
    nodeModulesTransform: {
        type: 'none',
    },
    metas: [
        {
          httpEquiv: 'Cache-Control',
          content: 'no-cache',
        },
        {
          httpEquiv: 'Pragma',
          content: 'no-cache',
        },
        {
          httpEquiv: 'Expires',
          content: '0',
        },
      ],
      hash:true,
    routes: [
        { path:'/login', component:'@/pages/routes/login_page'},
        { path:'/pdf-viewer', component:'@/pages/routes/login_page/PDFViewer'},
        // { path:'/login', component:'@/pages/routes/Test3'},
        { 
            path:'/', 
            component:'@/pages/routes/index_page',
            routes:[
                { path:'/', component:'@/pages/routes/agent_manager'},
                { path:'/sw_home', component:'@/pages/routes/agent_manager'},
                { path:'/sw_meter', component:'@/pages/routes/terminal_mach'},
                { path:'/sw_ctrl', component:'@/pages/routes/smart_manager'},
                { path:'/sw_realtime', component:'@/pages/routes/realtime_data'},
                { path:'/sw_warning', component:'@/pages/routes/alarm_manager' },
                { path:'/data_report', component:'@/pages/routes/data_report' },
                { path:'/sw_system', component:'@/pages/routes/system_manager'},
                { path:'/map_test', component:'@/pages/routes/BuildingLayer'},
                { path:'/topology_test', component:'@/pages/routes/Topology'},
                { path:'img_ceshi', component:'@/pages/routes/Test2'}
            ]
        }
    ],
    fastRefresh: {}
});
