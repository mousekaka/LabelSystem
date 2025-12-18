import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// 直接导入组件库
import LabelUI from './components'

// 创建Vue应用实例
const app = createApp(App)

// 注册路由
app.use(router)

// 注册组件库
app.use(LabelUI)

// 调试信息
console.log('🚀 Vue应用已创建')
console.log('📦 路由已注册:', !!router)
console.log('🎨 组件库已注册')

// 挂载应用
app.mount('#app')
