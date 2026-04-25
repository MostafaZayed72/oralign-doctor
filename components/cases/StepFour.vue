<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header -->
    <div class="border-b border-slate-100 dark:border-slate-800 pb-8">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <i class="fas fa-clipboard-check text-brand-primary"></i> Summary & Review
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Please review all details carefully before submitting the case to our orthodontists.</p>
        </div>
        <div class="hidden md:block">
           <span class="px-6 py-3 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest border border-brand-primary/20">
             Final Step
           </span>
        </div>
      </div>
    </div>

    <!-- Summary Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Left Column: Core Info -->
      <div class="lg:col-span-4 space-y-8">
        <!-- Patient Card -->
        <div class="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20">
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-6">Patient Information</h4>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
              <span class="text-xs font-bold text-slate-400">First Name</span>
              <span class="text-sm font-black text-slate-700 dark:text-white">{{ formData.first_name || '—' }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
              <span class="text-xs font-bold text-slate-400">Last Name</span>
              <span class="text-sm font-black text-slate-700 dark:text-white">{{ formData.last_name || '—' }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
              <span class="text-xs font-bold text-slate-400">Gender</span>
              <span class="text-sm font-black text-slate-700 dark:text-white">{{ formData.gender || '—' }}</span>
            </div>
            <div class="flex justify-between items-center py-3">
              <span class="text-xs font-bold text-slate-400">Date of Birth</span>
              <span class="text-sm font-black text-slate-700 dark:text-white">{{ formData.dob || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Records Card -->
        <div class="p-8 rounded-[2.5rem] bg-[#063c31] text-white shadow-xl shadow-[#063c31]/20">
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Records & Scans</h4>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-white/10">
              <span class="text-xs font-bold opacity-70">Clinical Photos</span>
              <span class="text-sm font-black">{{ Object.keys(formData.recordFiles || {}).length }} Files</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-white/10">
              <span class="text-xs font-bold opacity-70">Impression Type</span>
              <span class="text-sm font-black capitalize">{{ formData.impressionType }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-xs font-bold opacity-70">Treatment Arch</span>
              <span class="text-sm font-black text-emerald-400">{{ formData.treatmentArch }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Detailed Plan Summary -->
      <div class="lg:col-span-8 space-y-8">
        <div class="p-8 md:p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20">
          <div class="flex items-center justify-between mb-8">
            <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Detailed Treatment Plan</h4>
            <div class="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center">
              <i class="fas fa-magic text-brand-primary text-sm"></i>
            </div>
          </div>

          <!-- 16 Categories Preview Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="cat in clinicalCategories" 
              :key="cat.id"
              class="p-4 rounded-2xl border transition-all"
              :class="isCategoryActive(cat.id) ? 'border-brand-primary/30 bg-brand-primary/[0.02]' : 'border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20'"
            >
              <div class="flex items-start gap-4">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="isCategoryActive(cat.id) ? 'bg-brand-primary/10 text-brand-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'">
                  <i :class="cat.icon" class="text-xs"></i>
                </div>
                <div>
                  <h5 class="text-[11px] font-black uppercase tracking-widest" :class="isCategoryActive(cat.id) ? 'text-brand-primary' : 'text-slate-400'">{{ cat.label }}</h5>
                  <p class="text-[10px] mt-1 font-medium" :class="isCategoryActive(cat.id) ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 italic'">
                    {{ getCategorySummary(cat.id) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Chief Complaint & Notes -->
          <div class="mt-10 pt-10 border-t border-slate-50 dark:border-slate-800 space-y-6">
            <div class="space-y-3">
              <h5 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Chief Complaint</h5>
              <div class="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-700">
                "{{ formData.chiefComplaint || 'No specific complaint entered.' }}"
              </div>
            </div>
          </div>
        </div>

        <!-- Final Confirmation Notice -->
        <div class="p-6 rounded-3xl bg-brand-primary/5 border border-brand-primary/10 flex gap-5 items-center">
          <div class="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center shrink-0">
            <i class="fas fa-shield-alt text-brand-primary"></i>
          </div>
          <p class="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            By clicking "Submit Case", you confirm that all provided information is accurate and you agree to the <span class="text-brand-primary font-bold">Oralign Terms of Service</span>.
          </p>
        </div>
      </div>

    </div>

    <!-- Actions -->
    <div class="flex justify-between items-center pt-10 mt-10 border-t border-slate-100 dark:border-slate-800">
      <button 
        @click="$emit('prev')"
        :disabled="isSubmitting"
        class="group px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-all disabled:opacity-50"
      >
        <i class="fas fa-chevron-left transition-transform group-hover:-translate-x-1"></i>
        Previous
      </button>
      
      <button 
        @click="$emit('submit')"
        :disabled="isSubmitting"
        class="group relative px-12 py-5 bg-[#063c31] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#063c31]/30 hover:scale-105 hover:shadow-[#063c31]/50 active:scale-95 transition-all duration-300 flex items-center gap-4 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-paper-plane"></i>
        <span>{{ isSubmitting ? 'Processing Case...' : 'Submit Final Case' }}</span>
        <div class="absolute inset-0 w-1/2 h-full bg-white/10 -skew-x-[45deg] -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  formData: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false }
})
defineEmits(['prev', 'submit'])

const clinicalCategories = [
  { id: 'crowdingSpacing', label: 'Crowding / Spacing', icon: 'fas fa-arrows-alt-h' },
  { id: 'transverseDiscrepancy', label: 'Transverse', icon: 'fas fa-expand-alt' },
  { id: 'verticalDiscrepancy', label: 'Vertical', icon: 'fas fa-arrows-alt-v' },
  { id: 'apDiscrepancy', label: 'A-P Discrepancy', icon: 'fas fa-exchange-alt' },
  { id: 'elastics', label: 'Elastics', icon: 'fas fa-link' },
  { id: 'biteRamps', label: 'Bite Ramps', icon: 'fas fa-mountain' },
  { id: 'pontics', label: 'Pontics', icon: 'fas fa-fill-drip' },
  { id: 'attachments', label: 'Attachments', icon: 'fas fa-thumbtack' },
  { id: 'toothSizeDiscrepancy', label: 'Tooth size', icon: 'fas fa-ruler-combined' },
  { id: 'archExpansion', label: 'Arch expansion', icon: 'fas fa-compress-arrows-alt' },
  { id: 'extraction', label: 'Extraction', icon: 'fas fa-minus-circle' },
  { id: 'ipr', label: 'IPR', icon: 'fas fa-cut' },
  { id: 'eruptionSpace', label: 'Eruption Space', icon: 'fas fa-external-link-alt' },
  { id: 'movementRestrictions', label: 'Restrictions', icon: 'fas fa-ban' },
  { id: 'passiveAligner', label: 'Passive Aligner', icon: 'fas fa-check-double' },
  { id: 'overcorrection', label: 'Overcorrection', icon: 'fas fa-plus-circle' }
]

const isCategoryActive = (id: string) => {
  const cat = props.formData.detailedPlan[id]
  if (!cat) return false
  return Object.keys(cat).length > 0 && (cat.selectedTeeth?.length > 0 || cat.option || cat.group || cat.notes)
}

const getCategorySummary = (id: string) => {
  const cat = props.formData.detailedPlan[id]
  if (!isCategoryActive(id)) return 'Not specified'
  
  if (cat.selectedTeeth?.length > 0) return `${cat.selectedTeeth.length} Teeth selected`
  if (cat.option) return cat.option
  if (cat.group) return cat.group
  return 'Specified with notes'
}
</script>
