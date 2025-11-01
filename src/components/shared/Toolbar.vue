<template>
  <div class="toolbar">
    <div class="toolbar__left">
      <slot name="left" />
    </div>
    <div class="toolbar__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.toolbar__left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
