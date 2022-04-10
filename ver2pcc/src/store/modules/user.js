import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    organizationName: '',
    organizationCode: '',
    departmentName: '',
    departmentCode: '',
    avatar: '',
    roles: []
    // 修改
    // departments: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },

  SET_TOKEN: (state, token) => {
    state.token = token
  },

  SET_ORGANIZATION_NAME: (state, name) => {
    state.organizationName = name
  },
  SET_ORGANIZATION_CODE: (state, code) => {
    state.organizationCode = code
  },
  SET_DEPARTMENT_NAME: (state, name) => {
    state.departmentName = name
  },
  SET_DEPARTMENT_CODE: (state, code) => {
    state.departmentCode = code
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
  // SET_DEPARTS: (state, departments) => {
  //   state.departments = departments
  // }

}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username: username, password, tenant } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, tenant: tenant }).then(response => {
        console.log(response)
        const { access_token } = response.dataContent

        commit('SET_TOKEN', access_token)
        // commit('SET_USERNAME', username)
        setToken(access_token)
        resolve()
      }).catch(error => {
        console.log(error)
        // const { data } = error.response
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { dataContent } = response
        if (!dataContent) {
          reject('验证信息失败，请重新登录')
        }

        // const { name, avatar } = data
        const pp = String(Math.round(Math.random() * 5))
        commit('SET_ORGANIZATION_NAME', dataContent.tenant + pp)
        commit('SET_AVATAR', dataContent.userName)
        commit('SET_DEPARTMENT_CODE', dataContent.departmentCode)
        commit('SET_DEPARTMENT_NAME', dataContent.departmentName)
        // console.log(state.organizationName)

        // const roles = []
        // dataContent.roles.map(element => {
        //   roles.push(element.name)
        // })
        commit('SET_ROLES', dataContent.roles)
        resolve([dataContent.roles, dataContent.userName])
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      removeToken()
      commit('RESET_STATE')
      resolve()
    })
  }

  // departs
  // getAllDepartments ({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getDepartments().then(res => {
  //       if (res.dataContent !== null) {
  //         const { dataContent } = res
  //         commit('SET_DEPARTS', dataContent)
  //         resolve(dataContent)
  //       }
  //     }).catch(error => {
  //       console.log(error)
  //       reject(error)
  //     })
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

