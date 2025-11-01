<template>
  <div class="loading-spinner">
    <a-spin :spinning="true" size="large" />
    <p class="loading-text">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Загрузка...',
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 400px;
}

.loading-text {
  margin-top: 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 500;
}
</style>
