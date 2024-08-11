import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/Login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 控制台
  {
    path: '/',
    component: Layout,
    redirect: '/Dashboard',
    children: [
      {
        path: 'Dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index'),
        meta: { title: '控制台', icon: 'dashboard', auth: true }
      }
    ]
  },
  // 首页管理
  {
    path: '/HomeManager',
    component: Layout,
    redirect: '/HomeManager',
    children: [
      {
        path: 'HomeManager',
        name: 'HomeManager',
        component: () => import('@/views/HomeManager/index'),
        meta: { title: '首页管理', icon: 'el-icon-s-home', auth: true }
      }
    ]
  },
  // 博客
  {
    path: '/Blog',
    component: Layout,
    redirect: '/Blog/BlogList',
    name: 'Blog',
    meta: {
      title: '博客',
      icon: 'el-icon-reading'
    },
    children: [
      {
        path: 'BlogList',
        component: () => import('@/views/Blog/BlogList/index'), // Parent router-view
        name: 'BlogList',
        meta: { title: '博客列表', icon: 'el-icon-s-grid', auth: true }
      },
      {
        path: 'BlogType',
        component: () => import('@/views/Blog/BlogType/index'), // Parent router-view
        name: 'BlogType',
        meta: { title: '博客分类', icon: 'el-icon-menu', auth: true }
      },
      {
        path: 'BlogIncrease',
        component: () => import('@/views/Blog/BlogIncrease/index'), // Parent router-view
        name: 'BlogIncrease',
        meta: { title: '添加博客', icon: 'el-icon-circle-plus-outline', auth: true }
      }
    ]
  },
  // 评论管理
  {
    path: '/CommentManager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'CommentManager',
        component: () => import('@/views/CommentManager/index'),
        meta: { title: '评论管理', icon: 'el-icon-chat-line-square', auth: true }
      }
    ]
  },
  // 项目展示
  {
    path: '/Project',
    component: Layout,
    redirect: '/Project/ProjectList',
    name: 'Project',
    meta: { title: '项目管理', icon: 'el-icon-data-line', auth: true },
    children: [
      {
        path: 'ProjectList',
        name: 'ProjectList',
        component: () => import('@/views/Project/ProjectList'),
        meta: { title: '项目列表', icon: 'table', auth: true }
      },
      {
        path: 'ProjectIncrease',
        name: 'ProjectIncrease',
        component: () => import('@/views/Project/ProjectIncrease'),
        meta: { title: '添加项目', icon: 'el-icon-circle-plus-outline', auth: true }
      }
    ]
  },

  // 留言板
  {
    path: '/LeaveWords',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'LeaveWords',
        component: () => import('@/views/LeaveWords/index'),
        meta: { title: '留言板', icon: 'el-icon-chat-dot-round', auth: true }
      }
    ]
  },
  // 关于我
  {
    path: '/About',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'About',
        component: () => import('@/views/About/index'),
        meta: { title: '关于我', icon: 'el-icon-info', auth: true }
      }
    ]
  },
  // 设置
  {
    path: '/Setting',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Setting',
        component: () => import('@/views/Setting/index'),
        meta: { title: '设置', icon: 'el-icon-s-tools', auth: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
