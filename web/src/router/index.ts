import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Admin from '../views/Admin.vue'

Vue.use(VueRouter)

 

const routes = [
    {
        path: '/',
        name: '首页',
        component: Home
    },
    {
        path: '/v',
        name: '项目',
        component: Admin,
        children: [
            {
                path: 'mns',
                name:'上位机列表',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/RTU/MNList2.vue')
            },
            {
                path: 'rtu',
                name:'数采仪基本信息',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/RTU/RTUInfo.vue')
            },
            {
                path: 'bs',
                name:'基础设置',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/RTU/BasicSetting.vue')
            },
            {
                path: 'ti',
                name:'校时',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/CorrectTime/Timing.vue')
            },
            {
                path: 'dc',
                name:'动态管控',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/Device/DynamicControlCard.vue')
            },
            {
                path: 'dr',
                name:'反控设置',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/Device/DlgRecriminateControlCard.vue')
            },
            {
                path: 'co',
                name:'采集设备配置',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/Collecting/Collecting.vue')
            },
            {
                path: 'cd',
                name:'串口调试',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/ComDebug/ComDebug.vue')
            },
            {
                path: 'cluster',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/Cluster/GmsDashboard.vue')
            },
            {
                path: 'cardList',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/CardList/CardList.vue')
            },
            {
                path: 'devices',
                component: () => import(/* webpackChunkName: "devices" */ '../components/Device/GmsDevices.vue')
            },
            {
                path: 'prjs',
                component: () => import(/* webpackChunkName: "prjs" */ '../components/Projects/GmsProjects.vue')
            },
            {
                path: 'metrics',
                component: () => import(/* webpackChunkName: "metrics" */ '../components/Metrics/GmsMetrics.vue')
            },
            {
                path: 'logs',
                component: () => import(/* webpackChunkName: "logs" */ '../components/Logs/GmsLogs.vue')
            },
            {
                path: 'tools',
                component: () => import(/* webpackChunkName: "tools" */ '../components/Tools/GmsTools.vue')
            },
            {
                path: 'users',
                component: () => import(/* webpackChunkName: "users" */ '../components/Users/GmsUsers.vue')
            }
        ]
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router
