import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  // {
  //   path: '*',
  //   redirect: '/'
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: { title: '患者管理', icon: 'patient' },
    hidden: true,
    children: [{
      path: 'index',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '住院患者', icon: '' },
      hidden: true
    }]
  }
  // {
  //   path: '/bigcharts',
  //   name: 'Bigcharts',
  //   component: () => import('@/views/bigcharts'),
  //   meta: { title: '院内大屏', icon: '' },
  //   hidden: true
  // },
  // {
  //   path: '/detail',
  //   name: 'PatientDetail',
  //   component: () => import('@/views/dashboard/details'),
  //   meta: { title: '详细信息', icon: '' },
  //   hidden: true
  // },
  // {
  //   path: '/quality/m/report',
  //   name: 'MReport',
  //   component: () => import('@/views/quality/mreport'),
  //   meta: { title: '质控月报', icon: '' },
  //   hidden: true

  // },
  // {
  //   path: '/quality/ljreport',
  //   name: 'LJReport',
  //   component: () => import('@/views/quality/ljreport'),
  //   meta: { title: '质控曲线', icon: '' },
  //   hidden: true

  // },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/index',
  //   meta: { title: '患者管理', icon: 'patient' },
  //   children: [{
  //     path: 'index',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: '住院患者', icon: '' }
  //   },
  //   {
  //     path: '/outpatient',
  //     name: 'Outpatient',
  //     component: () => import('@/views/dashboard/outpatient'),
  //     meta: { title: '出院患者', icon: '' }
  //   },
  //   {
  //     path: '/detail',
  //     name: 'PatientDetail',
  //     component: () => import('@/views/dashboard/details'),
  //     meta: { title: '详细信息', icon: '' },
  //     hidden: true
  //   },
  //   {
  //     path: '/consultation',
  //     name: 'consultation',
  //     component: () => import('@/views/consultation/index'),
  //     meta: { title: '会诊患者', icon: '' }
  //   },
  //   {
  //     path: '/list',
  //     name: 'list',
  //     component: () => import('@/views/consultation/list'),
  //     meta: { title: '患者列表', icon: '' },
  //     hidden: true
  //   },
  //   {
  //     path: '/editor',
  //     name: 'editor',
  //     component: () => import('@/views/consultation/editor'),
  //     meta: { title: '会诊信息', icon: '' },
  //     hidden: true
  //   },
  //   {
  //     path: '/todaywork',
  //     name: 'Todaywork',
  //     component: () => import('@/views/dashboard/todaywork'),
  //     meta: { title: '今日任务', icon: '' },
  //     hidden: false
  //   }

  //   ]
  // },
  // {
  //   path: '/consultation',
  //   component: Layout,
  //   meta: { title: '会诊管理', icon: 'data' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'index',
  //       component: () => import('@/views/consultation/index'),
  //       meta: { title: '会诊患者', icon: '' }
  //     },
  //     {
  //       path: 'list',
  //       name: 'list',
  //       component: () => import('@/views/consultation/list'),
  //       meta: { title: '患者列表', icon: '' }
  //     },
  //     {
  //       path: 'editor',
  //       name: 'editor',
  //       component: () => import('@/views/consultation/editor'),
  //       meta: { title: '会诊信息', icon: '' }
  //     }

  //   ]

  // },

  // {
  //   path: '/data',
  //   component: Layout,

  //   // name: 'Data',
  //   meta: { title: '数据管理', icon: 'data' },
  //   children: [
  //     {
  //       path: 'data',
  //       name: 'Data',
  //       component: () => import('@/views/data/index'),
  //       meta: { title: '血糖数据', icon: '' }
  //     },
  //     {
  //       path: 'view',
  //       name: 'DataView',
  //       component: () => import('@/views/data/dataView'),
  //       meta: { title: '血糖数据', icon: '' },
  //       hidden: true
  //     },
  //     {
  //       path: 'clinical',
  //       name: 'Clinical',
  //       component: () => import('@/views/data/clinical'),
  //       meta: { title: '血酮/尿酸数据', icon: '' },
  //       hidden: false
  //     },
  //     {
  //       path: 'critical',
  //       name: 'Critical',
  //       component: () => import('@/views/data/critical'),
  //       meta: { title: '异常值查询', icon: '' }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/quality',
  //   component: Layout,
  //   redirect: '/quality/index',
  //   // name: 'Example',
  //   meta: { title: '质控管理', icon: 'qc' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'qualityRecord',
  //       component: () => import('@/views/quality/index'),
  //       meta: { title: '质控记录', icon: '' }
  //     },
  //     {
  //       path: 'analyse',
  //       name: 'qualityAnalyse',
  //       component: () => import('@/views/quality/analyse'),
  //       meta: { title: '质控分析', icon: '' }
  //     },
  //     {
  //       path: 'instrument',
  //       name: 'Instrument',
  //       component: () => import('@/views/quality/instrument'),
  //       meta: { title: '仪器管理', icon: '' }
  //     },
  //     {
  //       path: 'qualityLiquid',
  //       name: 'QualityLiquid',
  //       component: () => import('@/views/quality/qualityLiquid'),
  //       meta: { title: '控制液管理', icon: '', roles: ['tenant_admin', 'doctor', 'nurse'] }
  //     },
  //     {
  //       path: 'strips',
  //       name: 'Strips',
  //       component: () => import('@/views/quality/strips'),
  //       meta: { title: '测试条管理', icon: '', roles: ['tenant_admin', 'doctor', 'nurse'] }
  //     },
  //     {
  //       path: '/quality/m/report',
  //       name: 'MReport',
  //       component: () => import('@/views/quality/mreport'),
  //       meta: { title: '质控月报', icon: '' },
  //       hidden: true
  //     },
  //     {
  //       path: '/quality/ljreport',
  //       name: 'LJReport',
  //       component: () => import('@/views/quality/ljreport'),
  //       meta: { title: '质控曲线', icon: '' },
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   path: '/bglanalyse',
  //   component: Layout,
  //   meta: { title: '统计分析', icon: 'analyse' },
  //   children: [
  //     {
  //       path: 'patientStatistics',
  //       name: 'PatientStatistics',
  //       component: () => import('@/views/bglanalyse/patientStatistics'),
  //       meta: { title: '患者统计', icon: '' }
  //     },
  //     {
  //       path: 'bgluStatistics',
  //       name: 'BgluStatistics',
  //       component: () => import('@/views/bglanalyse/bgluStatistics'),
  //       meta: { title: '血糖统计', icon: '' }
  //     }
  //   ]
  // },
  // {
  //   path: '/hospital',
  //   component: Layout,
  //   meta: { title: '医院管理', icon: 'hospital' },
  //   children: [
  //     {
  //       path: 'department',
  //       name: 'Department',
  //       component: () => import('@/views/hospital/department'),
  //       meta: { title: '科室管理', icon: '', roles: ['tenant_admin', 'presentation'] }
  //     },
  //     {
  //       path: 'user',
  //       name: 'User',
  //       component: () => import('@/views/hospital/user'),
  //       meta: { title: '员工账号', icon: '', roles: ['tenant_admin', 'presentation'] }
  //     },
  //     {
  //       path: 'advice',
  //       name: 'AdviceTemplate',
  //       component: () => import('@/views/hospital/adviceTemplate'),
  //       meta: { title: '医嘱模板', icon: '' }
  //     },
  //     {
  //       path: 'setting',
  //       name: 'Setting',
  //       component: () => import('@/views/hospital/setting'),
  //       meta: { title: '医院设置', icon: '', roles: ['tenant_admin'] }
  //     },
  //     {
  //       path: 'drug',
  //       name: 'Drug',
  //       component: () => import('@/views/hospital/drug'),
  //       meta: { title: '药品管理', icon: '', roles: ['tenant_admin', 'doctor', 'nurse'] }
  //     }
  //     // {
  //     //   path: 'menu',
  //     //   name: 'Menu',
  //     //   component: () => import('@/views/hospital/menu'),
  //     //   meta: { title: '菜单管理', icon: '' }
  //     // },
  //     // {
  //     //   path: 'role',
  //     //   name: 'Role',
  //     //   component: () => import('@/views/hospital/role'),
  //     //   meta: { title: '角色管理', icon: '' }
  //     // }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
