import request from '@/utils/request'

export function queryTemplate (condition) {
  return request({
    url: '/app-service/v1/templates/query',
    method: 'get',
    params: {
      adviceType: condition.adviceType,
      isActive: condition.isActive,
      page: condition.page,
      size: condition.size,
      templateName: condition.templateName
    }

  })
}

export function getTemplateTypes () {
  return request({
    url: '/app-service/v1/templates/adviceTemplateTypes',
    method: 'get'
  })
}

export function getPatientAdviceTypes () {
  return request({
    url: '/app-service/v1/patientAdvice/adviceTypes',
    method: 'get'
  })
}

// LongStandards, LongNotStandards, Temporary
export function getTemplateList (t) {
  return request({
    url: '/app-service/v1/templates/list',
    method: 'get',
    params: {
      adviceType: t
    }
  })
}

export function createTemplate (data) {
  return request({
    url: '/app-service/v1/templates',
    method: 'post',
    data: data
  })
}

export function updateTemplate (data) {
  return request({
    url: '/app-service/v1/templates',
    method: 'put',
    data: data
  })
}
export function deleteTemplate (id) {
  return request({
    url: '/app-service/v1/templates/' + id,
    method: 'delete'

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
export function getPatientAdviceById (data) {
  return request({
    url: '/app-service/v1/patientAdvice',
    method: 'get',
    params: {
      adviceId: data
    }

  })
}
export function createPatientAdvice (data) {
  return request({
    url: '/app-service/v1/patientAdvice',
    method: 'post',
    data: data

  })
}
export function getPatientAdviceList (data) {
  return request({
    url: '/app-service/v1/patientAdvice/list',
    method: 'get',
    params: {
      category: data.category,
      patientId: data.patientId,
      adviceName: data.adviceName,
      page: data.page,
      size: data.size

    }

  })
}
export function suspendPatientAdvice (data) {
  return request({
    url: '/app-service/v1/patientAdvice/suspend',
    method: 'put',
    params: {
      adviceId: data
    }

  })
}
export function getTodayJobCount (data) {
  return request({
    url: '/app-service/v1/tasks/todayTaskNums',
    method: 'get',
    params: {
      departmentCode: data.departmentCode,
      doctorCode: data.doctorCode,
      queryCondition: data.queryCondition
    }

  })
}
