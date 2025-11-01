<template>
  <transition name="slide-down">
    <div v-if="show" class="filter-panel">
      <div class="filter-panel__content">
        <slot />
      </div>
      <div v-if="$slots.actions || showDefaultActions" class="filter-panel__actions">
        <slot name="actions">
          <a-button type="primary" @click="emit('apply')">Применить</a-button>
          <a-button @click="emit('clear')">Сбросить</a-button>
        </slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  showDefaultActions?: boolean
}

interface Emits {
  (e: 'apply'): void
  (e: 'clear'): void
}

withDefaults(defineProps<Props>(), {
  showDefaultActions: true,
})

const emit = defineEmits<Emits>()
</script>

<style scoped>
.filter-panel {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.filter-panel__content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.filter-panel__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}
</style>
