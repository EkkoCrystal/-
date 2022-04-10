import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '*',
    redirect: '/'
  },
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
    meta: { title: '疫情防控', icon: 'home' },
    children: [{
      path: 'index',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: '' }
    }]
  },
  {
    path: '/company',
    component: Layout,
    meta: { title: '公司管理', icon: 'aver' },
    children: [
      {
        path: 'deparment',
        name: 'Department',
        component: () => import('@/views/dashboard/department'),
        meta: { title: '部门管理', icon: '' }
      },
      {
        path: 'worksecode',
        name: 'Worksecode',
        component: () => import('@/views/dashboard/worksecode'),
        meta: { title: '公司园区', icon: '' }
      }

    ]
  },
  {
    path: '/dorm',
    component: Layout,
    meta: { title: '住宿管理', icon: 'aver' },
    children: [{
      path: 'dormStaff',
      name: 'DormStaff',
      component: () => import('@/views/dashboard/dormStaff'),
      meta: { title: '宿舍人员', icon: '' }
    },
    {
      path: 'dorm',
      name: 'Dorm',
      component: () => import('@/views/dashboard/dorm'),
      meta: { title: '公司宿舍', icon: '' }
    },
    {
      path: 'quarantine',
      name: 'Quarantine',
      component: () => import('@/views/riskarea/quarantine'),
      meta: { title: '封闭培训点', icon: '' }
    },
    {
      path: 'quarantinePeo',
      name: 'QuarantinePeo',
      component: () => import('@/views/riskarea/quarantinePeo'),
      meta: { title: '封闭培训人员', icon: '' }
    }

    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
  path: '/riskarea',
  component: Layout,
  meta: { title: '防疫管理', icon: 'aver', roles: ['admin'] },
  children: [{
    path: 'staff',
    name: 'Staff',
    component: () => import('@/views/dashboard/staff'),
    meta: { title: '人员信息', icon: '' }
  },
  {
    path: 'riskarea',
    name: 'Riskarea',
    component: () => import('@/views/riskarea/riskarea'),
    meta: { title: '风险区域', icon: '' }
  },
  {
    path: 'riskareaquery',
    name: 'Riskareaquery',
    component: () => import('@/views/riskarea/riskareaquery'),
    meta: { title: '风险人员', icon: '' }
  },

  {
    path: 'affectedAreaRecord',
    name: 'AffectedAreaRecord',
    component: () => import('@/views/riskarea/affectedAreaRecord'),
    meta: { title: '风险管控记录', icon: '' }
  }
  ]
},
{
  path: '/setting',
  component: Layout,
  meta: { title: '系统设置', icon: 'set', roles: ['admin'] },
  alwaysShow: true,
  children: [
    {
      path: 'exception',
      name: 'Exception',
      component: () => import('@/views/setting/exception'),
      meta: { title: '异常处理', icon: '' }
    }
  ]
}
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
