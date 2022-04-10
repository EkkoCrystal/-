import request from '@/utils/request'

export function login (data) {
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

export function getAdminInfo () {
  return request({
    url: 'app-service/admins',
    method: 'get'

  })
}
export function resetPasswordHandle (data) {
  return request({
    url: 'app-service/users/resetPassword',
    method: 'post',
    data: {
      password: data.password,
      userId: data.userId

    }
  })
}

// 首页
export function getTodaySummary (data) {
  return request({
    url: 'app-service/statistics/todaySummary',
    method: 'get'
  })
}
export function getWorkerTodaySummary (data) {
  return request({
    url: 'app-service/statistics/worker/todaySummary',
    method: 'get'
  })
}

// 个园区打卡统计
export function getWorkSectionSummary () {
  return request({
    url: 'app-service/statistics/workSectionSummary',
    method: 'get'
  })
}

export function getUserDepartmentSummary (data) {
  return request({
    url: 'app-service/statistics/departmentSummary',
    method: 'get',
    params: {
      companyCode: data.companyCode,
      page: data.page,
      size: data.size
    }
  })
}

// 今日打卡异常记录

export function getUserClockTodayInRecords (data) {
  return request({
    url: 'app-service/userClockInRecord/todayExcepion',
    method: 'get',
    params: {
      page: data.page,
      size: data.size
    }
  })
}

// 宿舍统计

export function getDormitorySummary (data) {
  return request({
    url: 'app-service/statistics/dormitorySummary',
    method: 'get',
    params: {
      page: data.page,
      size: data.size
    }
  })
}

// 隔离点统计
export function getQuarantineSummary (data) {
  return request({
    url: 'app-service/statistics/quarantineSummary',
    method: 'get',
    params: {
      page: data.page,
      size: data.size
    }
  })
}

// 人员管理
export function allUserQuery (data) {
  return request({
    url: 'app-service/users/query',
    method: 'get',
    params: {
      condition: data.condition,
      dormitoryId: data.dormitoryId,
      departmentCode: data.departmentCode,
      provinceCode: data.provinceCode,
      cityCode: data.cityCode,
      userType: data.userType,
      workSectionCode: data.workSectionCode,
      page: data.page,
      size: data.size
    }
  })
}
// 查询条件宿舍id
export function getDormitoryList () {
  return request({
    url: 'app-service/dormitory/list',
    method: 'get'

  })
}

export function queryDormitoryList (data) {
  return request({
    url: 'app-service/dormitory/queryDormitory',
    method: 'get',
    params: {
      communtiy: data.communtiy,
      condition: data.condition,
      county: data.county,
      page: data.page,
      size: data.size,
      subdistrict: data.subdistrict
    }
  })
}
// 详情
export function getUserDetal (dataId) {
  return request({
    url: 'app-service/users/detail',
    method: 'get',
    params: {
      userId: dataId

    }
  })
}
// 轨迹
export function getUserTravel (dataId) {
  return request({
    url: 'app-service/userTravel',
    method: 'get',
    params: {
      userId: dataId

    }
  })
}
// 行程码
export function getTrackCodeRecords (dataId) {
  return request({
    url: 'app-service/trackCodeRecords/userTrackCode',
    method: 'get',
    params: {
      userId: dataId

    }
  })
}
// 园区
export function getWorkSections () {
  return request({
    url: 'app-service/workSections/all',
    method: 'get'

  })
}

export function addWorksection (data) {
  return request({
    url: 'app-service/workSections/save',
    method: 'post',
    data: data
  })
}
// 编辑
export function modifyWorkSections (data) {
  return request({
    url: 'app-service/workSections/save',
    method: 'post',
    data: data
  })
}
// 删除

export function deleteWorkSections (dataId) {
  return request({
    url: 'app-service/workSections',
    method: 'delete',
    params: {
      code: dataId

    }
  })
}
// 宿舍管理
// 获取所有宿舍
export function getDormitory (data) {
  return request({
    url: 'app-service/dormitory/queryDormitory',
    method: 'get',
    params: {
      condition: data.condition,
      quarantineArea: data.quarantineArea,
      country: data.country,
      subdistrict: data.subdistrict,
      page: data.page,
      size: data.size
    }
  })
}
// 新增宿舍
export function addDormitory (data) {
  return request({
    url: 'app-service/dormitory',
    method: 'post',
    data: data
  })
}
// 编辑宿舍
export function modifyDormitory (data) {
  return request({
    url: 'app-service/dormitory/updatePost',
    method: 'post',
    data: data
  })
}

// 删除宿舍
export function deleteDormitory (dataId) {
  return request({
    url: 'app-service/dormitory',
    method: 'delete',
    params: {
      id: dataId

    }
  })
}
// 标记风险
export function markWarn (data) {
  return request({
    url: 'app-service/users/markWarn',
    method: 'post',
    params: {
      userId: data.condition

    }
  })
}
// 解除风险
export function relieveWarn (data) {
  return request({
    url: 'app-service/users/relieveWarn',
    method: 'post',
    params: {
      userId: data.id,
      reason: data.reason

    }
  })
}
// users/reliveReasons
// 解除风险原因
export function getReliveReasons (data) {
  return request({
    url: 'app-service/users/reliveReasons',
    method: 'get'
  })
}
// 获取城市
export function getAreasRoot () {
  return request({
    url: 'app-service/areas/root',
    method: 'get'

  })
}
// 获取子城市
export function getAreasSub (dataID) {
  return request({
    url: 'app-service/areas/sub',
    method: 'get',
    params: {
      id: dataID

    }

  })
}
// 获取所有风险区域
export function getAffectedArea (data) {
  return request({
    url: 'app-service/affectedArea/page',
    method: 'get',
    params: {
      province: data.province,
      level: data.dangerLevel,
      page: data.page,
      size: data.size
    }
  })
}

// 新增风险区域/affectedArea
export function addAffectedArea (data) {
  return request({
    url: 'app-service/affectedArea',
    method: 'post',
    data: data

  })
}
// 新增接口2
export function addAffectedAreaBatch (data) {
  return request({
    url: 'app-service/affectedArea/batch',
    method: 'post',
    data: data

  })
}
// 修改风险等级
export function modifyAffectedLevel (data) {
  return request({
    url: 'app-service/affectedArea/changeLevel',
    method: 'post',
    data: data

  })
}

// 删除风险区域
export function deleteAffectedArea (dataID) {
  return request({
    url: 'app-service/affectedArea',
    method: 'delete',
    params: {
      id: dataID
    }
  })
}
// 风险人员管理
export function getUserDoubts (data) {
  return request({
    url: 'app-service/affectedArea/query',
    method: 'get',
    params: {
      processed: data.processed,
      level: data.level,
      reason: data.reason,
      solution: data.solution,
      condition: data.condition,
      page: data.page,
      size: data.size
    }
  })
}
// 风险等级
export function getAffectlevels (data) {
  return request({
    url: 'app-service/affectedArea/levels',
    method: 'get'
  })
}
// 解决方案
export function getAffectSolutions (data) {
  return request({
    url: 'app-service/affectedArea/solutions',
    method: 'get'
  })
}
// 处理
export function getAffectHandle (data) {
  return request({
    url: 'app-service/affectedArea/handle',
    method: 'post',
    data: data
  })
}
// 风险原因
export function getAffectReason (data) {
  return request({
    url: 'app-service/affectedArea/reason',
    method: 'get'
  })
}
// 隔离点
// 分页
export function getQuarantineSites (data) {
  return request({
    url: 'app-service/quarantineSites/query',
    method: 'get',
    params: {
      condition: data.condition,
      communtiy: data.communtiy,
      county: data.county,
      subdistrict: data.subdistrict,
      page: data.page,
      size: data.size
    }
  })
}
// 获取所有隔离点查询
export function getQuarSites (data) {
  return request({
    url: 'app-service/quarantineSites/list',
    method: 'get'
  })
}
// 新增
export function addQuarantineSites (data) {
  return request({
    url: 'app-service/quarantineSites',
    method: 'post',
    data: data
  })
}
// 修改
export function modifyQuarantineSites (data) {
  return request({
    url: 'app-service/quarantineSites/updatePost',
    method: 'post',
    data: data
  })
}
// 删除
export function deleteQuarantineSites (dataID) {
  return request({
    url: 'app-service/quarantineSites',
    method: 'delete',
    params: {
      id: dataID
    }
  })
}
// 隔离人员

export function getQuarantineUser (data) {
  return request({
    url: 'app-service/quarantineUser/query',
    method: 'get',
    params: {
      quarantineSiteId: data.quarantineSiteId,
      day: data.day,
      page: data.page,
      size: data.size
    }
  })
}
// 风险管控
export function getaffectedAreaRecord (data) {
  return request({
    url: 'app-service/affectedAreaRecord/query',
    method: 'get',
    params: {
      processed: data.processed,
      reason: data.reason,
      solution: data.solution,
      condition: data.condition,
      page: data.page,
      size: data.size
    }
  })
}
// 异常记录
export function getExceptions (data) {
  return request({
    url: 'app-service/users/exceptions',
    method: 'get',
    params: {
      page: data.page,
      size: data.size
    }
  })
}

export function createGroupLeader (data) {
  return request({
    url: 'app-service/groupLeader',
    method: 'post',
    data: data
  })
}

export function removeGroupLeader (userId) {
  return request({
    url: 'app-service/groupLeader',
    method: 'delete',
    params: {
      userId: userId
    }
  })
}
export function getCompanyList () {
  return request({
    url: 'app-service/departments/company',
    method: 'get'

  })
}
export function getDepartmentList (data) {
  return request({
    url: 'app-service/departments/list',
    method: 'get',
    params: {
      companyCode: data.companyCode
    }
  })
}
// 新增
export function addDepartment (data) {
  return request({
    url: 'app-service/departments/save',
    method: 'post',
    data: data
  })
}
// 修改
export function modifyDepartment (data) {
  return request({
    url: 'app-service/departments/save',
    method: 'post',
    data: data
  })
}
// 删除

export function deleteDepartment (code) {
  return request({
    url: 'app-service/departments',
    method: 'delete',
    params: {
      code: code
    }
  })
}
export function setUserDepartment (data) {
  return request({
    url: 'app-service/users/setDepartment',
    method: 'post',
    data: data
  })
}
export function departmentSubscribe (data) {
  return request({
    url: 'app-service/departmentsSubscribe/subscribe',
    method: 'post',
    data: data
  })
}
export function departmentRemoveSubscribe (data) {
  return request({
    url: 'app-service/departmentsSubscribe/removeSubscribe',
    method: 'post',
    data: data
  })
}
export function getSubscribeDepartment (userId) {
  return request({
    url: 'app-service/departments/subscribe',
    method: 'get',
    params: {
      userId: userId
    }
  })
}
// 员工注销
export function deleteUsers (userId) {
  return request({
    url: 'app-service/users',
    method: 'delete',
    params: {
      userId: userId
    }
  })
}
