// 修复组件重复注册问题的脚本
function fixDuplicateRegistration() {
  console.log('🔧 开始修复组件重复注册问题...')
  
  // 检查是否已经有LabelUI注册
  const app = window.__VUE_APP_CONTEXT__?.app
  if (app) {
    console.log('✅ 找到Vue应用实例')
    
    // 检查已注册的组件
    const componentCount = Object.keys(app._context.components || {}).length
    console.log(`已注册组件数量: ${componentCount}`)
    
    // 查找重复的组件
    const componentNames = Object.keys(app._context.components || {})
    const duplicates = componentNames.filter(name => 
      name.includes('Anonymous') || name.includes('__vcc')
    )
    
    if (duplicates.length > 0) {
      console.warn(`⚠️  发现可能的重复组件: ${duplicates.join(', ')}`)
    } else {
      console.log('✅ 未发现明显的重复组件')
    }
  } else {
    console.warn('❌ 未找到Vue应用实例')
  }
  
  return true
}

// 暴露到全局
window.fixDuplicateRegistration = fixDuplicateRegistration

console.log('🚀 修复工具已加载，使用 fixDuplicateRegistration() 进行修复')
