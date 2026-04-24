<template>
  <Transition name="dialog">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div @click="cancel" class="absolute inset-0 bg-slate-950/60 backdrop-blur-md"></div>
      
      <!-- Dialog Box -->
      <div class="relative w-full max-w-md scale-in-center bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 overflow-hidden group">
        <!-- Decoration Gradient -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all duration-700"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl group-hover:bg-brand-gold/20 transition-all duration-700"></div>

        <!-- Icon -->
        <div class="mb-6 flex justify-center">
          <div class="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner border border-slate-100 dark:border-slate-700">
            <i :class="icon || 'fas fa-question-circle'" class="text-4xl text-brand-primary drop-shadow-sm"></i>
          </div>
        </div>

        <!-- Content -->
        <div class="text-center space-y-3 relative z-10">
          <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{{ title }}</h3>
          <p class="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{{ message }}</p>
        </div>

        <!-- Actions -->
        <div class="mt-10 flex gap-3 relative z-10">
          <button 
            @click="cancel"
            class="flex-1 py-4 px-6 rounded-2xl font-black text-sm tracking-widest uppercase text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-300"
          >
            {{ cancelText || $t('cancel') }}
          </button>
          <button 
            @click="confirm"
            class="flex-1 py-4 px-6 rounded-2xl font-black text-sm tracking-widest uppercase text-white bg-[#063c31] shadow-xl shadow-[#063c31]/20 hover:scale-105 hover:shadow-[#063c31]/40 active:scale-95 transition-all duration-300"
          >
            {{ confirmText || $t('confirm') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
  icon: String,
  confirmText: String,
  cancelText: String
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.4s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.scale-in-center {
	animation: scale-in-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes scale-in-center {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
