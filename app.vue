<template>
  <div>
    <!-- Impersonation Banner -->
    <div v-if="adminToken" class="bg-gradient-to-r from-amber-500 to-[#d1b06b] text-white px-4 py-2 text-center text-sm font-bold shadow-md flex flex-wrap items-center justify-center gap-3 relative z-[1000] animate-in slide-in-from-top duration-300">
      <span>
        <i class="fas fa-user-secret mr-1.5 rtl:ml-1.5"></i>
        {{ isAr ? 'أنت تتصفح حالياً كطبيب:' : 'You are currently browsing as:' }} 
        <span class="underline decoration-2 font-black ml-1">{{ authUser?.f_name }} {{ authUser?.l_name }}</span>
      </span>
      <button @click="stopImpersonating" class="bg-white text-amber-700 px-3.5 py-1.5 rounded-lg text-xs font-black hover:bg-amber-50 active:scale-95 transition-all shadow flex items-center gap-1.5">
        <i class="fas fa-sign-out-alt"></i>
        {{ isAr ? 'العودة للوحة تحكم الآدمن' : 'Return to Admin Dashboard' }}
      </button>
    </div>

    <!-- Global Loading Screen -->
    <LoadingScreen :visible="isRouteLoading" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { locale } = useI18n()
const isAr = computed(() => locale.value === 'ar')

const router = useRouter()
const isRouteLoading = ref(false)

const { token: authToken, user: authUser } = useAuth()
const adminToken = useCookie('admin_token')

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

const stopImpersonating = () => {
  if (adminToken.value) {
    // Restore admin token
    authToken.value = adminToken.value
    // Delete admin token
    adminToken.value = null
    
    // Clear user state so it fetches fresh admin data
    authUser.value = null
    
    // Navigate back to admin patient cases
    const localePath = useLocalePath()
    navigateTo(localePath('/admin/patient-cases'))
    
    // Refresh page to make sure layout/state updates
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
}
</script>
