<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Header -->
    <div class="border-b border-slate-100 dark:border-slate-800 pb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <i class="fas fa-camera-retro text-brand-primary"></i> Patient Records
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Please upload the required clinical photos and X-rays for treatment planning.</p>
        </div>
        <div class="hidden md:block">
           <span class="px-4 py-2 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest border border-brand-primary/10">
             Step 2 of 4
           </span>
        </div>
      </div>
    </div>

    <!-- Photo Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <div v-for="slot in photoSlots" :key="slot.key" class="space-y-2 group">
        <div class="flex justify-between items-center px-1">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-primary transition-colors">{{ slot.label }}</label>
          <i v-if="formData.recordFiles?.[slot.key]" class="fas fa-check-circle text-emerald-500 text-xs"></i>
        </div>
        
        <div 
          @click="triggerSlotClick(slot.key)"
          class="relative aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer group/card"
          :class="[
            formData.recordFiles?.[slot.key] 
              ? 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-900/10' 
              : 'border-slate-200 dark:border-slate-800 hover:border-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800/50'
          ]"
        >
          <!-- Preview Image -->
          <template v-if="previews[slot.key]">
            <img :src="previews[slot.key]" class="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
            <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
               <button @click.stop="removeFile(slot.key)" class="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg">
                 Remove
               </button>
               <p class="text-[8px] text-white/70 mt-2 text-center truncate w-full">{{ formData.recordFiles[slot.key].name }}</p>
            </div>
          </template>

          <!-- Placeholder -->
          <template v-else>
            <div class="w-full h-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative">
              <img :src="`/images/placeholders/${slot.key}.png`" class="w-full h-full object-cover opacity-60 group-hover/card:opacity-90 transition-all duration-700" />
              <div class="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-slate-900/40 to-transparent">
                <div class="w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-700/60 backdrop-blur-md flex items-center justify-center mb-2 shadow-lg border border-white/30 group-hover/card:scale-110 transition-transform">
                  <i :class="slot.icon" class="text-lg text-slate-700 dark:text-white group-hover/card:text-brand-primary transition-colors"></i>
                </div>
                <p class="text-[9px] font-black text-white uppercase tracking-widest drop-shadow-md">Click to upload</p>
              </div>
            </div>
          </template>

          <!-- Hidden Input -->
          <input 
            :ref="el => slotRefs[slot.key] = el"
            type="file" 
            accept="image/*" 
            class="hidden" 
            @change="handleFileChange($event, slot.key)" 
          />
        </div>
      </div>
    </div>

    <!-- Navigation Actions -->
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
        <!-- Button Shine -->
        <div class="absolute inset-0 w-1/2 h-full bg-white/10 -skew-x-[45deg] -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true }
})
const emit = defineEmits(['update', 'next', 'prev'])

// Ensure recordFiles object exists
if (!props.formData.recordFiles) {
  props.formData.recordFiles = {}
}

const photoSlots = [
  { key: 'frontal', label: 'Frontal', icon: 'fas fa-teeth' },
  { key: 'right_buccal', label: 'Right Buccal', icon: 'fas fa-tooth' },
  { key: 'left_buccal', label: 'Left Buccal', icon: 'fas fa-tooth' },
  { key: 'panoramic', label: 'Panoramic', icon: 'fas fa-x-ray' },
  { key: 'upper_occlusal', label: 'Upper Occlusal', icon: 'fas fa-teeth' },
  { key: 'lower_occlusal', label: 'Lower Occlusal', icon: 'fas fa-teeth-open' },
  { key: 'front_smiling', label: 'Front Smiling', icon: 'fas fa-grin' },
  { key: 'cephalometric', label: 'Cephalometric', icon: 'fas fa-skull' },
  { key: 'front_pose', label: 'Front Pose', icon: 'fas fa-portrait' },
  { key: 'profile_pose', label: 'Profile Pose', icon: 'fas fa-id-badge' },
]

const slotRefs = ref<Record<string, any>>({})
const previews = ref<Record<string, string>>({})

// Initialize previews if files already exist
onMounted(() => {
  for (const key in props.formData.recordFiles) {
    const file = props.formData.recordFiles[key]
    if (file && file instanceof File) {
      previews.value[key] = URL.createObjectURL(file)
    }
  }
})

const triggerSlotClick = (key: string) => {
  const input = slotRefs.value[key]
  if (input) input.click()
}

const handleFileChange = (event: Event, key: string) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // Update formData
    const newRecordFiles = { ...props.formData.recordFiles, [key]: file }
    emit('update', 'recordFiles', newRecordFiles)
    
    // Create preview
    if (previews.value[key]) URL.revokeObjectURL(previews.value[key])
    previews.value[key] = URL.createObjectURL(file)
    
    // Reset input
    target.value = ''
  }
}

const removeFile = (key: string) => {
  const newRecordFiles = { ...props.formData.recordFiles }
  delete newRecordFiles[key]
  emit('update', 'recordFiles', newRecordFiles)
  
  if (previews.value[key]) {
    URL.revokeObjectURL(previews.value[key])
    delete previews.value[key]
  }
}
</script>

<style scoped>
.zoom-in-95 {
  --tw-enter-opacity: 0;
  --tw-enter-scale: 0.95;
}
</style>
