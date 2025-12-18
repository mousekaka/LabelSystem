import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 应用状态
  const sidebarCollapsed = ref(false)
  const loading = ref(false)
  const theme = ref<'light' | 'dark'>('light')
  
  // 应用配置
  const config = ref({
    title: '标签打印系统',
    version: '1.0.0',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api'
  })

  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 设置加载状态
  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  // 初始化应用
  const initializeApp = () => {
    // 从localStorage恢复主题设置
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      theme.value = savedTheme
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }

  return {
    // 状态
    sidebarCollapsed,
    loading,
    theme,
    config,
    
    // 方法
    toggleSidebar,
    setLoading,
    toggleTheme,
    initializeApp
  }
})
