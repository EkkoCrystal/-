import request from '@/utils/request'

export function bigscreenData () {
  return request({
    url: '/app-service/v1/monitor/',
    method: 'get'
  })
}

