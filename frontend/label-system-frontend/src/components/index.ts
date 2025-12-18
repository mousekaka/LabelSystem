// src/components/index.ts - 修复版本
// 避免导入App类型，解决Vue导出错误问题

// 不再直接导入App类型，使用any或ComponentPublicInstance代替
// import type { App } from 'vue'  // ❌ 这会导致esbuild问题

// 导入组件
import LabelEditor from './business/LabelEditor/LabelEditor.vue'
import PrintQueue from './business/PrintQueue/PrintQueue.vue'
import DeviceStatus from './business/DeviceStatus/DeviceStatus.vue'
import DataChart from './business/DataChart/DataChart.vue'

// 全局标志，确保组件库只注册一次
let isRegistered = false

// 组件列表
const components = {
  LabelEditor,
  PrintQueue, 
  DeviceStatus,
  DataChart
}

// 类型声明：使用any或ComponentPublicInstance来避免类型导入问题
type VueApp = any  // 简化处理，避免类型导入问题

// 注册所有组件的函数
function install(app: VueApp) {
  // 如果已经注册过，直接返回
  if (isRegistered) {
    console.warn('⚠️  组件库已经被注册过了，跳过重复注册')
    return
  }
  
  console.log('🔧 注册LabelUI组件库...')
  
  // 实际注册每个组件
  Object.entries(components).forEach(([name, component]) => {
    if (app.component) {
      app.component(name, component)
      console.log(`   ✅ 注册组件: ${name}`)
    }
  })
  
  // 标记为已注册
  isRegistered = true
  
  console.log('✅ 组件库注册完成，注册了', Object.keys(components).length, '个组件')
}

// 导出一个安装函数
export default {
  install
}

// 导出各个组件供按需导入
export { default as LabelEditor } from './business/LabelEditor/LabelEditor.vue'
export { default as PrintQueue } from './business/PrintQueue/PrintQueue.vue'
export { default as DeviceStatus } from './business/DeviceStatus/DeviceStatus.vue'
export { default as DataChart } from './business/DataChart/DataChart.vue'

// 类型导出（如果需要）
export type { LabelEditorProps } from './business/LabelEditor/LabelEditor.vue'
export type { PrintQueueProps } from './business/PrintQueue/PrintQueue.vue'
export type { DeviceStatusProps } from './business/DeviceStatus/DeviceStatus.vue'
export type { DataChartProps } from './business/DataChart/DataChart.vue'
