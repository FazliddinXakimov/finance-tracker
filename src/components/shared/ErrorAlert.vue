<template>
  <div class="error-alert">
    <a-alert :message="title" :description="description" type="error" show-icon closable @close="handleClose" />
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

interface Props {
  title?: string
  description?: string
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.error-alert {
  width: 100%;
  margin-bottom: 16px;
}
</style>
