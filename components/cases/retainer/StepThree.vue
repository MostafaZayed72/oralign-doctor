<template>
  <div class="space-y-6">
    <div class="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <i class="fas fa-clipboard-check text-primary"></i> Summary & Review
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Review the retainer details before submitting.</p>
    </div>

    <!-- Summary Grid -->
    <div class="bg-gray-50 dark:bg-[#252525] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-6">
      
      <!-- Patient Section -->
      <div>
        <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Patient Information</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span class="block text-xs text-gray-500">Patient Name</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.patientName || '—' }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-500">Email</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.patientEmail || '—' }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-500">DOB</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.dob || '—' }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-500">Shipping Address</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.addressId || '—' }}</span>
          </div>
        </div>
      </div>

      <div class="h-px w-full bg-gray-200 dark:bg-gray-700"></div>

      <!-- Jaw Scans Section -->
      <div>
        <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Jaw Scans & Details</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span class="block text-xs text-gray-500">Impression Type</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formattedImpressionType }}</span>
          </div>
          <div v-if="formData.impressionType === 'other'">
            <span class="block text-xs text-gray-500">STL Link</span>
            <a :href="formData.stlFilesLink" target="_blank" class="font-semibold text-emerald-500 hover:underline truncate block">Link</a>
          </div>
          <div>
            <span class="block text-xs text-gray-500">Arch</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.arch }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-500">Number of Sets</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.numberOfSets }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Important Notice -->
    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-4">
      <i class="fas fa-info-circle text-amber-500 text-xl mt-0.5"></i>
      <div>
        <h4 class="font-bold text-amber-800 dark:text-amber-500 text-sm">Submission Complete</h4>
        <p class="text-amber-700 dark:text-amber-600 text-xs mt-1">Once submitted, this retainer order will be sent to our lab for processing.</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between pt-6 mt-8 border-t border-gray-100 dark:border-gray-800">
      <button 
        @click="$emit('prev')"
        :disabled="isSubmitting"
        class="bg-white dark:bg-[#252525] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="fas fa-arrow-left text-sm"></i>
        <span>Back</span>
      </button>
      
      <button 
        @click="$emit('submit')"
        :disabled="isSubmitting"
        class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-10 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30 min-w-[140px] whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:-translate-y-0"
      >
        <i v-if="isSubmitting" class="fas fa-spinner fa-spin text-sm"></i>
        <i v-else class="fas fa-paper-plane text-sm"></i>
        <span>{{ isSubmitting ? 'Submitting...' : 'Submit Case' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false }
})
defineEmits(['prev', 'submit'])

const formattedImpressionType = computed(() => {
  switch (props.formData.impressionType) {
    case '3d_scans': return '3D Scans'
    case 'other': return 'STL Link'
    case 'clink_pickup': return 'Clinic Pickup'
    default: return props.formData.impressionType
  }
})
</script>
