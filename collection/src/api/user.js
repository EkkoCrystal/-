import request from '@/utils/request'

// -------------------------
export function getIdentityTypes () {
  return request({
    url: 'collect-app-service/order/identityTypes',
    method: 'get'
  })
}
export function getPersonTypes () {
  return request({
    url: 'collect-app-service/order/personTypes',
    method: 'get'
  })
}

export function collectInfo (data) {
  return request({
    url: 'collect-app-service/order/v2',
    method: 'post',
    data: data
  })
}
export function getOrderInfo (phone) {
  return request({
    url: 'collect-app-service/order/orders',
    method: 'get',
    params: {
      phoneNumber: phone
    }
  })
}

export function login (data) {
  console.log('执行login')
  return request({
    url: 'oauth-service/oauth/admin/login',
    method: 'post',
    data: {
      // organizationCode: data.organizationCode,
      password: data.password,
      userName: data.username

    }
  })
}
// -------------------------------首页---------------------------------
// 首页
export function getTotalCount () {
  return request({
    url: 'app-service/statistics/totalCount',
    method: 'get'
  })
}
export function getDayTrend (day) {
  return request({
    url: 'app-service/statistics/dayTrend',
    method: 'get',
    params: {
      day: day

    }
  })
}
export function getTotalAreaSummary () {
  return request({
    url: 'app-service/statistics/totalAreaSummary',
    method: 'get'
  })
}
export function getDayAreaSummary () {
  return request({
    url: 'app-service/statistics/dayAreaSummary',
    method: 'get'
  })
}
// -------------------------------用户管理---------------------------------
export function getUsers (data) {
  return request({
    url: 'app-service/users/page',
    method: 'get',
    params: {
      condition: data.condition,
      page: data.page,
      size: data.size
    }
  })
}
// 用户详情
export function getUsersDetail (userID) {
  return request({
    url: 'app-service/users/userInfo',
    method: 'get',
    params: {
      userId: userID
    }
  })
}
// 用户测试列表
export function getUsersRecords (data) {
  return request({
    url: 'app-service/flexcheck/records',
    method: 'get',
    params: {
      userId: data.userId,
      page: data.page,
      size: data.size
    }
  })
}

// -------------------------------风险管理---------------------------------
export function getAffectedRecords (data) {
  return request({
    url: 'app-service/flexcheck/affectedRecords',
    method: 'get',
    params: {
      condition: data.condition,
      // province: data.province,
      // city: data.city,
      // county: data.county,
      page: data.page,
      size: data.size
    }
  })
}
// -------------------------------组织机构管理---------------------------------
// 组织机构管理
export function getOrganizations (data) {
  return request({
    url: 'app-service/organization/page',
    method: 'get',
    params: {
      // condition: data.condition,
      // // province: data.province,
      // // city: data.city,
      // // county: data.county,
      page: data.page,
      size: data.size
    }
  })
}
// 创建
export function creatOrganization (data) {
  return request({
    url: 'app-service/organization',
    method: 'post',
    data: data
  })
}
// 修改
export function modifyOrganization (data) {
  return request({
    url: 'app-service/organization',
    method: 'put',
    data: data
  })
}
//  分配密码
export function resetPassword (data) {
  return request({
    url: 'app-service/organization/resetPassword',
    method: 'post',
    data: data
  })
}
