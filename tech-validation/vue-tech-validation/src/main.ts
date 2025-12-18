import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

// 创建 Vue 应用实例
const app = createApp(App)

// 创建 Pinia 实例并安装
const pinia = createPinia()
app.use(pinia)

// 安装路由
app.use(router)

// 安装 Element Plus
app.use(ElementPlus)

// 挂载应用
app.mount('#app')

console.log('Vue应用已启动，Pinia已安装')
