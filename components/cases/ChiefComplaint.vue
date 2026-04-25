<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Header -->
    <div class="border-b border-slate-100 dark:border-slate-800 pb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <i class="fas fa-clipboard-list text-brand-primary"></i> Chief Complaint & Package
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Specify the patient's concerns and select the treatment package.</p>
        </div>
        <div class="hidden md:block">
           <span class="px-4 py-2 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest border border-brand-primary/10">
             Step 4 of 6
           </span>
        </div>
      </div>
    </div>

    <!-- Textareas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Chief Complaint</label>
        <textarea 
          :value="formData.chiefComplaint"
          @input="$emit('update', 'chiefComplaint', $event.target.value)"
          rows="6"
          class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl px-6 py-6 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none shadow-inner"
          placeholder="Describe the main reason for treatment..."
        ></textarea>
      </div>
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Additional Notes</label>
        <textarea 
          :value="formData.additionalNotes"
          @input="$emit('update', 'additionalNotes', $event.target.value)"
          rows="6"
          class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl px-6 py-6 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none shadow-inner"
          placeholder="Any other observations..."
        ></textarea>
      </div>
    </div>

    <!-- Selection Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Card 1: Primary Teeth -->
      <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 space-y-6">
        <h4 class="text-base font-black text-slate-900 dark:text-white leading-tight">Does the patient have any remaining primary teeth?</h4>
        <div class="flex gap-4">
          <label 
            class="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="formData.hasPrimaryTeeth ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200'"
            @click="$emit('update', 'hasPrimaryTeeth', true)"
          >
            <span class="font-bold" :class="formData.hasPrimaryTeeth ? 'text-brand-primary' : 'text-slate-500'">{{ $t('yes') }}</span>
            <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="formData.hasPrimaryTeeth ? 'border-brand-primary' : 'border-slate-300'">
              <div v-if="formData.hasPrimaryTeeth" class="w-2 h-2 rounded-full bg-brand-primary"></div>
            </div>
          </label>
          <label 
            class="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="!formData.hasPrimaryTeeth ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200'"
            @click="$emit('update', 'hasPrimaryTeeth', false)"
          >
            <span class="font-bold" :class="!formData.hasPrimaryTeeth ? 'text-brand-primary' : 'text-slate-500'">{{ $t('no') }}</span>
            <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="!formData.hasPrimaryTeeth ? 'border-brand-primary' : 'border-slate-300'">
              <div v-if="!formData.hasPrimaryTeeth" class="w-2 h-2 rounded-full bg-brand-primary"></div>
            </div>
          </label>
        </div>
      </div>

      <!-- Card 2: Package Type -->
      <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 space-y-6">
        <h4 class="text-base font-black text-slate-900 dark:text-white leading-tight">Select Package Type</h4>
        <div class="space-y-3">
          <label 
            v-for="pkg in packages" 
            :key="pkg.id"
            class="flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="formData.packageType === pkg.id ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200'"
            @click="$emit('update', 'packageType', pkg.id)"
          >
            <div class="flex items-center gap-3">
              <i class="fas fa-question-circle text-slate-300 text-xs"></i>
              <span class="text-sm font-bold" :class="formData.packageType === pkg.id ? 'text-brand-primary' : 'text-slate-600 dark:text-slate-400'">{{ pkg.label }}</span>
            </div>
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="formData.packageType === pkg.id ? 'border-brand-primary' : 'border-slate-200'">
              <div v-if="formData.packageType === pkg.id" class="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>
            </div>
          </label>
        </div>
      </div>

      <!-- Card 3: Select Arch -->
      <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 space-y-6">
        <h4 class="text-base font-black text-slate-900 dark:text-white leading-tight">Select Arch</h4>
        <div class="space-y-3">
          <label 
            v-for="arch in arches" 
            :key="arch.id"
            class="flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="formData.treatmentArch === arch.id ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200'"
            @click="$emit('update', 'treatmentArch', arch.id)"
          >
            <span class="text-sm font-bold" :class="formData.treatmentArch === arch.id ? 'text-brand-primary' : 'text-slate-600 dark:text-slate-400'">{{ arch.label }}</span>
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="formData.treatmentArch === arch.id ? 'border-brand-primary' : 'border-slate-200'">
              <div v-if="formData.treatmentArch === arch.id" class="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between items-center pt-10 mt-10 border-t border-slate-100 dark:border-slate-800">
      <button 
        @click="$emit('prev')"
        class="group px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-all"
      >
        <i class="fas fa-chevron-left transition-transform group-hover:-translate-x-1"></i>
        Previous
      </button>
      
      <button 
        @click="$emit('next')"
        class="group relative px-10 py-4 bg-[#063c31] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#063c31]/20 hover:scale-105 hover:shadow-[#063c31]/40 active:scale-95 transition-all duration-300 flex items-center gap-3 overflow-hidden"
      >
        <span>Next Step</span>
        <i class="fas fa-chevron-right transition-transform group-hover:translate-x-1"></i>
        <div class="absolute inset-0 w-1/2 h-full bg-white/10 -skew-x-[45deg] -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  formData: { type: Object, required: true }
})
const emit = defineEmits(['update', 'next', 'prev'])

const packages = [
  { id: 'Basic', label: 'Oralign Basic' },
  { id: 'Plus', label: 'Oralign Plus' },
  { id: 'Pro', label: 'Oralign Pro' }
]

const arches = [
  { id: 'Both', label: 'Upper & Lower' },
  { id: 'Upper', label: 'Upper' },
  { id: 'Lower', label: 'Lower' }
]
</script>
