import request from '@/utils/request'

// 获取URL
export function getAboutUrl() {
  return request({
    url: '/api/about',
    method: 'get'
  })
}

// 设置URL
export function setAboutUrl(url) {
  return request.post('/api/about', { url })
}
