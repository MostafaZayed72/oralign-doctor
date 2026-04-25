<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Header -->
    <div class="border-b border-slate-100 dark:border-slate-800 pb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <i class="fas fa-cube text-brand-primary"></i> Jaw Scans
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Select your preferred method for submitting dental impressions.</p>
        </div>
        <div class="hidden md:block">
           <span class="px-4 py-2 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest border border-brand-primary/10">
             Step 3 of 6
           </span>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Left Side: Content based on selection -->
      <div class="flex-1 min-h-[400px]">
        
        <!-- Case 1: Upload 3D Scans -->
        <div v-if="formData.impressionType === 'upload'" class="space-y-6 animate-in slide-in-from-left-5 duration-500">
           <div class="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-4 text-center">
             <p class="text-xs font-bold text-brand-primary uppercase tracking-widest">Only STL, PLY and DCM files are accepted</p>
           </div>
           
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div v-for="jaw in ['lower', 'upper']" :key="jaw" class="space-y-3">
               <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{{ jaw }} Occlusal Scan</label>
               <div 
                 @click="triggerFileClick(jaw)"
                 class="relative aspect-video rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer group"
               >
                 <template v-if="formData.stlFiles[jaw]">
                   <div class="text-center p-6">
                     <i class="fas fa-file-invoice text-4xl text-brand-primary mb-3"></i>
                     <p class="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{{ formData.stlFiles[jaw].name }}</p>
                     <button @click.stop="removeFile(jaw)" class="mt-4 text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600">Remove File</button>
                   </div>
                 </template>
                 <template v-else>
                   <img src="/images/placeholders/stl_scan.png" class="absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover:opacity-30 transition-opacity" />
                   <div class="relative z-10 text-center p-6">
                     <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 shadow-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                       <i class="fas fa-cloud-upload-alt text-2xl text-brand-primary"></i>
                     </div>
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to upload {{ jaw }} scan</p>
                   </div>
                 </template>
                 <input :ref="el => fileRefs[jaw] = el" type="file" class="hidden" accept=".stl,.ply,.dcm" @change="handleFileChange($event, jaw)" />
               </div>
             </div>
           </div>
           <p class="text-[10px] text-slate-400 italic text-center">After successful upload click next to save files</p>
        </div>

        <!-- Case 2: Other (Links) -->
        <div v-else-if="formData.impressionType === 'link'" class="space-y-4 animate-in slide-in-from-left-5 duration-500">
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">Provide links to STL Files (Ex: WeTransfer, Google Drive)</label>
          <div class="relative group">
            <textarea 
              :value="formData.stlLinks"
              @input="$emit('update', 'stlLinks', $event.target.value)"
              rows="8"
              class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl px-6 py-6 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none shadow-inner"
              placeholder="Paste your links here..."
            ></textarea>
            <div class="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 group-hover:text-brand-primary transition-colors">
              <i class="fas fa-link mr-1"></i> Paste Links
            </div>
          </div>
        </div>

        <!-- Case 3: Physical Pickup -->
        <div v-else-if="formData.impressionType === 'pickup'" class="space-y-6 animate-in slide-in-from-left-5 duration-500">
           <div class="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 space-y-6">
             <div class="flex items-start gap-4">
               <div class="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                 <i class="fas fa-truck text-brand-primary"></i>
               </div>
               <div class="space-y-1">
                 <h4 class="text-lg font-bold text-slate-900 dark:text-white">Impression Pickup Service</h4>
                 <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">A courier service will contact you to arrange for the date and time of the impression pick-up.</p>
               </div>
             </div>

             <div class="space-y-4">
               <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Requirements:</h5>
               <ul class="space-y-3">
                 <li v-for="req in requirements" :key="req" class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                   <i class="fas fa-check-circle text-brand-primary text-[10px]"></i>
                   {{ req }}
                 </li>
               </ul>
             </div>

             <div class="pt-4">
               <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Pickup Address</label>
               <input 
                 type="text"
                 :value="formData.pickupAddress"
                 @input="$emit('update', 'pickupAddress', $event.target.value)"
                 class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                 placeholder="cairo , Egypt , madinet naser , 0000"
               />
               <button class="mt-3 text-xs font-bold text-brand-primary hover:underline transition-all">
                 <i class="fas fa-plus-circle mr-1"></i> Add New Address
               </button>
             </div>
           </div>
        </div>
      </div>

      <!-- Right Side: Selection -->
      <div class="w-full lg:w-80 shrink-0">
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/20 sticky top-8">
           <h4 class="text-lg font-black text-slate-900 dark:text-white mb-6 leading-tight">Select how you would like to submit your impressions:</h4>
           
           <div class="space-y-8">
             <!-- Digital Group -->
             <div class="space-y-4">
               <div class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Digital</div>
               <div class="space-y-3">
                 <label 
                   v-for="opt in digitalOptions" 
                   :key="opt.id"
                   class="flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
                   :class="formData.impressionType === opt.id ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'"
                   @click="$emit('update', 'impressionType', opt.id)"
                 >
                    <span class="text-sm font-bold" :class="formData.impressionType === opt.id ? 'text-brand-primary' : 'text-slate-600 dark:text-slate-400'">{{ opt.label }}</span>
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all" :class="formData.impressionType === opt.id ? 'border-brand-primary' : 'border-slate-200 dark:border-slate-700'">
                      <div v-if="formData.impressionType === opt.id" class="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>
                    </div>
                 </label>
               </div>
             </div>

             <!-- Physical Group -->
             <div class="space-y-4">
               <div class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Physical</div>
               <label 
                 class="flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
                 :class="formData.impressionType === 'pickup' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'"
                 @click="$emit('update', 'impressionType', 'pickup')"
               >
                  <span class="text-sm font-bold" :class="formData.impressionType === 'pickup' ? 'text-brand-primary' : 'text-slate-600 dark:text-slate-400'">Impression Pickup</span>
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all" :class="formData.impressionType === 'pickup' ? 'border-brand-primary' : 'border-slate-200 dark:border-slate-700'">
                    <div v-if="formData.impressionType === 'pickup'" class="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>
                  </div>
               </label>
             </div>
           </div>
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
import { ref } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true }
})
const emit = defineEmits(['update', 'next', 'prev'])

const fileRefs = ref<Record<string, any>>({})

const digitalOptions = [
  { id: 'upload', label: 'Upload 3D Scans' },
  { id: 'link', label: 'Other (Links)' }
]

const requirements = [
  'Clean, clear and sterilized impressions',
  'Silicone Impressions (Alginate Impressions are not accepted)',
  'Case ID and doctor name to be printed on the impression box',
  'Please keep in mind that impression trays wont be returned'
]

const triggerFileClick = (jaw: string) => {
  const input = fileRefs.value[jaw]
  if (input) input.click()
}

const handleFileChange = (event: Event, jaw: string) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const newStlFiles = { ...props.formData.stlFiles, [jaw]: file }
    emit('update', 'stlFiles', newStlFiles)
    target.value = ''
  }
}

const removeFile = (jaw: string) => {
  const newStlFiles = { ...props.formData.stlFiles, [jaw]: null }
  emit('update', 'stlFiles', newStlFiles)
}
</script>
