<template>
  <div class="flex h-screen w-full bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300" :dir="dir">
    <!-- Removed BackgroundParticles as it doesn't exist in this project -->
    <!-- Sidebar -->
    <AdminSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Content Area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <AdminHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50 dark:bg-slate-900/50">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const { locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar')
const dir = computed(() => (isRtl.value ? 'rtl' : 'ltr'))
const sidebarOpen = ref(true)

// Auto-close on small screens
onMounted(() => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
})
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');

body {
  font-family: 'Cairo', sans-serif;
  @apply text-slate-900 antialiased;
}

/* Custom Scrollbar for modern look */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  @apply bg-transparent;
}
::-webkit-scrollbar-thumb {
  @apply rounded-full bg-slate-200 hover:bg-slate-300;
}
</style>
