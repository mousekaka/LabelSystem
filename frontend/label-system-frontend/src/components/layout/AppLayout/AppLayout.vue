<template>
  <div class="app-layout">
    <slot name="header">
      <Header />
    </slot>
    
    <div class="app-layout__container">
      <slot name="sidebar">
        <Sidebar />
      </slot>
      
      <main class="app-layout__main">
        <div class="app-layout__content">
          <slot />
        </div>
        
        <slot name="footer">
          <Footer />
        </slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '../Header/Header.vue'
import Sidebar from '../Sidebar/Sidebar.vue'
import Footer from '../Footer/Footer.vue'
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
  
  &__container {
    display: flex;
    flex: 1;
  }
  
  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; // 防止内容溢出
  }
  
  &__content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
}
</style>
