import request from '@/utils/request'

export function queryTestDataByPivot (condition) {
  return request({
    url: '/app-service/v1/testRecord/glus/pivot/query',
    method: 'get',
    params: {
      queryCondition: condition.queryCondition,
      beginDate: condition.beginDate,
      endDate: condition.endDate,
      departmentCode: condition.departmentCode,
      doctorCode: condition.doctorCode,
      page: condition.page,
      size: condition.size

    }

  })
}
export function queryTestDataByPivotAndPatient (id, condition) {
  return request({
    url: '/app-service/v1/testRecord/patient/pivot/' + id,
    method: 'get',
    params: {

      beginDate: condition.beginDate,
      endDate: condition.endDate,

      page: condition.page,
      size: condition.size

    }

  })
}

export function queryTestData (condition) {
  return request({
    url: '/app-service/v1/testRecord/query',
    method: 'get',
    params: {
      queryCondition: condition.queryCondition,
      category: condition.category,
      beginDate: condition.beginDate,
      endDate: condition.endDate,
      departmentCode: condition.departmentCode,
      doctorCode: condition.doctorCode,
      page: condition.page,
      size: condition.size

    }

  })
}

export function queryTestDataByPatient (id, condition) {
  return request({
    url: '/app-service/v1/testRecord/patient/' + id,
    method: 'get',
    params: {

      beginDate: condition.beginDate,
      endDate: condition.endDate,
      category: condition.category,

      page: condition.page,
      size: condition.size

    }

  })
}

export function bloodGlucoseReport (id, beginDate, endDate) {
  return request({
    url: '/app-service/v1/gluDataAnalysis/bloodGlucoseReport',
    method: 'get',
    params: {
      patientId: id,

      beginDate: beginDate,
      endDate: endDate

    }

  })
}

export function bloodGlucoseTrend (id, periods, beginDate, endDate) {
  return request({
    url: '/app-service/v1/gluDataAnalysis/bloodGlucoseTrend',
    method: 'get',
    params: {
      patientId: id,
      periods: periods,

      beginDate: beginDate,
      endDate: endDate

    }

  })
}

export function dataTrend (condition) {
  return request({
    url: '/app-service/v1/gluDataAnalysis/testTrend',
    method: 'get',
    params: {
      patientId: condition.patientId,

      beginDate: condition.beginDate,
      endDate: condition.endDate,
      category: condition.category

    }

  })
}

export function bloodGlucoseMap (id, beginDate, endDate) {
  return request({
    url: '/app-service/v1/gluDataAnalysis/bloodGlucoseMap',
    method: 'get',
    params: {
      patientId: id,

      beginDate: beginDate,
      endDate: endDate

    }

  })
}

export function bloodGlucoseFluctuation (id, beginDate, endDate) {
  return request({
    url: '/app-service/v1/gluDataAnalysis/bloodGlucoseFluctuation',
    method: 'get',
    params: {
      patientId: id,

      beginDate: beginDate,
      endDate: endDate

    }

  })
}
export function criticalWarningQuery (condition) {
  return request({
    url: '/app-service/v1/crisisPatient/query',
    method: 'get',
    params: {
      queryCondition: condition.queryCondition,
      departmentCode: condition.departmentCode,
      category: condition.category,
      beginDate: condition.beginDate,
      endDate: condition.endDate,
      doctorCode: condition.doctorCode,
      maxValue: condition.maxValue,
      minValue: condition.minValue,
      page: condition.page,
      size: condition.size

    }

  })
}

export function queryProfileRange (id) {
  return request({
    url: '/app-service/v1/testItem/patientProfiles/' + id,
    method: 'get'

  })
}

export function saveProfileRange (profile) {
  return request({
    url: '/app-service/v1/testItem/patientProfiles/gluRange',
    method: 'post',
    data: profile

  })
}

export function testResultChangeStatus (recordId, actived) {
  return request({
    url: '/app-service/v1/testRecord/changeStatus',
    method: 'put',
    params: {
      recordId: recordId,
      isActive: actived
    }

  })
}

export function getPeriodOptions (t) {
  return request({
    url: '/app-service/v1/options',
    method: 'get',
    params: {
      adviceType: t
    }

  })
}
export function getRejectReason () {
  return request({
    url: '/app-service/v1/dict/unTestReason',
    method: 'get'

  })
}

export function createTestResult (data) {
  return request({
    url: '/app-service/v1/testRecord/customerRecord',
    method: 'post',
    data: data

  })
}

export function updateTestResult (data) {
  return request({
    url: '/app-service/v1/testRecord',
    method: 'put',
    data: data

  })
}

export function getTestItems () {
  return request({
    url: '/app-service/v1/testItem/categories',
    method: 'get'

  })
}

// 测试条类型
export function getCategoryStripTypesItems (category) {
  return request({
    url: '/app-service/v1/testStrip/categoryStripTypes',
    method: 'get',
    params: {
      category: category
    }
  })
}

// 根据项目类型加载测试条类型
export function getStripTypesItems () {
  return request({
    url: '/app-service/v1/testStrip/stripTypes',
    method: 'get'

  })
}
