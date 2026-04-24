<template>
  <div class="space-y-6">
    <div class="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <i class="fas fa-camera text-primary"></i> Photos & X-Rays
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload the required patient intraoral/extraoral photos and X-rays.</p>
    </div>

    <!-- Upload Area -->
    <div class="space-y-8">
      
      <!-- Photos -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Clinical Photos (Max 8)</label>
        <div @click="triggerPhotosClick" class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer flex flex-col items-center justify-center">
          <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-cloud-upload-alt text-2xl"></i>
          </div>
          <h4 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Click to upload or drag & drop</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          <input ref="photosInput" type="file" multiple accept="image/*" class="hidden" @change="handlePhotosChange" />
          
          <button @click.stop="triggerPhotosClick" class="mt-6 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 px-6 rounded-xl hover:shadow-md transition-all">
            Browse Files
          </button>
        </div>
        <!-- Selected Photos Preview -->
        <div v-if="formData.photos && formData.photos.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="(file, index) in formData.photos" :key="index" class="relative group bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center text-center overflow-hidden border border-gray-200 dark:border-gray-700">
            <i class="fas fa-image text-emerald-500 text-2xl mb-2"></i>
            <span class="text-xs text-gray-600 dark:text-gray-300 truncate w-full px-1">{{ file.name }}</span>
            <button @click.stop="removePhoto(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- X-Rays -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">X-Rays (Panoramic / Cephalometric)</label>
        <div @click="triggerXRaysClick" class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer flex flex-col items-center justify-center">
          <div class="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-x-ray text-2xl"></i>
          </div>
          <h4 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Click to upload X-Rays</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">JPG, PNG or PDF formats</p>
          <input ref="xRaysInput" type="file" multiple accept="image/*,.pdf" class="hidden" @change="handleXRaysChange" />
        </div>
        <!-- Selected X-Rays Preview -->
        <div v-if="formData.xrays && formData.xrays.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="(file, index) in formData.xrays" :key="index" class="relative group bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center text-center overflow-hidden border border-gray-200 dark:border-gray-700">
            <i class="fas fa-file-pdf text-blue-500 text-2xl mb-2"></i>
            <span class="text-xs text-gray-600 dark:text-gray-300 truncate w-full px-1">{{ file.name }}</span>
            <button @click.stop="removeXRay(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Actions -->
    <div class="flex justify-between pt-6 mt-8 border-t border-gray-100 dark:border-gray-800">
      <button 
        @click="$emit('prev')"
        class="bg-white dark:bg-[#252525] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
      >
        <i class="fas fa-arrow-left text-sm"></i>
        <span>Back</span>
      </button>
      
      <button 
        @click="$emit('next')"
        class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30 min-w-[140px] whitespace-nowrap"
      >
        <span>Next Step</span>
        <i class="fas fa-arrow-right text-sm"></i>
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

const photosInput = ref<HTMLInputElement | null>(null)
const xRaysInput = ref<HTMLInputElement | null>(null)

// Initialize arrays if they don't exist
if (!props.formData.photos) props.formData.photos = []
if (!props.formData.xrays) props.formData.xrays = []

const triggerPhotosClick = () => {
  if (photosInput.value) photosInput.value.click()
}

const triggerXRaysClick = () => {
  if (xRaysInput.value) xRaysInput.value.click()
}

const handlePhotosChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const newFiles = Array.from(target.files)
    const combined = [...(props.formData.photos || []), ...newFiles]
    // Limit to max 8 photos
    const limited = combined.slice(0, 8)
    emit('update', 'photos', limited)
    // Reset input
    if (photosInput.value) photosInput.value.value = ''
  }
}

const handleXRaysChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const newFiles = Array.from(target.files)
    const combined = [...(props.formData.xrays || []), ...newFiles]
    emit('update', 'xrays', combined)
    // Reset input
    if (xRaysInput.value) xRaysInput.value.value = ''
  }
}

const removePhoto = (index: number) => {
  const newPhotos = [...props.formData.photos]
  newPhotos.splice(index, 1)
  emit('update', 'photos', newPhotos)
}

const removeXRay = (index: number) => {
  const newXRays = [...props.formData.xrays]
  newXRays.splice(index, 1)
  emit('update', 'xrays', newXRays)
}
</script>
