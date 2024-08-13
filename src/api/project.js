import request from '@/utils/request'

// 获取所有项目
export function getProjects() {
  return request({
    url: '/api/project',
    method: 'get'
  })
}

// 删除项目
export function deleteProject(id) {
  return request({
    url: `/api/project/${id}`,
    method: 'delete'
  })
}

// 修改项目
export function editProject(data) {
  return request({
    url: `/api/project/${data.id}`,
    method: 'put',
    data
  })
}

// 添加项目
export function addProject(data) {
  return request({
    url: '/api/project',
    method: 'post',
    data
  })
}
