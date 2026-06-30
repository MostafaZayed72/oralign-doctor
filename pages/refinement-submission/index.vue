<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0b0b0b] flex flex-col lg:flex-row transition-colors duration-300 brand-green-theme">
    
    <!-- Sidebar Navigation -->
    <aside 
      class="relative w-full bg-white dark:bg-[#121212] border-r border-gray-100 dark:border-gray-800 flex flex-col lg:h-screen sticky top-0 z-40 transition-all duration-300"
      :class="[isCollapsed ? 'lg:w-20' : 'lg:w-72']"
    >
      <!-- Collapse Toggle Button (Desktop Only) -->
      <button 
        @click="isCollapsed = !isCollapsed"
        class="hidden lg:flex absolute top-10 h-8 w-8 items-center justify-center rounded-full bg-[#063c31] text-white shadow-xl border border-white/10 hover:bg-[#05332a] transition-all z-[60] group"
        :class="isRtl ? '-left-4' : '-right-4'"
      >
        <i :class="getChevronIcon" class="fas text-[10px] transition-transform group-hover:scale-125"></i>
      </button>

      <div class="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between" :class="isCollapsed ? 'justify-center p-4' : 'p-8'">
        <div v-if="!isCollapsed">
          <h2 class="text-xl font-black text-gray-800 dark:text-gray-100">Refinement</h2>
          <p class="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">Case Submission</p>
        </div>
        <div v-else class="w-full flex justify-center py-2">
          <span class="text-xl font-black text-[#063c31] dark:text-white">R</span>
        </div>
      </div>
      
      <nav class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        <button 
          v-for="(step, index) in steps" 
          :key="index"
          @click="goToStep(index)"
          class="w-full flex items-center rounded-2xl transition-all duration-300 group"
          :class="[
            currentStep === index 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 translate-x-2' 
              : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400',
            isCollapsed ? 'justify-center p-3' : 'gap-4 p-4 text-left'
          ]"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors"
               :class="currentStep === index ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/5 group-hover:bg-emerald-500/10 group-hover:text-emerald-500'">
            <i v-if="currentStep > index" class="fas fa-check text-xs"></i>
            <i v-else :class="step.icon" class="text-xs"></i>
          </div>
          <div v-if="!isCollapsed" class="min-w-0">
            <div class="text-[10px] uppercase font-black tracking-widest opacity-60">Step {{ index + 1 }}</div>
            <div class="text-sm font-bold truncate">{{ step.title }}</div>
          </div>
        </button>
      </nav>

      <!-- Bottom Status -->
      <div class="p-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800">
        <div class="flex items-center" :class="isCollapsed ? 'justify-center' : 'gap-3'">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <i class="fas fa-layer-group"></i>
          </div>
          <div v-if="!isCollapsed">
            <div class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Progress</div>
            <div class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ Math.round((currentStep / (steps.length - 1)) * 100) }}% Complete</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#0b0b0b]">
      <!-- Header Area (Compact) -->
      <header class="p-6 lg:px-12 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-[#0b0b0b]/80 backdrop-blur-xl sticky top-0 z-30">
        <div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">{{ steps[currentStep].title }}</h1>
          <p class="text-xs text-gray-500 font-medium">Refinement Case #{{ formData.parent_id || 'New' }}</p>
        </div>
        
        <div class="flex items-center gap-3">
           <NuxtLink 
             :to="localePath('/dashboard')"
             class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-black py-3 px-6 rounded-2xl shadow-sm transition-all flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95"
           >
             <i class="fas fa-arrow-left rtl:rotate-180"></i>
             <span>{{ $t('back') || 'Back' }}</span>
           </NuxtLink>
           <button 
             @click="submitRefinement"
             :disabled="isSubmitting"
             class="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-8 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-3 hover:scale-105 active:scale-95 disabled:opacity-50"
           >
             <i class="fas fa-save"></i>
             <span>{{ isSubmitting ? 'Saving...' : 'Submit Now' }}</span>
           </button>
        </div>
      </header>

      <!-- Scrollable Content Body -->
      <div class="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar relative bg-gray-50/30 dark:bg-[#0b0b0b]">
        <div class="max-w-4xl mx-auto w-full">
           <transition name="slide-up" mode="out-in">
             <div :key="currentStep" class="animate-in slide-in-from-bottom-4 duration-500">
               <component 
                 :is="currentStepComponent" 
                 :form-data="formData" 
                 :is-submitting="isSubmitting"
                 @update="updateFormData"
                 @next="nextStep"
                 @prev="prevStep"
                 @go-to-detailed-plan="currentStep = steps.findIndex(s => s.title === 'Detailed Plan')"
                 @submit="submitRefinement"
               />
             </div>
           </transition>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const isCollapsed = ref(false)
const isRtl = computed(() => locale.value === 'ar')
const getChevronIcon = computed(() => {
  if (isRtl.value) {
    return isCollapsed.value ? 'fa-chevron-left' : 'fa-chevron-right'
  } else {
    return isCollapsed.value ? 'fa-chevron-right' : 'fa-chevron-left'
  }
})

onMounted(() => {
  const saved = localStorage.getItem('case_sidebar_collapsed')
  if (saved !== null) {
    isCollapsed.value = saved === 'true'
  }
})

watch(isCollapsed, (newVal) => {
  localStorage.setItem('case_sidebar_collapsed', String(newVal))
})

// Explicit imports required for dynamic components, wrapped in markRaw to avoid Vue reactivity 
// and Windows absolute path (protocol 'f:') SSR errors.
import StepZero from '~/components/cases/StepZero.vue'
import StepOne from '~/components/cases/StepOne.vue'
import StepThree from '~/components/cases/StepThree.vue'
import JawScans from '~/components/cases/JawScans.vue'
import ChiefComplaint from '~/components/cases/ChiefComplaint.vue'
import StepTwo from '~/components/cases/StepTwo.vue'
import StepFour from '~/components/cases/StepFour.vue'

const { token } = useAuth()
const route = useRoute()

// Handle query params
const parentIdFromUrl = route.query.caseId
const editIdFromUrl = route.query.id
const isEditMode = !!editIdFromUrl || route.query.mode === 'edit'

const currentStep = ref(parentIdFromUrl ? 1 : 0)
const isSubmitting = ref(false)

const steps = [
  { title: 'Select Case', icon: 'fas fa-search', component: markRaw(StepZero) },
  { title: 'Patient Info', icon: 'fas fa-user-circle', component: markRaw(StepOne) },
  { title: 'Records', icon: 'fas fa-camera-retro', component: markRaw(StepThree) },
  { title: '3D Scan', icon: 'fas fa-cube', component: markRaw(JawScans) },
  { title: 'Plan', icon: 'fas fa-clipboard-list', component: markRaw(ChiefComplaint) },
  { title: 'Detailed Plan', icon: 'fas fa-tooth', component: markRaw(StepTwo) },
  { title: 'Summary', icon: 'fas fa-flag-checkered', component: markRaw(StepFour) }
]

const progressWidth = computed(() => {
  return `${(currentStep.value / (steps.length - 1)) * 100}%`
})

const currentStepComponent = computed(() => steps[currentStep.value].component)

// Initialize Form Data
const formData = ref({
  id: editIdFromUrl || null,
  parent_id: parentIdFromUrl || null,
  // Step 1: Patient
  first_name: '',
  last_name: '',
  gender: '',
  dob: '',
  
  // Step 2: Records (Photos)
  recordFiles: {}, 

  // Step 3: Scan
  impressionType: 'upload',
  stlLinks: '',
  pickupAddress: '',
  stlFiles: { upper: null, lower: null },

  // Step 4: Plan Options (Chief Complaint & Package)
  chiefComplaint: '',
  additionalNotes: '',
  packageType: 'Basic',
  hasPrimaryTeeth: false,
  treatmentArch: 'Both',

  // Step 5: Detailed Plan
  isEdit: isEditMode,
  detailedPlan: {
    crowdingSpacing: {},
    transverseDiscrepancy: {},
    verticalDiscrepancy: {},
    apDiscrepancy: {},
    attachments: {},
    pontics: {},
    biteRamps: {},
    elastics: {},
    ipr: {},
    extraction: {},
    archExpansion: {},
    toothSizeDiscrepancy: {},
    overcorrection: {},
    passiveAligner: {},
    movementRestrictions: {},
    eruptionSpace: {}
  }
})

onMounted(async () => {
  const targetId = editIdFromUrl || parentIdFromUrl
  if (targetId) {
    try {
      console.log('Fetching case details for ID:', targetId)
      const response: any = await $fetch(`/api/doctor/case-profile/${targetId}`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      
      if (response?.success && response.data?.case) {
        const c = response.data.case
        const p = response.data.prescription
        
        // Robust name parsing
        if (c.patient_name) {
          const names = c.patient_name.trim().split(/\s+/)
          formData.value.first_name = names[0] || ''
          formData.value.last_name = names.slice(1).join(' ') || ''
        }
        
        formData.value.dob = c.dob || ''
        
        // Normalize gender to match StepOne options (Male/Female)
        if (c.gender) {
          const g = c.gender.toLowerCase()
          if (g === 'male' || g === 'm') formData.value.gender = 'Male'
          else if (g === 'female' || g === 'f') formData.value.gender = 'Female'
          else formData.value.gender = c.gender
        }
        
        if (p) {
          formData.value.chiefComplaint = p.chief_complaint || ''
          formData.value.treatmentArch = p.arch || 'Both'
          formData.value.hasPrimaryTeeth = p.has_primary_teeth === '1' || p.has_primary_teeth === true
          formData.value.packageType = p.package_id == 2 ? 'Plus' : (p.package_id == 3 ? 'Pro' : 'Basic')
        }

        if (response.data.detailedPlan) {
          formData.value.detailedPlan = {
            ...formData.value.detailedPlan,
            ...response.data.detailedPlan
          }
        }
        
        if (editIdFromUrl) {
            formData.value.parent_id = c.parent_id || null
        }

        console.log('Successfully synced refinement data:', formData.value)
      } else {
        console.warn('Failed to sync refinement data: success was false or data missing', response)
      }
    } catch (e) {
      console.error('Failed to load parent case for refinement:', e)
    }
  }
})

const updateFormData = (key: string, value: any) => {
  if (key.includes('.')) {
    const parts = key.split('.')
    let target = formData.value
    for (let i = 0; i < parts.length - 1; i++) {
      target = target[parts[i]]
    }
    target[parts[parts.length - 1]] = value
  } else {
    formData.value[key] = value
  }
}

const nextStep = () => {
  if (currentStep.value === 0 && !formData.value.parent_id) {
    Swal.fire({
      icon: 'warning',
      title: locale.value === 'ar' ? 'تنبيه!' : 'Warning!',
      text: locale.value === 'ar' ? 'الرجاء اختيار الحالة المراد عمل تحسين لها أولاً.' : 'Please select a case to refine first.',
      confirmButtonColor: '#063c31'
    })
    return
  }
  if (currentStep.value === 1 && (!formData.value.first_name || !formData.value.first_name.trim() || !formData.value.last_name || !formData.value.last_name.trim())) {
    Swal.fire({
      icon: 'warning',
      title: locale.value === 'ar' ? 'تنبيه!' : 'Warning!',
      text: locale.value === 'ar' ? 'الرجاء إدخال الاسم الأول والاسم الأخير للمريض أولاً.' : 'Please enter the patient\'s First Name and Last Name first.',
      confirmButtonColor: '#063c31'
    })
    return
  }
  if (currentStep.value === 4 && (!formData.value.chiefComplaint || !formData.value.chiefComplaint.trim())) {
    Swal.fire({
      icon: 'warning',
      title: locale.value === 'ar' ? 'تنبيه!' : 'Warning!',
      text: locale.value === 'ar' ? 'حقل الخطة العلاجية/الشكوى الرئيسية (Chief Complaint) إجباري.' : 'The Chief Complaint / Plan field is mandatory.',
      confirmButtonColor: '#063c31'
    })
    return
  }
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const goToStep = (index: number) => {
  // If moving past Step 1 (index 0), parent_id must be selected
  if (index > 0 && !formData.value.parent_id) {
    Swal.fire({
      icon: 'warning',
      title: locale.value === 'ar' ? 'تنبيه!' : 'Warning!',
      text: locale.value === 'ar' ? 'الرجاء اختيار الحالة المراد عمل تحسين لها أولاً.' : 'Please select a case to refine first.',
      confirmButtonColor: '#063c31'
    })
    return
  }

  // If moving past Step 2 (index 1), first name and last name must be filled
  if (index > 1 && (!formData.value.first_name || !formData.value.first_name.trim() || !formData.value.last_name || !formData.value.last_name.trim())) {
    Swal.fire({
      icon: 'warning',
      title: locale.value === 'ar' ? 'تنبيه!' : 'Warning!',
      text: locale.value === 'ar' ? 'الرجاء إدخال الاسم الأول والاسم الأخير للمريض أولاً.' : 'Please enter the patient\'s First Name and Last Name first.',
      confirmButtonColor: '#063c31'
    })
    return
  }
  
  // If moving past Step 5 (index 4), chief complaint must be filled
  if (index > 4 && (!formData.value.chiefComplaint || !formData.value.chiefComplaint.trim())) {
    Swal.fire({
      icon: 'warning',
      title: locale.value === 'ar' ? 'تنبيه!' : 'Warning!',
      text: locale.value === 'ar' ? 'حقل الخطة العلاجية/الشكوى الرئيسية (Chief Complaint) إجباري.' : 'The Chief Complaint / Plan field is mandatory.',
      confirmButtonColor: '#063c31'
    })
    return
  }
  
  currentStep.value = index
}

const submitRefinement = async () => {
  if (isSubmitting.value) return

  if (!formData.value.parent_id) {
    Swal.fire({
      icon: 'warning',
      title: locale.value === 'ar' ? 'تنبيه!' : 'Warning!',
      text: locale.value === 'ar' ? 'الرجاء اختيار الحالة المراد عمل تحسين لها أولاً.' : 'Please select a case to refine first.',
      confirmButtonColor: '#063c31'
    })
    return
  }

  if (!formData.value.first_name || !formData.value.first_name.trim() || !formData.value.last_name || !formData.value.last_name.trim()) {
    Swal.fire({
      icon: 'warning',
      title: locale.value === 'ar' ? 'تنبيه!' : 'Warning!',
      text: locale.value === 'ar' ? 'حقل الاسم الأول والاسم الأخير إجباري للمريض.' : 'First Name and Last Name fields are mandatory for the patient.',
      confirmButtonColor: '#063c31'
    })
    return
  }

  if (!formData.value.chiefComplaint || !formData.value.chiefComplaint.trim()) {
    Swal.fire({
      icon: 'warning',
      title: locale.value === 'ar' ? 'تنبيه!' : 'Warning!',
      text: locale.value === 'ar' ? 'حقل الخطة العلاجية/الشكوى الرئيسية (Chief Complaint) إجباري.' : 'The Chief Complaint / Plan field is mandatory.',
      confirmButtonColor: '#063c31'
    })
    return
  }

  isSubmitting.value = true

  try {
    // Stage 1: Send Data (JSON)
    const payload = {
      parent_id: formData.value.parent_id,
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
      patient_name: `${formData.value.first_name} ${formData.value.last_name}`,
      gender: formData.value.gender,
      dob: formData.value.dob,
      chief_complaint: formData.value.chiefComplaint,
      treatment_arch: formData.value.treatmentArch,
      impression_type: formData.value.impressionType,
      stl_links: formData.value.stlLinks,
      pickup_address: formData.value.pickupAddress,
      package_id: formData.value.packageType === 'Basic' ? 1 : (formData.value.packageType === 'Plus' ? 2 : 3),
      has_primary_teeth: formData.value.hasPrimaryTeeth ? '1' : '0',
      is_edit: formData.value.isEdit,
      detailed_plan: JSON.stringify(formData.value.detailedPlan)
    }

    const endpoint = formData.value.id 
      ? `/api/doctor/cases/${formData.value.id}/update` 
      : '/api/doctor/store-refinement'

    const dataResponse: any = await $fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' },
      body: payload
    })

    if (!dataResponse.success) throw new Error(dataResponse.message)
    const caseId = formData.value.id || dataResponse.case_id

    // Stage 2: Upload Files ONE BY ONE
    // 1. Photos
    if (formData.value.recordFiles) {
      for (const key in formData.value.recordFiles) {
        const file = formData.value.recordFiles[key]
        if (file) {
          const photoBody = new FormData()
          photoBody.append('case_id', caseId)
          photoBody.append(key, file)
          await $fetch('/api/doctor/case-file-upload-direct', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' },
            body: photoBody
          })
        }
      }
    }
    
    // 2. STLs
    if (formData.value.stlFiles.upper) {
      const upperBody = new FormData()
      upperBody.append('case_id', caseId)
      upperBody.append('stl_upper', formData.value.stlFiles.upper)
      await $fetch('/api/doctor/case-file-upload-direct', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' },
        body: upperBody
      })
    }

    if (formData.value.stlFiles.lower) {
      const lowerBody = new FormData()
      lowerBody.append('case_id', caseId)
      lowerBody.append('stl_lower', formData.value.stlFiles.lower)
      await $fetch('/api/doctor/case-file-upload-direct', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' },
        body: lowerBody
      })
    }

    Swal.fire({
      icon: 'success',
      title: t('saved') || 'Refinement Submitted!',
      text: t('save_success_msg') || 'The refinement case and all records have been uploaded successfully.',
      confirmButtonColor: '#10b981'
    }).then(() => {
      navigateTo(localePath('/dashboard'))
    })

  } catch (error: any) {
    console.error('Submit error:', error)
    Swal.fire({
      icon: 'error',
      title: t('error') || 'Submission Failed',
      text: error.data?.message || error.message || 'An error occurred',
      confirmButtonColor: '#ef4444'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
