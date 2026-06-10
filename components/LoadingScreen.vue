<template>
  <Transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md transition-all duration-300">
      <div class="relative flex flex-col items-center">
        <!-- Glowing Spinner Ring -->
        <div class="w-24 h-24 rounded-full border-4 border-t-transparent border-b-transparent border-l-[#d1b06b] border-r-[#063c31] animate-spin mb-6 shadow-[0_0_20px_rgba(209,176,107,0.3)]"></div>
        
        <!-- Pulsing Logo in the Center -->
        <div class="absolute top-5 flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl border border-white/20 p-2 backdrop-blur-sm shadow-inner">
          <img src="/logo.png" alt="Oralign" class="w-full h-full object-contain animate-pulse" />
        </div>

        <!-- Loading Text -->
        <p class="text-xs font-black uppercase tracking-[0.3em] text-white/80 animate-pulse mt-2" style="font-family: 'Cairo', sans-serif;">
          {{ locale === 'ar' ? 'جاري التحميل...' : 'Loading...' }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const { locale } = useI18n()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
