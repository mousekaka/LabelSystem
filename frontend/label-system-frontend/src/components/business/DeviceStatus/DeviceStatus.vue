<template>
  <div class="device-status">
    <div class="device-status__header">
      <h2 class="device-status__title">设备状态监控</h2>
      <div class="device-status__stats">
        <div class="device-status__stat">
          <span class="device-status__stat-label">在线设备</span>
          <span class="device-status__stat-value status-online">3台</span>
        </div>
        <div class="device-status__stat">
          <span class="device-status__stat-label">离线设备</span>
          <span class="device-status__stat-value status-offline">1台</span>
        </div>
        <div class="device-status__stat">
          <span class="device-status__stat-label">故障设备</span>
          <span class="device-status__stat-value status-error">0台</span>
        </div>
      </div>
    </div>
    
    <div class="device-status__content">
      <p class="device-status__placeholder">设备状态监控组件 - 开发中</p>
      <p>这里将显示打印机、扫描仪等设备的状态信息</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.device-status {
  padding: 20px;
  
  &__header {
    margin-bottom: 24px;
  }
  
  &__title {
    margin: 0 0 16px 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }
  
  &__stats {
    display: flex;
    gap: 24px;
  }
  
  &__stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  &__stat-label {
    font-size: 14px;
    color: #909399;
  }
  
  &__stat-value {
    font-size: 20px;
    font-weight: 600;
    
    &.status-online {
      color: #67c23a;
    }
    
    &.status-offline {
      color: #e6a23c;
    }
    
    &.status-error {
      color: #f56c6c;
    }
  }
  
  &__content {
    padding: 40px;
    text-align: center;
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
  }
  
  &__placeholder {
    font-size: 18px;
    color: #409eff;
    margin-bottom: 16px;
  }
}
</style>
