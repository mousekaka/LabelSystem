<template>
  <footer class="app-footer">
    <div class="app-footer__content">
      <div class="app-footer__left">
        <div class="app-footer__copyright">
          © 2024 标签打印系统. All rights reserved.
        </div>
        <div class="app-footer__links">
          <a href="#" class="app-footer__link">关于我们</a>
          <span class="app-footer__separator">|</span>
          <a href="#" class="app-footer__link">帮助中心</a>
          <span class="app-footer__separator">|</span>
          <a href="#" class="app-footer__link">隐私政策</a>
          <span class="app-footer__separator">|</span>
          <a href="#" class="app-footer__link">服务条款</a>
        </div>
      </div>
      
      <div class="app-footer__right">
        <div class="app-footer__status">
          <div class="app-footer__status-item">
            <span class="app-footer__status-label">系统状态:</span>
            <span class="app-footer__status-value status-online">
              <i class="el-icon-success"></i>
              在线
            </span>
          </div>
          <div class="app-footer__status-item">
            <span class="app-footer__status-label">服务器时间:</span>
            <span class="app-footer__status-value">{{ currentTime }}</span>
          </div>
          <div class="app-footer__status-item">
            <span class="app-footer__status-label">版本:</span>
            <span class="app-footer__status-value">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')

let timer: number | null = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped lang="scss">
.app-footer {
  background-color: #ffffff;
  border-top: 1px solid #e4e7ed;
  padding: 16px 24px;
  
  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  &__left {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  &__copyright {
    font-size: 14px;
    color: #909399;
  }
  
  &__links {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  &__link {
    font-size: 14px;
    color: #606266;
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: #409eff;
    }
  }
  
  &__separator {
    color: #dcdfe6;
    font-size: 12px;
  }
  
  &__right {
    .app-footer__status {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .app-footer__status-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    
    .app-footer__status-label {
      color: #909399;
    }
    
    .app-footer__status-value {
      color: #606266;
      font-weight: 500;
    }
    
    .status-online {
      color: #67c23a;
      
      i {
        margin-right: 4px;
      }
    }
  }
}

@media (max-width: 768px) {
  .app-footer__content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .app-footer__links {
    justify-content: center;
  }
}
</style>
