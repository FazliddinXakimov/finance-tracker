<template>
  <a-statistic
    :title="title"
    :value="value"
    :prefix="prefix"
    :suffix="suffix"
    :value-style="valueStyle"
    :class="className"
  >
    <template v-if="icon" #prefix>
      <component :is="icon" />
    </template>
  </a-statistic>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

interface Props {
  title: string
  value: number
  prefix?: string
  suffix?: string
  color?: string
  icon?: any
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  prefix: '',
  suffix: '₽',
  color: '#3f8600',
  className: '',
})

const valueStyle = computed(
  (): CSSProperties => ({
    color: props.color,
    fontWeight: 'bold',
  })
)
</script>

<style scoped src="@/assets/styles/dashboard/balance-card.css"></style>
