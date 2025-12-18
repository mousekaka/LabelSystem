// 启动脚本 - 检查环境并启动
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

console.log('🔍 检查项目配置...')

// 检查关键文件
const criticalFiles = [
  'src/main.ts',
  'src/App.vue',
  'src/router/index.ts',
  'src/components/index.ts',
  'vite.config.ts',
  'tsconfig.json'
]

let allFilesExist = true
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} 不存在`)
    allFilesExist = false
  }
})

if (!allFilesExist) {
  console.log('❌ 关键文件缺失，请先修复')
  process.exit(1)
}

console.log('🚀 所有文件检查通过，启动开发服务器...')

// 启动Vite开发服务器
const vite = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
})

vite.on('error', (err) => {
  console.error('启动失败:', err.message)
  process.exit(1)
})

vite.on('close', (code) => {
  console.log(`Vite进程退出，代码: ${code}`)
})
