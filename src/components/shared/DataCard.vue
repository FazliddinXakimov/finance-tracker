<template>
  <div class="data-card" :class="[variant, { hoverable }]">
    <div v-if="$slots.icon || icon" class="data-card__icon" :style="{ color: iconColor }">
      <slot name="icon">
        <component v-if="icon" :is="icon" />
      </slot>
    </div>

    <div class="data-card__content">
      <div v-if="$slots.title || title" class="data-card__title">
        <slot name="title">{{ title }}</slot>
      </div>

      <div class="data-card__value">
        <slot name="value">{{ value }}</slot>
      </div>

      <div v-if="$slots.footer || subtitle" class="data-card__subtitle">
        <slot name="footer">{{ subtitle }}</slot>
      </div>
    </div>

    <div v-if="$slots.extra" class="data-card__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  title?: string
  value?: string | number
  subtitle?: string
  icon?: Component
  iconColor?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  hoverable: false,
})
</script>

<style scoped>
.data-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.data-card.hoverable:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.data-card__icon {
  font-size: 32px;
  flex-shrink: 0;
}

.data-card__content {
  flex: 1;
  min-width: 0;
}

.data-card__title {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.data-card__value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.data-card__subtitle {
  font-size: 12px;
  color: #8c8c8c;
}

.data-card__extra {
  flex-shrink: 0;
}

.data-card.success .data-card__value {
  color: #52c41a;
}

.data-card.danger .data-card__value {
  color: #ff4d4f;
}

.data-card.warning .data-card__value {
  color: #faad14;
}

.data-card.info .data-card__value {
  color: #1890ff;
}
</style>
