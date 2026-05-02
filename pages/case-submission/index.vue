<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] pt-24 pb-12 transition-colors duration-300">
    <div class="container mx-auto px-4 max-w-5xl">
      
      <!-- Page Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ $t('new_case_submission') || 'New Case Submission' }}</h2>
        <p class="text-gray-500 dark:text-gray-400">{{ $t('case_submission_subtitle') || 'Please fill in the details below to submit a new aligner case.' }}</p>
      </div>

      <!-- Stepper / Progress -->
      <div class="mb-8">
        <div class="flex items-center justify-between relative">
          <!-- Background Line -->
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0"></div>
          <!-- Progress Line -->
          <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-500" :style="{ width: progressWidth }"></div>

          <!-- Step Indicators -->
          <div v-for="(step, index) in steps" :key="index" class="relative z-10 flex flex-col items-center group">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md"
              :class="[
                currentStep > index ? 'bg-emerald-500 text-white border-2 border-emerald-500' : 
                currentStep === index ? 'bg-white dark:bg-[#1a1a1a] text-emerald-500 border-2 border-emerald-500 scale-110' : 
                'bg-white dark:bg-[#252525] text-gray-400 border-2 border-gray-200 dark:border-gray-700'
              ]"
            >
              <i v-if="currentStep > index" class="fas fa-check"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="mt-3 text-xs font-semibold whitespace-nowrap transition-colors duration-300"
                 :class="currentStep >= index ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'">
              {{ step.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-6 md:p-8 overflow-hidden transition-all duration-500 min-h-[400px] relative">
        
        <transition name="slide-fade" mode="out-in">
          <component 
            :is="currentStepComponent" 
            :form-data="formData" 
            :is-submitting="isSubmitting"
            @update="updateFormData"
            @next="nextStep"
            @prev="prevStep"
            @submit="submitCase"
          />
        </transition>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const { token } = useAuth()
import StepOne from '~/components/cases/StepOne.vue'
import StepTwo from '~/components/cases/StepTwo.vue'
import StepThree from '~/components/cases/StepThree.vue'
import JawScans from '~/components/cases/JawScans.vue'
import ChiefComplaint from '~/components/cases/ChiefComplaint.vue'
import StepFour from '~/components/cases/StepFour.vue'
import Swal from 'sweetalert2'

const currentStep = ref(0)
const isSubmitting = ref(false)

const steps = [
  { title: 'Patient Information', component: StepOne },
  { title: 'Patient Records', component: StepThree },
  { title: 'Jaw Scans', component: JawScans },
  { title: 'Chief Complaint', component: ChiefComplaint },
  { title: 'Detailed Plan', component: StepTwo },
  { title: 'Case Summary', component: StepFour }
]

const progressWidth = computed(() => {
  return `${(currentStep.value / (steps.length - 1)) * 100}%`
})

const currentStepComponent = computed(() => steps[currentStep.value].component)

// Shared State
const formData = ref({
  // Step 1: Patient Information
  first_name: '',
  last_name: '',
  gender: '',
  dob: '',
  
  // Step 2: Patient Records
  recordFiles: {},

  // Step 3: Jaw Scans
  impressionType: 'upload', // 'upload', 'link', 'pickup'
  stlFiles: { lower: null, upper: null },
  stlLinks: '',
  pickupAddress: '',

  // Step 4: Chief Complaint & Package
  chiefComplaint: '',
  additionalNotes: '',
  packageType: 'Basic', // 'Basic', 'Plus', 'Pro'
  hasPrimaryTeeth: false,
  treatmentArch: 'Both', // 'Both', 'Upper', 'Lower'

  // Step 5: Detailed Plan
  detailedPlan: {
    apDiscrepancy: {},
    verticalDiscrepancy: {},
    transverseDiscrepancy: {},
    crowdingSpacing: {},
    elastics: { selectedTeeth: [], notes: '' },
    biteRamps: { group: '', selectedTeeth: [], notes: '' },
    pontics: { selectedTeeth: [], notes: '' },
    attachments: { selectedTeeth: [], beforeStep: '' },
    toothSizeDiscrepancy: { option: '', notes: '' },
    archExpansion: { group: '', selectedTeeth: [], notes: '' },
    extraction: { selectedTeeth: [] },
    ipr: { selectedTeeth: [], notes: '' },
    eruptionSpace: {},
    movementRestrictions: {},
    passiveAligner: {},
    overcorrection: {}
  },
  additionalInstructions: '',
})

const updateFormData = (key: string, value: any) => {
  formData.value[key] = value
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

const submitCase = async () => {
  if (!token.value) {
    Swal.fire({
      title: 'Error!',
      text: 'You are not logged in. Please login first.',
      icon: 'error',
      confirmButtonColor: '#10b981'
    })
    return
  }

  isSubmitting.value = true
  Swal.fire({ title: 'Submitting...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })

  try {
    // Stage 1: Send Text Data (JSON is more reliable for text fields)
    const dataResponse: any = await $fetch('/api/doctor/cases', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token.value}`, 
        Accept: 'application/json' 
      },
      body: {
        first_name: formData.value.first_name,
        last_name: formData.value.last_name,
        patient_name: `${formData.value.first_name} ${formData.value.last_name}`,
        gender: formData.value.gender,
        dob: formData.value.dob,
        chief_complaint: formData.value.chiefComplaint,
        treatment_arch: formData.value.treatmentArch,
        additional_instructions: formData.value.additionalNotes,
        package_id: formData.value.packageType === 'Pro' ? 3 : (formData.value.packageType === 'Plus' ? 2 : 1),
        has_primary_teeth: formData.value.hasPrimaryTeeth ? '1' : '0',
        impression_type: formData.value.impressionType,
        stl_links: formData.value.stlLinks,
        pickup_address: formData.value.pickupAddress,
        detailed_plan: JSON.stringify(formData.value.detailedPlan)
      }
    })

    const caseId = dataResponse.case_id

    // Stage 2: Upload Files ONE BY ONE (to bypass server payload limits)
    
    // 1. Upload Clinical Photos
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
    
    // 2. Upload STL Files
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
      title: 'Case Submitted!',
      text: 'The case and files have been successfully uploaded.',
      confirmButtonColor: '#10b981'
    }).then(() => {
      navigateTo('/dashboard')
    })

  } catch (error: any) {
    console.error('Submit error:', error)
    const errorMsg = error.data?.message || 'An error occurred while submitting the case.'
    
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error.status === 413 ? 'The files are too large for the server. Please try smaller files or contact support.' : errorMsg,
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
