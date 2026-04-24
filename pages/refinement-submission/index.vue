<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] pt-24 pb-12 transition-colors duration-300">
    <div class="container mx-auto px-4 max-w-4xl">
      
      <!-- Page Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{{ $t('refinement') }}</h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium">{{ $t('refinement_subtitle') || 'Submit a refinement request for an existing case.' }}</p>
        </div>
        <NuxtLink :to="localePath('/dashboard')" class="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors font-bold">
          <i class="fas fa-arrow-left text-sm"></i>
          <span>{{ $t('back_to_dashboard') || 'Back to Dashboard' }}</span>
        </NuxtLink>
      </div>

      <!-- Refinement Form Card -->
      <div class="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-10 relative overflow-hidden">
        <!-- Background Decoration -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

        <form @submit.prevent="handleSubmit" class="relative z-10 space-y-8">
          
          <!-- Select Case -->
          <div class="space-y-4">
            <label class="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{{ $t('select_case') || 'Select Case' }}</label>
            <div class="relative group">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                <i class="fas fa-folder-open"></i>
              </div>
              <select 
                v-model="formData.patient_case_id"
                required
                class="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all appearance-none"
              >
                <option value="" disabled>{{ $t('choose_case') || 'Choose a case...' }}</option>
                <option v-for="c in cases" :key="c.id" :value="c.id">
                  {{ c.uuid }} - {{ c.patient }}
                </option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-4">
            <label class="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{{ $t('clinical_notes') || 'Refinement Description / Notes' }}</label>
            <textarea 
              v-model="formData.note"
              required
              rows="5"
              :placeholder="$t('describe_refinement') || 'Please describe the required changes or improvements...'"
              class="w-full px-6 py-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all resize-none"
            ></textarea>
          </div>

          <!-- Photo Upload Area -->
          <div class="space-y-6">
            <label class="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{{ $t('new_photos') || 'New Photos (Intraoral/Extraoral)' }}</label>
            
            <div 
              @click="triggerUpload"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              class="border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer group"
              :class="[
                isDragging ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800/50'
              ]"
            >
              <div class="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <i class="fas fa-cloud-upload-alt text-3xl"></i>
              </div>
              <h4 class="text-xl font-black text-slate-900 dark:text-white mb-2">{{ $t('upload_photos_title') || 'Click to upload or drag & drop' }}</h4>
              <p class="text-slate-500 dark:text-slate-400 font-medium">{{ $t('upload_photos_limit') || 'Upload up to 8 high-quality clinical photos' }}</p>
              <input 
                ref="fileInput" 
                type="file" 
                multiple 
                accept="image/*" 
                class="hidden" 
                @change="handleFileChange" 
              />
            </div>

            <!-- Previews -->
            <div v-if="formData.photos.length > 0" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              <div v-for="(file, index) in formData.photos" :key="index" class="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <img :src="file.preview" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button @click.prevent="removePhoto(index)" class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-6">
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-5 bg-brand-primary hover:bg-brand-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-brand-primary/30 transform hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              <span v-if="!isSubmitting">{{ $t('submit_refinement') || 'Submit Refinement Request' }}</span>
              <span v-else class="flex items-center justify-center gap-3">
                <i class="fas fa-circle-notch fa-spin"></i>
                {{ $t('submitting') || 'Submitting...' }}
              </span>
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

const { token } = useAuth()
const config = useRuntimeConfig()
const localePath = useLocalePath()
const { t } = useI18n()

const isDragging = ref(false)
const isSubmitting = ref(false)
const fileInput = ref(null)
const cases = ref([])

const formData = ref({
  patient_case_id: '',
  note: '',
  photos: []
})

// Fetch doctor's cases for selection
onMounted(async () => {
  try {
    const response = await $fetch(`${config.public.apiProxyBase}/cases`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (response?.success) {
      cases.value = response.data || []
      
      // If we have a caseId in the URL, pre-select it
      const route = useRoute()
      if (route.query.caseId) {
        formData.value.patient_case_id = parseInt(route.query.caseId)
      }
    }
  } catch (error) {
    console.error('Failed to fetch cases', error)
  }
})

const triggerUpload = () => fileInput.value.click()

const handleFileChange = (e) => {
  const files = Array.from(e.target.files)
  addFiles(files)
}

const handleDrop = (e) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  addFiles(files)
}

const addFiles = (files) => {
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        formData.value.photos.push({
          file,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  })
}

const removePhoto = (index) => {
  formData.value.photos.splice(index, 1)
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    const body = new FormData()
    body.append('patient_case_id', formData.value.patient_case_id)
    body.append('note', formData.value.note)
    
    formData.value.photos.forEach((p, index) => {
      body.append(`photos[${index}]`, p.file)
    })

    const response = await $fetch(`${config.public.apiProxyBase}/saveReplacementRequest`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body
    })

    if (response?.success || response?.status === 'success') {
      Swal.fire({
        title: t('success') || 'Success!',
        text: t('refinement_submitted') || 'Refinement request has been submitted successfully.',
        icon: 'success',
        confirmButtonColor: '#063c31'
      })
      navigateTo(localePath('/dashboard'))
    }
  } catch (error) {
    Swal.fire({
      title: t('error') || 'Error',
      text: error?.data?.message || t('submission_failed') || 'Failed to submit request.',
      icon: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.zoom-in-95 {
  transform: scale(0.95);
}
</style>
