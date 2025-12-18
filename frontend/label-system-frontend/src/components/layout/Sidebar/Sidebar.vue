<template>
  <aside class="app-sidebar">
    <div class="app-sidebar__header">
      <h3 class="app-sidebar__title">
        <i class="el-icon-menu"></i>
        功能菜单
      </h3>
      <button class="app-sidebar__toggle" @click="toggleCollapse">
        <i :class="isCollapsed ? 'el-icon-expand' : 'el-icon-fold'"></i>
      </button>
    </div>
    
    <div class="app-sidebar__content">
      <nav class="app-sidebar__nav">
        <!-- 模板管理 -->
        <div class="app-sidebar__group">
          <div class="app-sidebar__group-title" @click="toggleGroup('templates')">
            <i class="el-icon-document"></i>
            <span v-if="!isCollapsed">模板管理</span>
            <i class="app-sidebar__group-arrow" :class="{'is-expanded': expandedGroups.templates}"></i>
          </div>
          
          <div v-if="expandedGroups.templates || isCollapsed" class="app-sidebar__group-items">
            <router-link to="/templates/list" class="app-sidebar__item" active-class="active">
              <i class="el-icon-tickets"></i>
              <span v-if="!isCollapsed">模板列表</span>
            </router-link>
            <router-link to="/templates/create" class="app-sidebar__item" active-class="active">
              <i class="el-icon-circle-plus"></i>
              <span v-if="!isCollapsed">新建模板</span>
            </router-link>
            <router-link to="/templates/categories" class="app-sidebar__item" active-class="active">
              <i class="el-icon-folder"></i>
              <span v-if="!isCollapsed">分类管理</span>
            </router-link>
          </div>
        </div>
        
        <!-- 打印任务 -->
        <div class="app-sidebar__group">
          <div class="app-sidebar__group-title" @click="toggleGroup('print')">
            <i class="el-icon-printer"></i>
            <span v-if="!isCollapsed">打印任务</span>
            <i class="app-sidebar__group-arrow" :class="{'is-expanded': expandedGroups.print}"></i>
          </div>
          
          <div v-if="expandedGroups.print || isCollapsed" class="app-sidebar__group-items">
            <router-link to="/print/queue" class="app-sidebar__item" active-class="active">
              <i class="el-icon-time"></i>
              <span v-if="!isCollapsed">任务队列</span>
            </router-link>
            <router-link to="/print/history" class="app-sidebar__item" active-class="active">
              <i class="el-icon-notebook-1"></i>
              <span v-if="!isCollapsed">打印历史</span>
            </router-link>
            <router-link to="/print/batch" class="app-sidebar__item" active-class="active">
              <i class="el-icon-suitcase"></i>
              <span v-if="!isCollapsed">批量打印</span>
            </router-link>
          </div>
        </div>
        
        <!-- 设备管理 -->
        <div class="app-sidebar__group">
          <div class="app-sidebar__group-title" @click="toggleGroup('devices')">
            <i class="el-icon-cpu"></i>
            <span v-if="!isCollapsed">设备管理</span>
            <i class="app-sidebar__group-arrow" :class="{'is-expanded': expandedGroups.devices}"></i>
          </div>
          
          <div v-if="expandedGroups.devices || isCollapsed" class="app-sidebar__group-items">
            <router-link to="/devices/list" class="app-sidebar__item" active-class="active">
              <i class="el-icon-monitor"></i>
              <span v-if="!isCollapsed">设备列表</span>
            </router-link>
            <router-link to="/devices/status" class="app-sidebar__item" active-class="active">
              <i class="el-icon-data-line"></i>
              <span v-if="!isCollapsed">状态监控</span>
            </router-link>
            <router-link to="/devices/config" class="app-sidebar__item" active-class="active">
              <i class="el-icon-setting"></i>
              <span v-if="!isCollapsed">配置管理</span>
            </router-link>
          </div>
        </div>
        
        <!-- 系统设置 -->
        <div class="app-sidebar__group">
          <div class="app-sidebar__group-title" @click="toggleGroup('system')">
            <i class="el-icon-setting"></i>
            <span v-if="!isCollapsed">系统设置</span>
            <i class="app-sidebar__group-arrow" :class="{'is-expanded': expandedGroups.system}"></i>
          </div>
          
          <div v-if="expandedGroups.system || isCollapsed" class="app-sidebar__group-items">
            <router-link to="/system/users" class="app-sidebar__item" active-class="active">
              <i class="el-icon-user"></i>
              <span v-if="!isCollapsed">用户管理</span>
            </router-link>
            <router-link to="/system/roles" class="app-sidebar__item" active-class="active">
              <i class="el-icon-key"></i>
              <span v-if="!isCollapsed">权限管理</span>
            </router-link>
            <router-link to="/system/logs" class="app-sidebar__item" active-class="active">
              <i class="el-icon-document-checked"></i>
              <span v-if="!isCollapsed">操作日志</span>
            </router-link>
          </div>
        </div>
      </nav>
    </div>
    
    <div class="app-sidebar__footer">
      <div class="app-sidebar__version">
        <span v-if="!isCollapsed">版本: 1.0.0</span>
        <span v-else>v1.0.0</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isCollapsed = ref(false)

const expandedGroups = ref({
  templates: true,
  print: true,
  devices: false,
  system: false
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleGroup = (group: string) => {
  if (!isCollapsed.value) {
    expandedGroups.value[group as keyof typeof expandedGroups.value] = !expandedGroups.value[group as keyof typeof expandedGroups.value]
  }
}
</script>

<style scoped lang="scss">
.app-sidebar {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 100%;
  background-color: #ffffff;
  border-right: 1px solid #e4e7ed;
  transition: width 0.3s;
  overflow: hidden;
  
  &.collapsed {
    width: 64px;
  }
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 16px;
    border-bottom: 1px solid #e4e7ed;
  }
  
  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    white-space: nowrap;
    
    i {
      font-size: 18px;
      color: #409eff;
    }
  }
  
  &__toggle {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #606266;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      border-color: #409eff;
      color: #409eff;
    }
    
    i {
      font-size: 16px;
    }
  }
  
  &__content {
    flex: 1;
    padding: 16px 0;
    overflow-y: auto;
  }
  
  &__nav {
    .app-sidebar__group {
      margin-bottom: 8px;
    }
    
    .app-sidebar__group-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: #f5f7fa;
      }
      
      i:first-child {
        margin-right: 8px;
        color: #606266;
        font-size: 16px;
      }
    }
    
    .app-sidebar__group-arrow {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 4px 0 4px 6px;
      border-color: transparent transparent transparent #c0c4cc;
      transition: transform 0.3s;
      
      &.is-expanded {
        transform: rotate(90deg);
      }
    }
    
    .app-sidebar__group-items {
      padding-left: 40px;
    }
    
    .app-sidebar__item {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      font-size: 14px;
      color: #606266;
      text-decoration: none;
      border-radius: 4px;
      margin: 2px 16px;
      transition: all 0.3s;
      
      &:hover {
        background-color: #f5f7fa;
        color: #303133;
      }
      
      &.active {
        background-color: #ecf5ff;
        color: #409eff;
        font-weight: 500;
      }
      
      i {
        margin-right: 8px;
        font-size: 16px;
      }
    }
  }
  
  &__footer {
    padding: 16px;
    border-top: 1px solid #e4e7ed;
  }
  
  &__version {
    font-size: 12px;
    color: #909399;
    text-align: center;
  }
}

// 侧边栏折叠状态
.app-sidebar:has(.collapsed) {
  width: 64px;
  
  .app-sidebar__title span,
  .app-sidebar__group-title span,
  .app-sidebar__item span {
    display: none;
  }
  
  .app-sidebar__group-title {
    justify-content: center;
    padding: 12px;
    
    i:first-child {
      margin-right: 0;
    }
  }
  
  .app-sidebar__group-arrow {
    display: none;
  }
  
  .app-sidebar__group-items {
    padding-left: 0;
    text-align: center;
  }
  
  .app-sidebar__item {
    justify-content: center;
    padding: 10px;
    margin: 2px 8px;
    
    i {
      margin-right: 0;
    }
  }
}
</style>
