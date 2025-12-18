// 路由调试工具 - 在浏览器控制台运行
const routerDebug = {
  checkRouterInstance: () => {
    console.log('=== 路由实例检查 ===')
    console.log('1. Vue Router实例:', window.__VUE_ROUTER__ ? '✅ 存在' : '❌ 不存在')
    
    try {
      const router = window.__VUE_ROUTER__
      if (router) {
        console.log('2. 当前路由:', router.currentRoute.value)
        console.log('3. 注册的路由:', router.getRoutes())
        console.log('4. 历史记录长度:', window.history.length)
        return true
      }
    } catch (error) {
      console.error('检查失败:', error)
    }
    return false
  },
  
  navigateTo: (path) => {
    console.log(`导航到: ${path}`)
    if (window.__VUE_ROUTER__) {
      window.__VUE_ROUTER__.push(path)
    } else {
      window.location.href = path
    }
  },
  
  testAllRoutes: () => {
    const routes = [
      '/acceptance-test',
      '/component-demo', 
      '/label-editor',
      '/print-queue',
      '/device-status',
      '/data-chart',
      '/router-debug',
      '/not-exist-404'
    ]
    
    console.log('=== 路由测试 ===')
    routes.forEach(route => {
      console.log(`测试: ${route}`)
      // 这里可以添加实际的导航测试
    })
  }
}

// 暴露到全局
window.routerDebug = routerDebug
console.log('🚀 路由调试工具已加载，使用 routerDebug.xxx() 进行测试')
