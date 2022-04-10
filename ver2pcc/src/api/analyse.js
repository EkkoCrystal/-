import request from '@/utils/request'

// 血糖统计
export function gluYearAnalysisData (condition) {
  return request({
    url: '/app-service/v1/statistics/gluYearAnalysis',
    method: 'get',
    params: {
      departmentCode: condition.departmentCode,
      year: condition.begDate
    }

  })
}

// 导出接口
export function exportBlgData (condition) {
  return request({
    url: '/app-service/v1/statistics/gluYearAnalysisExcel',
    method: 'get',
    params: {
      departmentCode: condition.departmentCode,
      year: condition.begDate
    }

  })
}
