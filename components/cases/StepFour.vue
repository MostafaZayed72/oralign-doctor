<template>
  <div class="space-y-6">
    <div class="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <i class="fas fa-clipboard-check text-primary"></i> Summary & Review
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Review the details below before submitting the case.</p>
    </div>

    <!-- Summary Grid -->
    <div class="bg-gray-50 dark:bg-[#252525] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-6">
      
      <!-- Patient Section -->
      <div>
        <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Patient Information</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span class="block text-xs text-gray-500">First Name</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.firstName || '—' }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-500">Last Name</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.lastName || '—' }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-500">Gender</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.gender || '—' }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-500">DOB</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.dob || '—' }}</span>
          </div>
        </div>
      </div>

      <div class="h-px w-full bg-gray-200 dark:bg-gray-700"></div>

      <!-- Clinical Section -->
      <div>
        <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Clinical Preferences</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span class="block text-xs text-gray-500">Arch</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.treatmentArch }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-500">Midline</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.midline }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-500">Overjet</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.overjet }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-500">Overbite</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formData.overbite }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Important Notice -->
    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-4">
      <i class="fas fa-info-circle text-amber-500 text-xl mt-0.5"></i>
      <div>
        <h4 class="font-bold text-amber-800 dark:text-amber-500 text-sm">Please Note</h4>
        <p class="text-amber-700 dark:text-amber-600 text-xs mt-1">Once submitted, this case will be reviewed by our orthodontists. You will be notified when the treatment plan is ready for your approval.</p>
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
        @click="$emit('submit')"
        class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-10 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30 min-w-[140px] whitespace-nowrap"
      >
        <i class="fas fa-paper-plane text-sm"></i>
        <span>Submit Case</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  formData: { type: Object, required: true }
})
defineEmits(['prev', 'submit'])
</script>
