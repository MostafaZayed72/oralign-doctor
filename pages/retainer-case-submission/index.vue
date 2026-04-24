<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] pt-24 pb-12 transition-colors duration-300">
    <div class="container mx-auto px-4 max-w-5xl">
      
      <!-- Page Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Submit Retainer Or Replacement</h2>
        <p class="text-gray-500 dark:text-gray-400">Please fill in the details below to submit a new retainer case.</p>
      </div>

      <!-- Stepper / Progress -->
      <div class="mb-8">
        <div class="flex items-center justify-between relative px-10">
          <!-- Background Line -->
          <div class="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0"></div>
          <!-- Progress Line -->
          <div class="absolute left-10 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-500" :style="{ width: progressWidth }"></div>

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
import { useAuth } from '~/composables/useAuth'

import StepOne from '~/components/cases/retainer/StepOne.vue'
import StepTwo from '~/components/cases/retainer/StepTwo.vue'
import StepThree from '~/components/cases/retainer/StepThree.vue'
import Swal from 'sweetalert2'

const { token } = useAuth()
const currentStep = ref(0)
const isSubmitting = ref(false)

const steps = [
  { title: 'Patient Information', component: StepOne },
  { title: 'Jaw Scans', component: StepTwo },
  { title: 'Summary & Review', component: StepThree }
]

const progressWidth = computed(() => {
  return `${(currentStep.value / (steps.length - 1)) * 100}%`
})

const currentStepComponent = computed(() => steps[currentStep.value].component)

// Shared State
const formData = ref({
  // Step 1
  patientName: '',
  patientEmail: '',
  dob: '',
  addressId: '',
  
  // Step 2
  impressionType: '3d_scans', // 3d_scans, other, clink_pickup
  stlFilesLink: '',
  numberOfSets: '1',
  arch: 'Both'
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

  try {
    const response = await $fetch('/api/doctor/retainers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: 'application/json'
      },
      body: formData.value
    })

    Swal.fire({
      title: 'Success!',
      text: 'Retainer Case submitted successfully!',
      icon: 'success',
      confirmButtonColor: '#10b981'
    }).then(() => {
      navigateTo('/dashboard')
    })
  } catch (e: any) {
    console.error('Submit error:', e)
    Swal.fire({
      title: 'Error!',
      text: e?.data?.message || e?.message || 'Error submitting case',
      icon: 'error',
      confirmButtonColor: '#10b981'
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
