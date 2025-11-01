<template>
  <div class="chart-container">
    <div v-if="$slots.header || title" class="chart-container__header">
      <div class="chart-container__title">
        <component v-if="icon" :is="icon" class="chart-container__icon" />
        <slot name="header">
          <h3>{{ title }}</h3>
        </slot>
      </div>
      <div v-if="$slots.actions" class="chart-container__actions">
        <slot name="actions" />
      </div>
    </div>

    <div class="chart-container__body" :style="{ height }">
      <a-spin :spinning="loading">
        <slot />
      </a-spin>
    </div>

    <div v-if="$slots.footer" class="chart-container__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  title?: string
  icon?: Component
  loading?: boolean
  height?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  height: '400px',
})
</script>

<style scoped>
.chart-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #f0f0f0;
}

.chart-container__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.chart-container__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.chart-container__icon {
  font-size: 20px;
  color: #1890ff;
}

.chart-container__actions {
  display: flex;
  gap: 8px;
}

.chart-container__body {
  position: relative;
}

.chart-container__footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
