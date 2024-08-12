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

// 发布文章
export function addBlog(data) {
  return request({
    url: '/api/blog',
    method: 'post',
    data
  })
}

// 编辑文章
export function editBlog(blogInfo) {
  return request({
    url: `/api/blog/${blogInfo.id}`,
    method: 'put',
    data: blogInfo.data
  })
}

// 根据ID查找文章
export function getOneBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'get'
  })
}
