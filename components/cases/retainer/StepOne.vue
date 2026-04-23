<template>
  <div class="space-y-6">
    <div class="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <i class="fas fa-user-circle text-primary"></i> Patient Information
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Provide details for the retainer patient.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Patient Name -->
      <div class="col-span-1 md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Patient Name <span class="text-red-500">*</span></label>
        <input 
          type="text" 
          :value="formData.patientName"
          @input="$emit('update', 'patientName', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          placeholder="Enter patient full name"
        >
      </div>

      <!-- Patient Email -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Patient Email (optional)</label>
        <input 
          type="email" 
          :value="formData.patientEmail"
          @input="$emit('update', 'patientEmail', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          placeholder="Enter email"
        >
      </div>

      <!-- Date of Birth -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date of Birth (optional)</label>
        <input 
          type="date" 
          :value="formData.dob"
          @input="$emit('update', 'dob', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        >
      </div>
      
      <!-- Shipping Address -->
      <div class="col-span-1 md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex justify-between">
          <span>Shipping Address</span>
          <a href="#" class="text-emerald-500 hover:text-emerald-600 text-xs">(Add New Shipping Address)</a>
        </label>
        <select 
          :value="formData.addressId"
          @change="$emit('update', 'addressId', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>Choose One</option>
          <option value="1">Clinic Address 1 - Main Branch</option>
          <option value="2">Clinic Address 2 - City Center</option>
        </select>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
      <button 
        @click="validateAndNext"
        class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30 min-w-[140px] whitespace-nowrap"
      >
        <span>Next</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  formData: { type: Object, required: true }
})
const emit = defineEmits(['update', 'next'])

const validateAndNext = () => {
  if (!props.formData.patientName) {
    alert("Please enter the Patient Name.")
    return
  }
  emit('next')
}
</script>
