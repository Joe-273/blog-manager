import request from '@/utils/request'

// 分页获取文章
export function getBlogByPager(page = 1, limit = 10) {
  return request({
    url: '/api/blog',
    method: 'get',
    params: {
      page,
      limit
    }
  })
}

// 删除文章
export function deleteBlogByPager(blogId) {
  return request({
    url: `/api/blog/${blogId}`,
    method: 'delete'
  })
}
