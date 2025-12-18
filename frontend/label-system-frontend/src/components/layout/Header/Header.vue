<template>
  <header class="app-header">
    <div class="app-header__left">
      <h1 class="app-header__title">
        <i class="el-icon-printer"></i>
        标签打印系统
      </h1>
    </div>
    
    <div class="app-header__center">
      <div class="app-header__nav">
        <button class="app-header__nav-btn" :class="{active: activeNav === 'home'}" @click="navigate('home')">
          <i class="el-icon-house"></i>
          <span>首页</span>
        </button>
        <button class="app-header__nav-btn" :class="{active: activeNav === 'templates'}" @click="navigate('templates')">
          <i class="el-icon-document"></i>
          <span>标签模板</span>
        </button>
        <button class="app-header__nav-btn" :class="{active: activeNav === 'print'}" @click="navigate('print')">
          <i class="el-icon-printer"></i>
          <span>打印任务</span>
        </button>
        <button class="app-header__nav-btn" :class="{active: activeNav === 'devices'}" @click="navigate('devices')">
          <i class="el-icon-cpu"></i>
          <span>设备管理</span>
        </button>
        <button class="app-header__nav-btn" :class="{active: activeNav === 'statistics'}" @click="navigate('statistics')">
          <i class="el-icon-data-analysis"></i>
          <span>统计报表</span>
        </button>
      </div>
    </div>
    
    <div class="app-header__right">
      <div class="app-header__user">
        <div class="app-header__user-avatar">
          <i class="el-icon-user"></i>
        </div>
        <div class="app-header__user-info">
          <span class="app-header__user-name">管理员</span>
          <span class="app-header__user-role">系统管理员</span>
        </div>
        <button class="app-header__user-menu">
          <i class="el-icon-arrow-down"></i>
        </button>
      </div>
      
      <button class="app-header__action" title="系统设置">
        <i class="el-icon-setting"></i>
      </button>
      <button class="app-header__action" title="通知中心">
        <i class="el-icon-bell"></i>
        <span class="app-header__badge">3</span>
      </button>
      <button class="app-header__action" title="帮助">
        <i class="el-icon-question"></i>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeNav = ref('home')

const navigate = (route: string) => {
  activeNav.value = route
  // 这里可以添加路由跳转逻辑
  console.log('导航到:', route)
}
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e4e7ed;
  z-index: 1000;
  
  &__left {
    flex: 0 0 auto;
  }
  
  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #409eff;
    
    i {
      font-size: 20px;
    }
  }
  
  &__center {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  
  &__nav {
    display: flex;
    gap: 4px;
    background-color: #f5f7fa;
    border-radius: 6px;
    padding: 4px;
    
    &-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 14px;
      color: #606266;
      background: none;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background-color: #e4e7ed;
        color: #303133;
      }
      
      &.active {
        background-color: #409eff;
        color: #ffffff;
        
        &:hover {
          background-color: #337ecc;
        }
      }
      
      i {
        font-size: 16px;
      }
    }
  }
  
  &__right {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  &__user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background-color: #f5f7fa;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #e4e7ed;
    }
    
    &-avatar {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #409eff;
      color: #ffffff;
      border-radius: 50%;
      
      i {
        font-size: 18px;
      }
    }
    
    &-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    &-name {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }
    
    &-role {
      font-size: 12px;
      color: #909399;
    }
    
    &-menu {
      background: none;
      border: none;
      color: #c0c4cc;
      cursor: pointer;
      padding: 0;
      
      &:hover {
        color: #909399;
      }
    }
  }
  
  &__action {
    position: relative;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: 50%;
    color: #606266;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background-color: #f5f7fa;
      color: #303133;
    }
    
    i {
      font-size: 18px;
    }
  }
  
  &__badge {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
    background-color: #f56c6c;
    color: #ffffff;
    border-radius: 8px;
  }
}
</style>
