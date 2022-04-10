import request from '@/utils/request'

export function deviceQuery (queryCondition) {
  return request({
    url: '/app-service/v2/devices/query',
    method: 'get',
    params: {
      departmentCode: queryCondition.departmentCode,
      deviceModel: queryCondition.deviceModel,
      manufactor: queryCondition.manufactor,
      sn: queryCondition.sn,

      size: queryCondition.size,
      page: queryCondition.page,

      status: queryCondition.status
    }

  })
}

export function qcQuery (queryCondition) {
  return request({
    url: '/app-service/v1/deviceQc/query',
    method: 'get',
    params: {
      departmentCode: queryCondition.departmentCode,
      beginDate: queryCondition.beginDate,
      endDate: queryCondition.endDate,
      itemCategory: queryCondition.itemCategory,
      size: queryCondition.size,
      page: queryCondition.page,
      sn: queryCondition.sn,
      status: queryCondition.status
    }

  })
}
export function qcSave (data) {
  return request({
    url: '/app-service/v1/deviceQc',
    method: 'post',
    data: data

  })
}
export function qcUpdate (data) {
  return request({
    url: '/app-service/v1/deviceQc',
    method: 'put',
    data: data

  })
}

export function qcMonthReport (queryCondition) {
  return request({
    url: '/app-service/v1/deviceQc/monthReport',
    method: 'get',
    params: {

      month: queryCondition.month,
      itemCategory: queryCondition.itemCategory,

      sn: queryCondition.sn

    }

  })
}

export function ljReport (queryCondition) {
  return request({
    url: '/app-service/v2/deviceQc/control',
    method: 'get',
    params: {
      month: queryCondition.month,
      itemCategory: queryCondition.itemCategory,
      sn: queryCondition.sn
    }
  })
}

export function getManufacturer () {
  return request({
    url: '/app-service/v1/dict/manufacturers/list',
    method: 'get'

  })
}

export function queryQualityReagent (queryCondition) {
  return request({
    url: '/app-service/v1/qualityReagent/page',
    method: 'get',
    params: {
      category: queryCondition.category,
      isExpired: queryCondition.isExpired,
      lotNum: queryCondition.lotNum,
      manufactor: queryCondition.manufactor,
      page: queryCondition.page,
      size: queryCondition.size
    }

  })
}

export function queryTestStrip (queryCondition) {
  return request({
    url: '/app-service/v1/testStrip/page',
    method: 'get',
    params: {
      category: queryCondition.category,
      isExpired: queryCondition.isExpired,
      lotNum: queryCondition.lotNum,
      manufactor: queryCondition.manufactor,
      page: queryCondition.page,
      size: queryCondition.size
    }

  })
}

export function qcControlStatistics (queryCondition) {
  return request({
    url: '/app-service/v1/deviceQc/departmentControlStatistics',
    method: 'get',
    params: {
      beginDate: queryCondition.beginDate,
      endDate: queryCondition.endDate,
      departmentCode: queryCondition.departmentCode,
      page: queryCondition.page,
      size: queryCondition.size
    }

  })
}

export function getWestGuardRules () {
  return request({
    url: '/app-service/v1/controlSetting',
    method: 'get'

  })
}

export function saveWestGuardRules (rules) {
  return request({
    url: '/app-service/v1/controlSetting',
    method: 'post',
    data: rules

  })
}

export function createStrip (data) {
  return request({
    url: '/app-service/v1/testStrip',
    method: 'post',
    data: data

  })
}
export function deleteStrip (stripId) {
  return request({
    url: '/app-service/v1/testStrip',
    method: 'delete',
    params: {
      stripId: stripId
    }

  })
}

export function createQualityReagent (data) {
  return request({
    url: '/app-service/v1/qualityReagent',
    method: 'post',
    data: data

  })
}
export function deleteQualityReagent (id) {
  return request({
    url: '/app-service/v1/qualityReagent',
    method: 'delete',
    params: {

      qualityReagentId: id
    }

  })
}
export function createInstrument (data) {
  return request({
    url: '/app-service/v1/devices',
    method: 'post',
    data: data

  })
}
export function updateInstrument (data) {
  return request({
    url: '/app-service/v1/devices',
    method: 'put',
    data: data

  })
}

export function getAvailableTestStrips (data) {
  return request({
    url: '/app-service/v1/testStrip/deviceStrips',
    method: 'get',
    params: {
      category: data.category,
      sn: data.sn
    }

  })
}

export function getAvailableQualityReagents (data) {
  return request({
    url: '/app-service/v1/qualityReagent/deviceQualityReagents',
    method: 'get',
    params: {
      category: data.category,
      sn: data.sn

    }

  })
}
export function getQualityReagentTypes () {
  return request({
    url: '/app-service/v1/dict/qualityReagentTypes',
    method: 'get'

  })
}

export function getDeviceStatusTypes () {
  return request({
    url: '/app-service/v1/devices/statusTypes',
    method: 'get'

  })
}

