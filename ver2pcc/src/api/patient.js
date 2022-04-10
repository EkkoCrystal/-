import request from '@/utils/request'

export function findPatient (form) {
  return request({
    url: '/app-service/v1/patients/hospitalizedPatients',
    method: 'get',
    params: {
      queryCondition: form.queryCondition,
      departmentCode: form.departmentCode,
      doctorCode: form.doctorCode,
      hospitalizationNum: form.hospitalizationNum,
      page: form.page,
      size: form.size
    }

  })
}

export function getPatient (id) {
  return request({
    url: '/app-service/v1/patients/hospitalizedPatient',
    method: 'get',
    params: {
      patientId: id
    }

  })
}

export function createPatient (patient) {
  return request({
    url: '/app-service/v1/patients/applyHospitalization',
    method: 'post',
    data: patient

  })
}

export function patientStatistics (queryCondition) {
  return request({
    url: '/app-service/v1/statistics/testCount',
    method: 'get',
    params: {
      beginDate: queryCondition.beginDate,
      endDate: queryCondition.endDate,
      departmentCode: queryCondition.departmentCode,
      hospitalizedType: queryCondition.hospitalizedType,
      queryCondition: queryCondition.queryCondition,
      page: queryCondition.page,
      size: queryCondition.size

    }

  })
}

export function queryOutPatient (queryCondition) {
  return request({
    url: '/app-service/v1/patients/dischargedPatients',
    method: 'get',
    params: {

      queryCondition: queryCondition.queryCondition,
      page: queryCondition.page,
      size: queryCondition.size

    }

  })
}

export function patientDischarge (patientId) {
  return request({
    url: '/app-service/v1/patients/discharge',
    method: 'post',
    params: {

      patientId: patientId
    }

  })
}

export function updatePatient (patient) {
  return request({
    url: '/app-service/v1/patients',
    method: 'put',
    data: patient

  })
}

export function reApplyHospitalization (patient) {
  return request({
    url: '/app-service/v1/patients/reApplyHospitalization/' + patient.id,
    method: 'post',
    data: patient

  })
}

export function createConsultation (consultation) {
  return request({
    url: '/app-service/v1/consultations',
    method: 'post',
    data: consultation
  })
}

export function queryConsultation (queryCondition) {
  return request({
    url: '/app-service/v1/consultations/query/',
    method: 'get',
    params: {
      beginDate: queryCondition.beginDate,
      endDate: queryCondition.endDate,
      consultationDepartmentCode: queryCondition.consultationDepartmentCode,
      consultationDoctorCode: queryCondition.consultationDoctorCode,
      requestDepartmentCode: queryCondition.requestDepartmentCode,
      requestDoctorCode: queryCondition.requestDoctorCode,
      queryCondition: queryCondition.queryCondition,
      isFinished: queryCondition.isFinished,
      page: queryCondition.page,
      size: queryCondition.size
    }
  })
}
export function queryPatientConsultation (queryCondition) {
  return request({
    url: '/app-service/v1/consultations/list',
    method: 'get',
    params: {
      beginDate: queryCondition.beginDate,
      endDate: queryCondition.endDate,
      isFinished: queryCondition.isFinished,
      patientId: queryCondition.patientId,
      page: queryCondition.page,
      size: queryCondition.size
    }
  })
}

export function filterConsultation (data) {
  return request({
    url: '/app-service/v1/consultations/queryPatient',
    method: 'get',
    params: {
      departmentCode: data.departmentCode,
      queryCondition: data.queryCondition,
      beforeBreakfast: data.beforeBreakfast,
      afterGlu: data.afterGlu,
      randomGlu: data.randomGlu,
      allGluMaxValue: data.allGluMaxValue,
      ketValue: data.ketValue,
      uaValue: data.uaValue
    }
  })
}

export function queryConsultationLogs (id) {
  return request({
    url: '/app-service/v1/consultations/logs',
    method: 'get',
    params: {
      consultationId: id
    }
  })
}
export function addConsultation (data) {
  return request({
    url: '/app-service/v1/consultations/logs',
    method: 'post',
    data: data
  })
}
export function finishConsultation (id) {
  return request({
    url: '/app-service/v1/consultations/finish',
    method: 'post',
    params: {
      consultationId: id
    }

  })
}

export function createDrugAdvice (advice) {
  return request({
    url: '/app-service/v1/medicationAdvice',
    method: 'post',
    data: advice
  })
}

export function stopDrugAdvice (adviceId) {
  return request({
    url: '/app-service/v1/medicationAdvice/suspend',
    method: 'put',
    params: {
      adviceId: adviceId
    }
  })
}

export function queryDrugAdvice (data) {
  return request({
    url: '/app-service/v1/medicationAdvice/page',
    method: 'get',
    params: {
      adviceName: data.adviceName,
      patientId: data.patientId,
      page: data.page,
      size: data.size

    }
  })
}

export function createMedicationCategory (data) {
  return request({
    url: '/app-service/v1/medicationCategory',
    method: 'post',
    data: data

  })
}

export function updateMedicationCategory (data) {
  return request({
    url: '/app-service/v1/medicationCategory',
    method: 'put',
    data: data
  })
}

export function deleteMedicationCategory (code) {
  return request({
    url: '/app-service/v1/medicationCategory',
    method: 'delete',
    params: {
      code: code
    }
  })
}

export function getMedicationCategories () {
  return request({
    url: '/app-service/v1/medicationCategory/list',
    method: 'get'

  })
}

export function createMedication (data) {
  return request({
    url: '/app-service/v1/medication',
    method: 'post',
    data: data

  })
}

export function updateMedication (data) {
  return request({
    url: '/app-service/v1/medication',
    method: 'put',
    data: data
  })
}

export function deleteMedication (medicationId) {
  return request({
    url: '/app-service/v1/medication/' + medicationId,
    method: 'delete'

  })
}

export function queryMedication (queryCondition) {
  return request({
    url: '/app-service/v1/medication/page',
    method: 'get',
    params: {
      categoryCode: queryCondition.categoryCode,
      queryCondition: queryCondition.queryCondition,
      page: queryCondition.page,
      size: queryCondition.size
    }

  })
}

export function queryUnit () {
  return request({
    url: '/app-service/v1/units/list',
    method: 'get'

  })
}

export function createUnit (data) {
  return request({
    url: '/app-service/v1/units/save',
    method: 'post',
    data: data

  })
}

export function deleteUnit (id) {
  return request({
    url: '/app-service/v1/units/' + id,
    method: 'delete'

  })
}

export function createInsulinTimePeriod (data) {
  return request({
    url: '/app-service/v1/insulinTimePeriod',
    method: 'post',
    data: data

  })
}
export function updateInsulinTimePeriod (data) {
  return request({
    url: '/app-service/v1/insulinTimePeriod',
    method: 'put',
    data: data

  })
}
export function deleteInsulinTimePeriod (code) {
  return request({
    url: '/app-service/v1/insulinTimePeriod',
    method: 'delete',
    params: {
      code: code
    }

  })
}
export function getInsulinTimePeriodList () {
  return request({
    url: '/app-service/v1/insulinTimePeriod/list',
    method: 'get'

  })
}
export function getGluPeriodList () {
  return request({
    url: '/app-service/v1/gluPeriod/list',
    method: 'get'

  })
}
export function updateGluPeriod (data) {
  return request({
    url: '/app-service/v1/gluPeriod',
    method: 'put',
    data: data

  })
}

// 本日危机值监控
export function findCrisisValue (form) {
  return request({
    url: '/app-service/v1/crisisPatient/monitor',
    method: 'get',
    params: {
      queryCondition: form.queryCondition,
      departmentCode: form.departmentCode,
      doctorCode: form.doctorCode
    }
  })
}

// 患者测量任务接口
export function queryTodayTask (queryCondition) {
  return request({
    url: '/app-service/v1/tasks/todayTask',
    method: 'get',
    params: {
      departmentCode: queryCondition.departmentCode,
      queryCondition: queryCondition.queryCondition,
      page: queryCondition.page,
      size: queryCondition.size
    }
  })
}
