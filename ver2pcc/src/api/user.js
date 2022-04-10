import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/app-service/v1/login',
    method: 'post',
    data: {
      // organizationCode: data.organizationCode,
      userName: data.username,
      password: data.password,
      tenant: data.tenant

    }
  })
}

export function getInfo () {
  return request({
    url: '/user-service/v1/users/profile',
    method: 'get'

  })
}
// 获取用户的权限菜单
export function getAuthorityMenus (userName) {
  return request({
    url: '/user-service/v1/users/authorityMenus',
    method: 'get',
    params: {
      userName: userName
    }
  })
}

export function logout () {
  return request({
    url: '/app-service/v1/logout',
    method: 'post'
  })
}

export function getDoctors () {
  return request({
    url: '/app-service/v1/doctors',
    method: 'get'

  })
}

export function queryDoctors (departmentCode) {
  return request({
    url: '/app-service/v1/doctors/list',
    method: 'get',
    params: {
      departmentCode: departmentCode
    }

  })
}

export function getGenders () {
  return request({
    url: '/app-service/v1/dict/genders',
    method: 'get'

  })
}

export function getDepartments () {
  return request({
    url: '/app-service/v1/departments/allTree',
    method: 'get'

  })
}

export function queryUsers (condition) {
  return request({
    url: '/user-service/v1/users/page',
    method: 'get',
    params: {
      queryCondition: condition.queryCondition,
      departmentCode: condition.departmentCode,
      isActive: condition.isActive,
      page: condition.page,
      size: condition.size
    }

  })
}
// export function getRoles () {
//   return request({
//     url: '/user-service/v1/roles',
//     method: 'get'

//   })
// }

export function updateUser (user) {
  return request({
    url: '/user-service/v1/users',
    method: 'put',
    data: user

  })
}

export function createUser (user) {
  return request({
    url: '/user-service/v1/users',
    method: 'post',
    data: user

  })
}
export function getUsers () {
  return request({
    url: '/user-service/v1/users/list',
    method: 'get'

  })
}
export function deleteUser (userName) {
  return request({
    url: '/user-service/v1/users',
    method: 'delete',
    params: {
      userName: userName
    }

  })
}
export function changePassword (data) {
  return request({
    url: '/user-service/v1/users/changePassword',
    method: 'put',
    data: data

  })
}
export function resetPassword (data) {
  return request({
    url: '/user-service/v1/users/resetPassword',
    method: 'put',
    data: data

  })
}

export function getSubDepartment (code) {
  return request({
    url: '/app-service/v1/departments/info/tree',
    method: 'get',
    params: {
      departmentCode: code
    }
  })
}
export function createDepartment (data) {
  return request({
    url: '/app-service/v1/departments',
    method: 'post',
    data: data

  })
}
export function updateDepartment (data) {
  return request({
    url: '/app-service/v1/departments',
    method: 'put',
    data: data

  })
}
export function deleteDepartment (id) {
  return request({
    url: '/app-service/v1/departments/' + id,
    method: 'delete'

  })
}
export function getLisConfig () {
  return request({
    url: '/app-service/v1/his',
    method: 'get'

  })
}

export function setLisConfig (data) {
  return request({
    url: '/app-service/v1/his',
    method: 'post',
    data: data

  })
}
export function saveHospital (data) {
  return request({
    url: '/user-service/v1/tenants',
    method: 'put',
    data: data

  })
}
// 获取靶值设置
export function getTargetValueInfo (data) {
  return request({
    url: '/app-service/v1/targetSetting',
    method: 'get',
    params: {
      stripType: data
    }
  })
}
// 保存靶值
export function saveTargetValueInfo (data) {
  return request({
    url: '/app-service/v1/targetSetting',
    method: 'post',
    data: data

  })
}

// 获取危急值设置
export function getCrisisValueInfo (data) {
  return request({
    url: '/app-service/v1/crisisSetting',
    method: 'get',
    params: {
      category: data
    }
  })
}
// 保存危急值设置
export function saveCrisisValueInfo (data) {
  return request({
    url: '/app-service/v1/crisisSetting',
    method: 'post',
    data: data
  })
}
// APP参数设置
export function parConfigInfo () {
  return request({
    url: '/app-service/v1/dict/byType',
    method: 'get',
    params: {
      type: 'APP'
    }
  })
}
// 修改APP参数设置
export function saveParConfigInfo (data) {
  return request({
    url: '/app-service/v1/dict',
    method: 'post',
    data: data
  })
}
// 自动会诊设置
export function saveAutoConsultation (data) {
  return request({
    url: '/app-service/v1/autoConsultation',
    method: 'post',
    data: data
  })
}
// 自动会诊信息
export function getAutoConsultation () {
  return request({
    url: '/app-service/v1/autoConsultation',
    method: 'get'
  })
}

// 菜单管理
// 获取菜单树
export function getMenus () {
  return request({
    url: '/user-service/v1/menus/allTree',
    method: 'get'

  })
}
// 新增
export function addMenus (data) {
  return request({
    url: '/user-service/v1/menus',
    method: 'post',
    data: data

  })
}
// 修改
export function updateMenus (data) {
  return request({
    url: '/user-service/v1/menus',
    method: 'PUT',
    data: data

  })
}
// 删除
export function deleteMenus (id) {
  return request({
    url: '/user-service/v1/menus',
    method: 'DELETE',
    params: {
      id: id
    }

  })
}
// 角色
// 获取
export function getRoles () {
  return request({
    url: '/user-service/v1/roles',
    method: 'get'

  })
}
// 新增
export function addRoles (data) {
  return request({
    url: '/user-service/v1/roles',
    method: 'post',
    data: data

  })
}
// 修改
export function updateRoles (data) {
  return request({
    url: '/user-service/v1/roles',
    method: 'PUT',
    data: data

  })
}
// 删除
export function deleteRoles (id) {
  return request({
    url: '/user-service/v1/roles',
    method: 'DELETE',
    params: {
      id: id
    }

  })
}
// 获取角色的菜单权限
export function getRolesAuthority (id) {
  return request({
    url: '/user-service/v1/roles/authority/' + id,
    method: 'GET'
  })
}
// 分配权限
export function saveRolesAuthority (data) {
  return request({
    url: '/user-service/v1/roles/authority',
    method: 'POST',
    data: data
  })
}
