<template>
  <div 
    class="relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/5 p-8 transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
    :class="gradientClass"
  >
    <!-- Minimal Subtle border highlight -->
    <div class="absolute inset-0 border border-white/5 pointer-events-none rounded-3xl"></div>

    <div class="relative z-10 flex flex-col items-center text-center">
      <!-- Icon Container with Glow -->
      <div 
        class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 shadow-lg border border-white/20 text-3xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        :class="iconColorClass"
      >
        <slot name="icon">
          <i :class="icon" class="drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]"></i>
        </slot>
      </div>

      <!-- Label -->
      <p class="mb-2 text-xs font-black text-white antialiased uppercase tracking-[0.2em] opacity-90 transition-opacity group-hover:opacity-100">
        {{ label }}
      </p>

      <!-- Count with animation -->
      <h3 class="text-4xl font-black tracking-tight text-white drop-shadow-md">
        {{ count }}
      </h3>
      
      <!-- Subtle indicator -->
      <div class="mt-4 h-1 w-12 rounded-full bg-white/20 group-hover:w-20 transition-all duration-500"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  count: { type: [Number, String], default: 0 },
  icon: { type: String, default: 'fas fa-chart-line' },
  gradientClass: { type: String, default: 'bg-gradient-to-br from-slate-800 to-slate-900' },
  iconColorClass: { type: String, default: 'text-white' }
})
</script>


