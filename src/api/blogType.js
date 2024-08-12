import request from '@/utils/request'

// 添加博客分类
export function addBlogCategory(data) {
  return request({
    url: '/api/blogtype',
    method: 'post',
    data
  })
}

// 删除博客分类
export function deleteBlogCategory(categoryId) {
  return request({
    url: `/api/blogtype/${categoryId}`,
    method: 'delete'
  })
}

// 修改博客分类
export function changeBlogCategory(blogInfo) {
  return request({
    url: `/api/blogtype/${blogInfo.categoryId}`,
    method: 'put',
    data: blogInfo.data
  })
}

// 获取一个分类
export function getOneBlogCategory(blogId) {
  return request({
    url: `/api/blogtype/${blogId}`,
    method: 'get'
  })
}

// 获取文章分类
export function getBlogCategories() {
  return request({
    url: `/api/blogtype`,
    method: 'get'
  })
}
