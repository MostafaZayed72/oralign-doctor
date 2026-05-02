<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] pt-24 pb-12 transition-colors duration-300">
    <div class="container mx-auto px-4 max-w-5xl">
      
      <!-- Page Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-black text-gray-800 dark:text-gray-100 mb-2">
            Refinement Submission
          </h2>
          <p class="text-gray-500 dark:text-gray-400">
            Adjust the treatment plan for an existing case by providing new clinical information.
          </p>
        </div>
        <div class="flex items-center space-x-3 bg-white dark:bg-[#1a1a1a] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <i class="fas fa-layer-group"></i>
          </div>
          <div>
            <div class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Current Step</div>
            <div class="text-sm font-bold text-gray-800 dark:text-gray-100">
              {{ currentStep + 1 }}. {{ steps[currentStep].title }}
            </div>
          </div>
        </div>
      </div>

      <!-- Stepper -->
      <div class="mb-10">
        <div class="flex items-center justify-between relative px-2">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full z-0"></div>
          <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-700 ease-in-out" :style="{ width: progressWidth }"></div>

          <div v-for="(step, index) in steps" :key="index" class="relative z-10 flex flex-col items-center group">
            <div 
              class="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-lg"
              :class="[
                currentStep > index ? 'bg-emerald-500 text-white rotate-[360deg]' : 
                currentStep === index ? 'bg-white dark:bg-[#1a1a1a] text-emerald-500 ring-4 ring-emerald-500/20 scale-110 shadow-emerald-500/20' : 
                'bg-white dark:bg-[#252525] text-gray-400 grayscale border border-gray-100 dark:border-gray-800'
              ]"
            >
              <i v-if="currentStep > index" class="fas fa-check text-lg"></i>
              <i v-else :class="step.icon" class="text-lg"></i>
            </div>
            <div class="mt-4 text-[10px] md:text-xs font-black uppercase tracking-tighter transition-all duration-300 hidden md:block"
                 :class="currentStep >= index ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'">
              {{ step.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-6 md:p-10 transition-all duration-500 min-h-[500px] relative">
        <!-- Quick Submit Button (Floating/Fixed) -->
        <div v-if="currentStep >= 1 && currentStep < steps.length - 1" class="absolute top-6 right-6 z-30">
          <button 
            @click="submitRefinement"
            :disabled="isSubmitting"
            class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-2xl shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <i class="fas fa-save"></i>
            <span>{{ isSubmitting ? 'Saving...' : 'Submit Now' }}</span>
          </button>
        </div>

        <transition name="slide-fade" mode="out-in">
          <component 
            :is="currentStepComponent" 
            :form-data="formData" 
            :is-submitting="isSubmitting"
            @update="updateFormData"
            @next="nextStep"
            @prev="prevStep"
            @submit="submitRefinement"
          />
        </transition>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'

// Import components
import StepZero from '~/components/cases/StepZero.vue'
import StepOne from '~/components/cases/StepOne.vue'
import StepThree from '~/components/cases/StepThree.vue'
import JawScans from '~/components/cases/JawScans.vue'
import ChiefComplaint from '~/components/cases/ChiefComplaint.vue'
import StepTwo from '~/components/cases/StepTwo.vue'
import StepFour from '~/components/cases/StepFour.vue'

const { token } = useAuth()
const route = useRoute()

// If caseId is in URL, skip Step 0
const parentIdFromUrl = route.query.caseId
const currentStep = ref(parentIdFromUrl ? 1 : 0)
const isSubmitting = ref(false)

const steps = [
  { title: 'Select Case', icon: 'fas fa-search', component: StepZero },
  { title: 'Patient Info', icon: 'fas fa-user-circle', component: StepOne },
  { title: 'Records', icon: 'fas fa-camera-retro', component: StepThree },
  { title: '3D Scan', icon: 'fas fa-cube', component: JawScans },
  { title: 'Plan', icon: 'fas fa-clipboard-list', component: ChiefComplaint },
  { title: 'Detailed Plan', icon: 'fas fa-tooth', component: StepTwo },
  { title: 'Summary', icon: 'fas fa-flag-checkered', component: StepFour }
]

const progressWidth = computed(() => {
  return `${(currentStep.value / (steps.length - 1)) * 100}%`
})

const currentStepComponent = computed(() => steps[currentStep.value].component)

// Initialize Form Data (Using camelCase for consistency with components)
const formData = ref({
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
  if (parentIdFromUrl) {
    try {
      console.log('Fetching parent case details for ID:', parentIdFromUrl)
      const response: any = await $fetch(`/api/doctor/case-profile/${parentIdFromUrl}`, {
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
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const submitRefinement = async () => {
  if (isSubmitting.value) return
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
      detailed_plan: JSON.stringify(formData.value.detailedPlan)
    }

    const dataResponse: any = await $fetch('/api/doctor/store-refinement', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' },
      body: payload
    })

    if (!dataResponse.success) throw new Error(dataResponse.message)
    const caseId = dataResponse.case_id

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
      title: 'Refinement Submitted!',
      text: 'The refinement case and all records have been uploaded successfully.',
      confirmButtonColor: '#10b981'
    }).then(() => {
      navigateTo('/dashboard')
    })

  } catch (error: any) {
    console.error('Submit error:', error)
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
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
