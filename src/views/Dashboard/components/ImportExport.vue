<template>
  <a-space>
    <a-button @click="handleExport" :loading="exporting" class="export-button">
      <template #icon>
        <DownloadOutlined />
      </template>
      Экспорт JSON
    </a-button>

    <a-upload :before-upload="handleImport" :show-upload-list="false" accept=".json">
      <a-button :loading="importing" class="import-button">
        <template #icon>
          <UploadOutlined />
        </template>
        Импорт JSON
      </a-button>
    </a-upload>
  </a-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

const transactionStore = useTransactionStore()
const exporting = ref(false)
const importing = ref(false)

const handleExport = async () => {
  exporting.value = true
  try {
    await transactionStore.exportData()
  } finally {
    exporting.value = false
  }
}

const handleImport: UploadProps['beforeUpload'] = async (file) => {
  importing.value = true
  try {
    await transactionStore.importData(file)
  } finally {
    importing.value = false
  }
  return false
}
</script>

<style scoped src="@/assets/styles/import-export.css"></style>
