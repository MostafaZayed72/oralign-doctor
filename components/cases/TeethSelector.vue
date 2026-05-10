<template>
  <div class="space-y-4" :class="{ 'py-6': !compact, 'py-2 scale-75 origin-left': compact }">
    <div class="grid grid-cols-2 gap-4 md:gap-8 relative">
      <!-- Midline divider -->
      <div v-if="!compact" class="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800"></div>
      
      <!-- Upper Arch -->
      <div class="col-span-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <!-- Upper Left (28-21) -->
        <div class="flex justify-end gap-1 md:gap-2">
          <div v-for="t in upperLeft" :key="t" @click="!readonly && $emit('toggle', t)" 
               class="tooth-item" :class="{ 'active': selectedTeeth.includes(t), 'readonly': readonly }">
            <span class="tooth-num">{{ t }}</span>
            <div class="tooth-shape"></div>
          </div>
        </div>
        <div class="w-px h-6 md:h-8 bg-slate-200"></div>
        <!-- Upper Right (11-18) -->
        <div class="flex justify-start gap-1 md:gap-2">
          <div v-for="t in upperRight" :key="t" @click="!readonly && $emit('toggle', t)" 
               class="tooth-item" :class="{ 'active': selectedTeeth.includes(t), 'readonly': readonly }">
            <span class="tooth-num">{{ t }}</span>
            <div class="tooth-shape"></div>
          </div>
        </div>
      </div>

      <!-- Lower Arch -->
      <div class="col-span-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4 pt-2 md:pt-4">
        <!-- Lower Left (38-31) -->
        <div class="flex justify-end gap-1 md:gap-2">
          <div v-for="t in lowerLeft" :key="t" @click="!readonly && $emit('toggle', t)" 
               class="tooth-item" :class="{ 'active': selectedTeeth.includes(t), 'readonly': readonly }">
            <span class="tooth-num">{{ t }}</span>
            <div class="tooth-shape"></div>
          </div>
        </div>
        <div class="w-px h-6 md:h-8 bg-slate-200"></div>
        <!-- Lower Right (41-48) -->
        <div class="flex justify-start gap-1 md:gap-2">
          <div v-for="t in lowerRight" :key="t" @click="!readonly && $emit('toggle', t)" 
               class="tooth-item" :class="{ 'active': selectedTeeth.includes(t), 'readonly': readonly }">
            <span class="tooth-num">{{ t }}</span>
            <div class="tooth-shape"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  selectedTeeth: { type: Array, default: () => [] },
  readonly: { type: Boolean, default: false },
  compact: { type: Boolean, default: false }
})
const emit = defineEmits(['toggle'])

const upperLeft = [28, 27, 26, 25, 24, 23, 22, 21]
const upperRight = [11, 12, 13, 14, 15, 16, 17, 18]
const lowerLeft = [38, 37, 36, 35, 34, 33, 32, 31]
const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48]
</script>

<style scoped>
.tooth-item {
  @apply flex flex-col items-center gap-0.5 md:gap-1 transition-all duration-300;
}
.tooth-item:not(.readonly) {
  @apply cursor-pointer;
}
.tooth-num {
  @apply text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-tighter;
}
.tooth-shape {
  @apply w-5 h-8 md:w-7 md:h-10 rounded-lg border border-slate-200 dark:border-slate-700 transition-all duration-500 relative;
  background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f1f5f9 45%, #cbd5e1 100%);
  box-shadow: 
    inset -2px -2px 5px rgba(0,0,0,0.05), 
    inset 2px 2px 5px rgba(255,255,255,0.8),
    2px 4px 6px rgba(0,0,0,0.05);
}

.dark .tooth-shape {
  background: radial-gradient(circle at 30% 30%, #334155 0%, #1e293b 45%, #0f172a 100%);
  box-shadow: 
    inset -2px -2px 5px rgba(0,0,0,0.4), 
    inset 2px 2px 5px rgba(255,255,255,0.05),
    2px 4px 8px rgba(0,0,0,0.3);
}

.tooth-item:not(.readonly):hover .tooth-shape {
  @apply scale-110 border-brand-primary/40;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
}

.tooth-item.active .tooth-shape {
  @apply border-brand-primary scale-110;
  background: radial-gradient(circle at 30% 30%, #34d399 0%, #10b981 45%, #064e3b 100%);
  box-shadow: 
    0 10px 25px rgba(16, 185, 129, 0.4), 
    inset -2px -2px 6px rgba(0,0,0,0.3),
    inset 2px 2px 6px rgba(255,255,255,0.3);
}

.tooth-item.active .tooth-num {
  @apply text-brand-primary font-black scale-110;
}

/* Shine Reflection */
.tooth-shape::after {
  content: '';
  @apply absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full blur-[1px];
}
</style>
