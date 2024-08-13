import request from '@/utils/request'

// 获取URL
export function getGlobalSetting() {
  return request({
    url: '/api/setting',
    method: 'get'
  })
}

// 设置URL
export function setGlobalSetting(data) {
  return request({
    url: '/api/setting',
    method: 'put',
    data
  })
}
