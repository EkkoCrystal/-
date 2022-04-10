import { login, getAdminInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),

    user_name: '',
    //  organizationName: '',
    //   organizationCode: '',
    //   departmentName: '',
    //    departmentCode: '',
    roles: []
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

  // SET_ORGANIZATION_NAME: (state, name) => {
  //   state.organizationName = name
  // },
  // SET_ORGANIZATION_CODE: (state, code) => {
  //   state.organizationCode = code
  // },
  // SET_DEPARTMENT_NAME: (state, name) => {
  //   state.departmentName = name
  // },
  // SET_DEPARTMENT_CODE: (state, code) => {
  //   state.departmentCode = code
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },

  SET_USERNAME: (state, username) => {
    state.user_name = username
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }

}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username: username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log(response)
        // const { access_token } = response
        commit('SET_TOKEN', response.dataContent.access_token)

        setToken(response.dataContent.access_token)
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
      getAdminInfo().then(res => {
        console.log('-----------getinfo-------------')
        if (!res.dataContent) {
          reject('验证信息失败，请重新登录')
        }
        commit('SET_USERNAME', res.dataContent.userName)
        var keyRoles = []
        res.dataContent.roles.map(element => {
          keyRoles.push(element.name)
        })
        commit('SET_ROLES', keyRoles)
        resolve(res.dataContent.roles)
      }).catch(err => {
        console.log(err.message)
        reject(err.message)
      })
    })
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

