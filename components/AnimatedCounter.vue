<template>
  <span ref="counterRef" style="font-size: inherit; font-weight: inherit; color: inherit; line-height: inherit; letter-spacing: inherit;">{{ displayValue }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: string | number
  duration?: number
}>()

const counterRef = ref<HTMLElement | null>(null)
const displayValue = ref('0')
const targetValue = computed(() => {
  if (typeof props.value === 'number') return props.value
  return parseFloat(props.value.replace(/[^0-9.]/g, ''))
})
const suffix = computed(() => {
  if (typeof props.value === 'number') return ''
  return props.value.replace(/[0-9.]/g, '')
})

const animate = () => {
  const start = 0
  const end = targetValue.value
  const duration = props.duration || 2000
  const startTime = performance.now()

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function (easeOutExpo)
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    
    const currentCount = Math.floor(easeProgress * end)
    displayValue.value = currentCount.toLocaleString() + suffix.value

    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animate()
      observer.disconnect()
    }
  }, { threshold: 0.5 })

  if (counterRef.value) {
    observer.observe(counterRef.value)
  }
})
</script>
