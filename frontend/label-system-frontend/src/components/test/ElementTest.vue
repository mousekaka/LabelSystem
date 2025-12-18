<template>
  <div style="padding: 20px; border: 1px solid #e4e7ed; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-bottom: 15px;">Element Plus 组件验证</h3>
    
    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
      <el-button type="primary" @click="showMessage('primary')">主要按钮</el-button>
      <el-button type="success" @click="showMessage('success')">成功按钮</el-button>
      <el-button type="warning" @click="showMessage('warning')">警告按钮</el-button>
      <el-button type="danger" @click="showMessage('danger')">危险按钮</el-button>
      <el-button type="info" @click="showMessage('info')">信息按钮</el-button>
    </div>
    
    <div style="margin-bottom: 15px;">
      <el-input v-model="inputValue" placeholder="请输入内容" style="width: 300px;" />
      <span style="margin-left: 10px;">输入内容: {{ inputValue }}</span>
    </div>
    
    <div style="margin-bottom: 15px;">
      <el-select v-model="selectedOption" placeholder="请选择">
        <el-option label="选项一" value="1" />
        <el-option label="选项二" value="2" />
        <el-option label="选项三" value="3" />
      </el-select>
      <span style="margin-left: 10px;">选中项: {{ selectedOption }}</span>
    </div>
    
    <div>
      <el-switch v-model="switchValue" active-text="开启" inactive-text="关闭" />
      <span style="margin-left: 10px;">开关状态: {{ switchValue ? '开启' : '关闭' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const inputValue = ref('')
const selectedOption = ref('')
const switchValue = ref(false)

const showMessage = (type: string) => {
  ElMessage({
    message: `${type} 按钮点击成功！`,
    type: type as any
  })
}
</script>
