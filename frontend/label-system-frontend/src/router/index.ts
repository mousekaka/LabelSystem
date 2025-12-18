// src/router/index.ts - 重新创建确保语法正确
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 定义路由数组
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/acceptance-test'
  },
  {
    path: '/acceptance-test',
    name: 'AcceptanceTest',
    component: () => import('../views/AcceptanceTest.vue'),
    meta: { title: '验收测试' }
  },
  {
    path: '/component-demo',
    name: 'ComponentDemo',
    component: () => import('../views/ComponentDemo.vue'),
    meta: { title: '组件演示' }
  },
  {
    path: '/label-editor',
    name: 'LabelEditor',
    component: () => import('../components/business/LabelEditor/LabelEditor.vue'),
    meta: { title: '标签编辑器' }
  },
  {
    path: '/print-queue',
    name: 'PrintQueue',
    component: () => import('../components/business/PrintQueue/PrintQueue.vue'),
    meta: { title: '打印队列' }
  },
  {
    path: '/device-status',
    name: 'DeviceStatus',
    component: () => import('../components/business/DeviceStatus/DeviceStatus.vue'),
    meta: { title: '设备状态' }
  },
  {
    path: '/data-chart',
    name: 'DataChart',
    component: () => import('../components/business/DataChart/DataChart.vue'),
    meta: { title: '数据图表' }
  },
  {
    path: '/router-debug',
    name: 'RouterDebug',
    component: () => import('../views/RouterDebug.vue'),
    meta: { title: '路由调试' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '页面未找到' }
  }
]

// 创建路由器实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由调试日志
router.beforeEach((to, from, next) => {
  console.log('🔗 路由跳转:', {
    from: from.path,
    to: to.path,
    name: to.name,
    fullPath: to.fullPath
  })
  next()
})

router.afterEach((to) => {
  console.log('✅ 路由完成:', to.path)
})

export default router




