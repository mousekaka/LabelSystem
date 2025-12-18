import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: string
  username: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string>('')

  // 是否已登录
  const isLoggedIn = computed(() => !!currentUser.value && !!token.value)

  // 登录
  const login = async (username: string, password: string) => {
    // 这里调用实际的登录API
    const response = { 
      user: { 
        id: '1', 
        username, 
        name: '管理员', 
        email: 'admin@example.com',
        roles: ['admin'],
        permissions: ['*']
      }, 
      token: 'mock-token' 
    }
    
    currentUser.value = response.user
    token.value = response.token
    localStorage.setItem('token', response.token)
    
    return response
  }

  // 登出
  const logout = () => {
    currentUser.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  // 初始化用户状态
  const initializeUser = () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      // 这里可以调用API验证token并获取用户信息
    }
  }

  return {
    currentUser,
    token,
    isLoggedIn,
    login,
    logout,
    initializeUser
  }
})
