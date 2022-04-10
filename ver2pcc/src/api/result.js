import request from '@/utils/request'

export function countTest (token) {
  return request({
    url: '/wolfpups/result/countTest',
    method: 'get',
    params: {
      access_token: token

    }

  })
}

