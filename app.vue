<template>
  <div>
    <!-- Global Loading Screen -->
    <LoadingScreen :visible="isRouteLoading" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const router = useRouter()
const isRouteLoading = ref(false)

// Hook into Nuxt router transitions
router.beforeEach((to, from, next) => {
  isRouteLoading.value = true
  next()
})

router.afterEach(() => {
  // Add a slight delay of 300ms for a smoother transition
  setTimeout(() => {
    isRouteLoading.value = false
  }, 300)
})

router.onError(() => {
  isRouteLoading.value = false
})
</script>
