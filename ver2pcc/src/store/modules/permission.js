import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
import { getAuthorityMenus } from '@/api/user'
import { Message } from 'element-ui'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu (routes, data) {
  data.forEach(item => {
    const menu = {
      path: item.path === '#' ? item.id + '#' : item.path,
      component: item.path === '#' ? Layout : resolve => {
        require(['@/views' + item.component], resolve)
      },
      hidden: item.hidden,
      children: [],
      name: 'menu_' + item.id,
      meta: { title: item.lable, icon: item.icon, id: item.id, roles: ['tenant_admin'] }
    }
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}

// 动态路由
const actions = {
  generateRoutes ({ commit }, objArr) {
    return new Promise(resolve => {
      const loadMenuData = []
      let userName = ''
      if (objArr !== undefined && objArr.length) {
        userName = objArr[0]
      }
      // 查询菜单
      getAuthorityMenus(userName).then(res => {
        if (res.code !== '1' || res.dataContent === undefined || res.dataContent === null) {
          Message.error('菜单数据加载异常')
        } else if (res.dataContent.length <= 0) {
          Message.error('该账户无菜单权限，请先分配菜单权限')
        } else {
          const data = res.dataContent
          // data = kk.data
          Object.assign(loadMenuData, data)
          asyncRoutes.length = 0
          generaMenu(asyncRoutes, loadMenuData)
          asyncRoutes.push({ path: '*', redirect: '/404', hidden: true })
          let accessedRoutes = []
          // if (roles.includes('tenant_admin')) {
          //   accessedRoutes = asyncRoutes || []
          // } else {
          //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
          // }
          accessedRoutes = asyncRoutes
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
      }).catch(err => {
        console.log(err)
        Message.error('菜单数据加载异常' + err.message)
      })
      // const roles = objArr[1]
      // let accessedRoutes
      // if (roles.includes('tenant_admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
