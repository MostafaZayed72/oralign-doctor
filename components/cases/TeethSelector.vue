<template>
  <div class="space-y-4 py-6">
    <div class="grid grid-cols-2 gap-8 relative">
      <!-- Midline divider -->
      <div class="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700 dashed"></div>
      
      <!-- Upper Arch -->
      <div class="col-span-2 grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <!-- Upper Left (28-21) -->
        <div class="flex justify-end gap-2">
          <div v-for="t in upperLeft" :key="t" @click="$emit('toggle', t)" class="tooth-item" :class="{ 'active': selectedTeeth.includes(t) }">
            <span class="tooth-num">{{ t }}</span>
            <div class="tooth-shape"></div>
          </div>
        </div>
        <div class="w-px h-8 bg-slate-200"></div>
        <!-- Upper Right (11-18) -->
        <div class="flex justify-start gap-2">
          <div v-for="t in upperRight" :key="t" @click="$emit('toggle', t)" class="tooth-item" :class="{ 'active': selectedTeeth.includes(t) }">
            <span class="tooth-num">{{ t }}</span>
            <div class="tooth-shape"></div>
          </div>
        </div>
      </div>

      <!-- Lower Arch -->
      <div class="col-span-2 grid grid-cols-[1fr_auto_1fr] items-center gap-4 pt-4">
        <!-- Lower Left (38-31) -->
        <div class="flex justify-end gap-2">
          <div v-for="t in lowerLeft" :key="t" @click="$emit('toggle', t)" class="tooth-item" :class="{ 'active': selectedTeeth.includes(t) }">
            <span class="tooth-num">{{ t }}</span>
            <div class="tooth-shape"></div>
          </div>
        </div>
        <div class="w-px h-8 bg-slate-200"></div>
        <!-- Lower Right (41-48) -->
        <div class="flex justify-start gap-2">
          <div v-for="t in lowerRight" :key="t" @click="$emit('toggle', t)" class="tooth-item" :class="{ 'active': selectedTeeth.includes(t) }">
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
  selectedTeeth: { type: Array, default: () => [] }
})
const emit = defineEmits(['toggle'])

const upperLeft = [28, 27, 26, 25, 24, 23, 22, 21]
const upperRight = [11, 12, 13, 14, 15, 16, 17, 18]
const lowerLeft = [38, 37, 36, 35, 34, 33, 32, 31]
const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48]
</script>

<style scoped>
.tooth-item {
  @apply flex flex-col items-center gap-1 cursor-pointer transition-all duration-300;
}
.tooth-num {
  @apply text-[9px] font-black text-slate-400 group-hover:text-brand-primary uppercase tracking-tighter;
}
.tooth-shape {
  @apply w-7 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-transparent transition-all;
}
.tooth-item:hover .tooth-shape {
  @apply border-brand-primary/30 bg-brand-primary/5;
}
.tooth-item.active .tooth-shape {
  @apply bg-[#063c31]/60 border-[#063c31] shadow-lg shadow-[#063c31]/20 scale-105;
}
.tooth-item.active .tooth-num {
  @apply text-[#063c31] font-black;
}
</style>
