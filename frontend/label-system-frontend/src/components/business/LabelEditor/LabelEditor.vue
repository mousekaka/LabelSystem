<template>
  <div class="label-editor">
    <div class="label-editor__toolbar">
      <div class="label-editor__toolbar-left">
        <button class="label-editor__toolbar-btn" @click="addTextField">
          <i class="el-icon-edit"></i>
          <span>添加文本</span>
        </button>
        <button class="label-editor__toolbar-btn" @click="addBarcodeField">
          <i class="el-icon-picture"></i>
          <span>添加条码</span>
        </button>
        <button class="label-editor__toolbar-btn" @click="addImageField">
          <i class="el-icon-picture-outline"></i>
          <span>添加图片</span>
        </button>
      </div>
      
      <div class="label-editor__toolbar-right">
        <button class="label-editor__toolbar-btn label-editor__toolbar-btn--primary" @click="saveTemplate">
          <i class="el-icon-check"></i>
          <span>保存模板</span>
        </button>
        <button class="label-editor__toolbar-btn" @click="printPreview">
          <i class="el-icon-view"></i>
          <span>打印预览</span>
        </button>
      </div>
    </div>
    
    <div class="label-editor__workspace">
      <div class="label-editor__canvas-container">
        <div
          ref="canvasRef"
          class="label-editor__canvas"
          :style="{
            width: `${template.width}mm`,
            height: `${template.height}mm`,
            backgroundColor: template.backgroundColor
          }"
          @click="handleCanvasClick"
        >
          <!-- 网格背景 -->
          <div v-if="showGrid" class="label-editor__grid">
            <div
              v-for="row in gridRows"
              :key="`row-${row}`"
              class="label-editor__grid-row"
            />
          </div>
          
          <!-- 标签字段 -->
          <div
            v-for="field in template.fields"
            :key="field.id"
            class="label-editor__field"
            :class="{
              'label-editor__field--selected': selectedField?.id === field.id
            }"
            :style="{
              left: `${field.x}mm`,
              top: `${field.y}mm`,
              width: `${field.width}mm`,
              height: `${field.height}mm`
            }"
            @click.stop="selectField(field)"
            @mousedown="startDrag(field, $event)"
          >
            <!-- 文本字段 -->
            <div
              v-if="field.type === 'text'"
              class="label-editor__field-text"
              :style="{
                fontSize: `${field.fontSize || 12}pt`,
                fontFamily: field.fontFamily || 'Arial, sans-serif'
              }"
            >
              {{ field.content }}
            </div>
            
            <!-- 条码字段 -->
            <div
              v-else-if="field.type === 'barcode'"
              class="label-editor__field-barcode"
            >
              <svg :width="field.width" :height="field.height" class="barcode-placeholder">
                <rect x="0" y="0" :width="field.width" :height="field.height" fill="#f0f0f0" />
                <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#666">
                  {{ field.content }}
                </text>
              </svg>
            </div>
            
            <!-- 图片字段 -->
            <div
              v-else-if="field.type === 'image'"
              class="label-editor__field-image"
            >
              <img :src="field.content" alt="Image" />
            </div>
            
            <!-- 字段操作手柄 -->
            <div v-if="selectedField?.id === field.id" class="label-editor__field-handles">
              <div
                v-for="handle in fieldHandles"
                :key="handle.position"
                class="label-editor__field-handle"
                :class="`label-editor__field-handle--${handle.position}`"
                @mousedown.stop="startResize(field, handle.position, $event)"
              />
            </div>
          </div>
          
          <!-- 选择框 -->
          <div
            v-if="selectionBox"
            class="label-editor__selection-box"
            :style="{
              left: `${selectionBox.x}mm`,
              top: `${selectionBox.y}mm`,
              width: `${selectionBox.width}mm`,
              height: `${selectionBox.height}mm`
            }"
          />
        </div>
      </div>
      
      <div class="label-editor__sidebar">
        <div class="label-editor__properties">
          <h3 class="label-editor__properties-title">属性面板</h3>
          
          <div v-if="selectedField" class="label-editor__properties-form">
            <div class="label-editor__property-group">
              <label class="label-editor__property-label">类型</label>
              <div class="label-editor__property-value">{{ selectedField.type }}</div>
            </div>
            
            <div class="label-editor__property-group">
              <label class="label-editor__property-label">内容</label>
              <input
                v-model="selectedField.content"
                class="label-editor__property-input"
                @input="updateFieldContent"
              />
            </div>
            
            <div class="label-editor__property-group">
              <label class="label-editor__property-label">位置</label>
              <div class="label-editor__property-row">
                <input
                  v-model.number="selectedField.x"
                  type="number"
                  class="label-editor__property-input label-editor__property-input--small"
                  @input="updateFieldPosition"
                />
                <span class="label-editor__property-unit">mm</span>
                <input
                  v-model.number="selectedField.y"
                  type="number"
                  class="label-editor__property-input label-editor__property-input--small"
                  @input="updateFieldPosition"
                />
                <span class="label-editor__property-unit">mm</span>
              </div>
            </div>
            
            <div class="label-editor__property-group">
              <label class="label-editor__property-label">尺寸</label>
              <div class="label-editor__property-row">
                <input
                  v-model.number="selectedField.width"
                  type="number"
                  class="label-editor__property-input label-editor__property-input--small"
                  @input="updateFieldSize"
                />
                <span class="label-editor__property-unit">mm</span>
                <input
                  v-model.number="selectedField.height"
                  type="number"
                  class="label-editor__property-input label-editor__property-input--small"
                  @input="updateFieldSize"
                />
                <span class="label-editor__property-unit">mm</span>
              </div>
            </div>
            
            <div v-if="selectedField.type === 'text'" class="label-editor__property-group">
              <label class="label-editor__property-label">字体大小</label>
              <input
                v-model.number="selectedField.fontSize"
                type="number"
                min="6"
                max="72"
                class="label-editor__property-input"
                @input="updateFieldStyle"
              />
            </div>
            
            <div class="label-editor__property-actions">
              <button class="label-editor__property-btn label-editor__property-btn--danger" @click="deleteField">
                删除字段
              </button>
            </div>
          </div>
          
          <div v-else class="label-editor__properties-empty">
            请选择一个字段进行编辑
          </div>
        </div>
      </div>
    </div>
    
    <!-- 打印预览对话框 -->
    <Dialog
      v-model="showPreview"
      title="打印预览"
      width="800px"
    >
      <div class="label-preview">
        <div class="label-preview__canvas">
          <!-- 预览内容 -->
        </div>
        <div class="label-preview__controls">
          <button class="label-preview__btn" @click="printNow">
            <i class="el-icon-printer"></i>
            <span>立即打印</span>
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import Dialog from '../../ui/Dialog/Dialog.vue'
import type { LabelTemplate, LabelField } from '../../types'


// 模板数据
const template = reactive<LabelTemplate>({
  id: 'template-' + Date.now(),
  name: '新标签模板',
  width: 100, // mm
  height: 60, // mm
  fields: [],
  createdAt: new Date()
})

// 选中的字段
const selectedField = ref<LabelField | null>(null)

// 显示网格
const showGrid = ref(true)

// 打印预览对话框
const showPreview = ref(false)

// 画布引用
const canvasRef = ref<HTMLDivElement>()

// 网格行数计算
const gridRows = computed(() => {
  return Math.ceil(template.height / 5) // 每5mm一行
})

// 字段手柄定义
const fieldHandles = [
  { position: 'nw' },
  { position: 'n' },
  { position: 'ne' },
  { position: 'w' },
  { position: 'e' },
  { position: 'sw' },
  { position: 's' },
  { position: 'se' }
]

// 选择框
const selectionBox = ref<{
  x: number
  y: number
  width: number
  height: number
} | null>(null)

// 添加文本字段
const addTextField = () => {
  const field: LabelField = {
    id: 'field-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    type: 'text',
    content: '新文本',
    x: 10,
    y: 10,
    width: 30,
    height: 10,
    fontSize: 12,
    fontFamily: 'Arial, sans-serif'
  }
  template.fields.push(field)
  selectedField.value = field
}

// 添加条码字段
const addBarcodeField = () => {
  const field: LabelField = {
    id: 'field-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    type: 'barcode',
    content: '123456789012',
    x: 10,
    y: 25,
    width: 40,
    height: 20
  }
  template.fields.push(field)
  selectedField.value = field
}

// 添加图片字段
const addImageField = () => {
  const field: LabelField = {
    id: 'field-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    type: 'image',
    content: 'https://via.placeholder.com/100x50',
    x: 10,
    y: 50,
    width: 30,
    height: 20
  }
  template.fields.push(field)
  selectedField.value = field
}

// 选择字段
const selectField = (field: LabelField) => {
  selectedField.value = field
}

// 开始拖拽
const startDrag = (field: LabelField, event: MouseEvent) => {
  // 拖拽逻辑实现
  console.log('开始拖拽字段:', field.id)
}

// 开始调整大小
const startResize = (field: LabelField, position: string, event: MouseEvent) => {
  // 调整大小逻辑实现
  console.log('开始调整大小:', field.id, position)
}

// 更新字段内容
const updateFieldContent = () => {
  // 内容更新逻辑
}

// 更新字段位置
const updateFieldPosition = () => {
  // 位置更新逻辑
}

// 更新字段尺寸
const updateFieldSize = () => {
  // 尺寸更新逻辑
}

// 更新字段样式
const updateFieldStyle = () => {
  // 样式更新逻辑
}

// 删除字段
const deleteField = () => {
  if (selectedField.value) {
    const index = template.fields.findIndex(f => f.id === selectedField.value?.id)
    if (index !== -1) {
      template.fields.splice(index, 1)
      selectedField.value = null
    }
  }
}

// 画布点击
const handleCanvasClick = (event: MouseEvent) => {
  // 如果点击的是画布空白区域，取消选中字段
  if ((event.target as HTMLElement).classList.contains('label-editor__canvas')) {
    selectedField.value = null
  }
}

// 保存模板
const saveTemplate = () => {
  console.log('保存模板:', template)
  // 这里应该调用API保存模板
  alert('模板已保存')
}

// 打印预览
const printPreview = () => {
  showPreview.value = true
}

// 立即打印
const printNow = () => {
  console.log('开始打印:', template)
  showPreview.value = false
  // 这里应该调用打印API
  alert('开始打印')
}

// 生命周期
onMounted(() => {
  console.log('标签编辑器已加载')
})

onUnmounted(() => {
  console.log('标签编辑器已卸载')
})
</script>

<style scoped lang="scss">
.label-editor {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  
  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    
    &-left,
    &-right {
      display: flex;
      gap: 8px;
    }
    
    &-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 14px;
      color: #495057;
      background-color: #ffffff;
      border: 1px solid #ced4da;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background-color: #f8f9fa;
        border-color: #adb5bd;
      }
      
      &--primary {
        background-color: #007bff;
        color: #ffffff;
        border-color: #007bff;
        
        &:hover {
          background-color: #0069d9;
          border-color: #0062cc;
        }
      }
    }
  }
  
  &__workspace {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  &__canvas-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    overflow: auto;
    background-color: #e9ecef;
  }
  
  &__canvas {
    position: relative;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px dashed #adb5bd;
  }
  
  &__grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    
    &-row {
      height: 5mm;
      border-bottom: 1px solid rgba(173, 181, 189, 0.2);
    }
  }
  
  &__field {
    position: absolute;
    cursor: move;
    border: 1px solid transparent;
    overflow: hidden;
    
    &--selected {
      border: 2px solid #007bff;
      box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
    }
    
    &-text {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #333333;
    }
    
    &-barcode {
      width: 100%;
      height: 100%;
      
      .barcode-placeholder {
        width: 100%;
        height: 100%;
      }
    }
    
    &-image {
      width: 100%;
      height: 100%;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    
    &-handles {
      position: absolute;
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
      pointer-events: none;
    }
    
    &-handle {
      position: absolute;
      width: 12px;
      height: 12px;
      background-color: #007bff;
      border: 2px solid #ffffff;
      border-radius: 50%;
      pointer-events: auto;
      cursor: pointer;
      
      &--nw {
        top: -6px;
        left: -6px;
        cursor: nw-resize;
      }
      
      &--n {
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        cursor: n-resize;
      }
      
      &--ne {
        top: -6px;
        right: -6px;
        cursor: ne-resize;
      }
      
      &--w {
        top: 50%;
        left: -6px;
        transform: translateY(-50%);
        cursor: w-resize;
      }
      
      &--e {
        top: 50%;
        right: -6px;
        transform: translateY(-50%);
        cursor: e-resize;
      }
      
      &--sw {
        bottom: -6px;
        left: -6px;
        cursor: sw-resize;
      }
      
      &--s {
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        cursor: s-resize;
      }
      
      &--se {
        bottom: -6px;
        right: -6px;
        cursor: se-resize;
      }
    }
  }
  
  &__selection-box {
    position: absolute;
    border: 2px dashed #007bff;
    background-color: rgba(0, 123, 255, 0.1);
    pointer-events: none;
  }
  
  &__sidebar {
    width: 300px;
    border-left: 1px solid #e9ecef;
    background-color: #ffffff;
    overflow-y: auto;
  }
  
  &__properties {
    padding: 20px;
    
    &-title {
      margin: 0 0 20px 0;
      font-size: 16px;
      font-weight: 600;
      color: #212529;
    }
    
    &-form {
      .label-editor__property-group {
        margin-bottom: 16px;
      }
      
      .label-editor__property-label {
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
        font-weight: 500;
        color: #495057;
      }
      
      .label-editor__property-value {
        padding: 8px 12px;
        background-color: #f8f9fa;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 14px;
      }
      
      .label-editor__property-input {
        width: 100%;
        padding: 8px 12px;
        font-size: 14px;
        color: #495057;
        background-color: #ffffff;
        border: 1px solid #ced4da;
        border-radius: 4px;
        transition: border-color 0.3s;
        
        &:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        
        &--small {
          flex: 1;
          min-width: 0;
        }
      }
      
      .label-editor__property-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .label-editor__property-unit {
        font-size: 14px;
        color: #6c757d;
        white-space: nowrap;
      }
      
      .label-editor__property-actions {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #e9ecef;
      }
      
      .label-editor__property-btn {
        width: 100%;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 500;
        color: #ffffff;
        background-color: #dc3545;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s;
        
        &:hover {
          background-color: #c82333;
        }
        
        &--danger {
          background-color: #dc3545;
          
          &:hover {
            background-color: #c82333;
          }
        }
      }
    }
    
    &-empty {
      padding: 40px 20px;
      text-align: center;
      color: #6c757d;
      font-size: 14px;
    }
  }
  
  .label-preview {
    padding: 20px;
    
    &__canvas {
      margin-bottom: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
      overflow: hidden;
    }
    
    &__controls {
      display: flex;
      justify-content: flex-end;
    }
    
    &__btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      font-size: 14px;
      color: #ffffff;
      background-color: #007bff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: #0069d9;
      }
    }
  }
}
</style>



