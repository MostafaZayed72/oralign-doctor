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

    <!-- Patient Card (Full width, single row on desktop) -->
    <div class="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20">
      <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#063c31] mb-6">Patient Information</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="flex flex-col gap-1 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-50 dark:border-slate-800">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">First Name</span>
          <span class="text-sm font-black text-[#063c31] dark:text-white">{{ formData.first_name || '—' }}</span>
        </div>
        <div class="flex flex-col gap-1 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-50 dark:border-slate-800">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Name</span>
          <span class="text-sm font-black text-[#063c31] dark:text-white">{{ formData.last_name || '—' }}</span>
        </div>
        <div class="flex flex-col gap-1 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-50 dark:border-slate-800">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</span>
          <span class="text-sm font-black text-[#063c31] dark:text-white">{{ formData.gender || '—' }}</span>
        </div>
        <div class="flex flex-col gap-1 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-50 dark:border-slate-800">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</span>
          <span class="text-sm font-black text-[#063c31] dark:text-white">{{ formData.dob || '—' }}</span>
        </div>
      </div>
    </div>

    <!-- Summary Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Left Column: Core Info -->
      <div class="lg:col-span-4 space-y-8">
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
            <button 
              @click="$emit('goToDetailedPlan')"
              title="Edit Detailed Plan"
              class="w-10 h-10 rounded-xl bg-brand-primary/5 hover:bg-brand-primary/10 flex items-center justify-center text-brand-primary transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <i class="fas fa-pen text-sm"></i>
            </button>
          </div>

          <!-- 16 Categories Preview Grid -->
          <div v-if="hasAnyActiveCategory" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <template v-for="cat in clinicalCategories" :key="cat.id">
              <div 
                v-if="isCategoryActive(cat.id)"
                class="p-4 rounded-2xl border transition-all border-brand-primary/30 bg-brand-primary/[0.02]"
              >
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-brand-primary/10 text-brand-primary">
                    <i :class="cat.icon" class="text-xs"></i>
                  </div>
                  <div>
                    <h5 class="text-[11px] font-black uppercase tracking-widest text-brand-primary">{{ cat.label }}</h5>
                    <div class="flex flex-wrap gap-1 mt-1.5">
                      <span 
                        v-for="(detail, i) in getCategoryDetails(cat.id)" 
                        :key="i"
                        class="px-2.5 py-1 bg-[#063c31]/5 text-[#063c31] dark:bg-slate-800 dark:text-slate-300 rounded-xl text-[10px] font-black tracking-wide leading-tight shadow-sm"
                      >
                        {{ detail }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div v-else class="p-8 text-center text-xs font-bold text-[#063c31]/50 italic bg-[#063c31]/5 rounded-2xl border border-dashed border-[#063c31]/20">
            No detailed treatment plan options specified.
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
    <div class="flex flex-wrap justify-between items-center gap-4 pt-10 mt-10 border-t border-slate-100 dark:border-slate-800">
      <div class="flex items-center gap-4">
        <button 
          @click="$emit('prev')"
          :disabled="isSubmitting"
          class="group px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-all disabled:opacity-50"
        >
          <i class="fas fa-chevron-left transition-transform group-hover:-translate-x-1"></i>
          Previous
        </button>

        <button 
          @click="downloadPDF"
          :disabled="isSubmitting || isGeneratingPDF"
          class="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-3 shadow-sm active:scale-95 disabled:opacity-50"
        >
          <i v-if="isGeneratingPDF" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-file-pdf text-red-500"></i>
          <span>{{ isGeneratingPDF ? 'Preparing PDF...' : 'Download PDF Summary' }}</span>
        </button>
      </div>
      
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

    <!-- Hidden PDF Template (Rendered off-screen) -->
    <div class="fixed -left-[9999px] top-0 pointer-events-none">
      <div id="pdf-content" class="p-12 bg-white text-slate-900 font-sans" style="width: 800px;">
        <!-- Header -->
        <div class="flex justify-between items-start border-b-4 border-[#063c31] pb-8 mb-8">
          <div>
            <h1 class="text-4xl font-black text-[#063c31] uppercase tracking-tighter">Oralign</h1>
            <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Patient Treatment Summary</p>
          </div>
          <div class="text-right">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Date Generated</p>
            <p class="text-sm font-bold">{{ new Date().toLocaleDateString() }}</p>
          </div>
        </div>

        <!-- Patient Info Grid -->
        <div class="grid grid-cols-2 gap-8 mb-12 bg-slate-50 p-8 rounded-3xl border border-slate-100">
           <div>
             <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#063c31] mb-4">Patient Information</h4>
             <div class="space-y-2">
               <p class="text-sm"><strong>Name:</strong> {{ formData.first_name }} {{ formData.last_name }}</p>
               <p class="text-sm"><strong>Gender:</strong> {{ formData.gender }}</p>
               <p class="text-sm"><strong>DOB:</strong> {{ formData.dob }}</p>
             </div>
           </div>
           <div>
             <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#063c31] mb-4">Case Details</h4>
             <div class="space-y-2">
               <p class="text-sm"><strong>Treatment Arch:</strong> {{ formData.treatmentArch }}</p>
               <p class="text-sm"><strong>Package:</strong> {{ formData.packageType }}</p>
               <p class="text-sm"><strong>Impression:</strong> {{ formData.impressionType }}</p>
             </div>
           </div>
        </div>

        <!-- Detailed Plan Section -->
        <div class="space-y-12">
          <h3 class="text-xl font-black text-[#063c31] border-b-2 border-slate-100 pb-2">Clinical Detailed Plan</h3>
          
          <div v-for="cat in clinicalCategories" :key="cat.id">
            <div v-if="isCategoryActive(cat.id)" class="break-inside-avoid space-y-6 p-6 rounded-3xl border border-slate-100 bg-white shadow-sm">
               <div class="flex items-center gap-4 border-b border-slate-50 pb-4">
                 <div class="w-10 h-10 rounded-xl bg-[#063c31]/10 flex items-center justify-center text-[#063c31]">
                   <i :class="cat.icon"></i>
                 </div>
                 <div>
                   <h4 class="text-sm font-black uppercase tracking-widest text-slate-800">{{ cat.label }}</h4>
                   <p class="text-xs font-bold text-[#063c31] mt-0.5">{{ getCategorySummary(cat.id) }}</p>
                 </div>
               </div>

               <!-- Tooth Diagram for PDF -->
               <div v-if="formData.detailedPlan[cat.id]?.selectedTeeth?.length > 0" class="py-4">
                  <TeethSelector :selected-teeth="formData.detailedPlan[cat.id].selectedTeeth" readonly compact />
               </div>

               <!-- Category Notes -->
               <div v-if="formData.detailedPlan[cat.id]?.notes" class="bg-slate-50 p-4 rounded-xl border-l-4 border-[#063c31]">
                 <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinical Notes</p>
                 <p class="text-xs text-slate-700 leading-relaxed italic">"{{ formData.detailedPlan[cat.id].notes }}"</p>
               </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-20 pt-8 border-t border-slate-100 text-center">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">© {{ new Date().getFullYear() }} Oralign Dental Technologies. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TeethSelector from './TeethSelector.vue'
const props = defineProps({
  formData: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false }
})
const emit = defineEmits(['prev', 'submit', 'goToDetailedPlan'])

const hasAnyActiveCategory = computed(() => {
  return clinicalCategories.some(cat => isCategoryActive(cat.id))
})

const isGeneratingPDF = ref(false)

const downloadPDF = async () => {
  isGeneratingPDF.value = true
  try {
    // Dynamic import to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default
    
    const element = document.getElementById('pdf-content')
    const opt = {
      margin: 0,
      filename: `Oralign_Summary_${props.formData.first_name}_${props.formData.last_name}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }

    // Temporarily show the element or use a clone to ensure it's rendered
    await html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error('PDF Generation Error:', error)
  } finally {
    isGeneratingPDF.value = false
  }
}

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

const getCategoryDetails = (id: string) => {
  const cat = props.formData.detailedPlan[id]
  if (!cat) return []
  
  const details: string[] = []
  
  for (const [key, val] of Object.entries(cat)) {
    if (Array.isArray(val) && val.length > 0) {
      if (key === 'selectedTeeth') {
        details.push(`Teeth: ${val.join(', ')}`)
      } else {
        details.push(`${val.join(', ')}`)
      }
    } else if (val && typeof val === 'string' && val !== 'null' && val.trim() !== '') {
      if (key === 'notes') {
        details.push(`Notes: "${val}"`)
      } else {
        details.push(val)
      }
    } else if (typeof val === 'boolean' && val === true) {
      details.push(key)
    }
  }
  
  return details
}
</script>
