<template>
  <div class="space-y-6">
    <div class="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <i class="fas fa-user-circle text-primary"></i> Patient Information
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Please provide the basic details of the patient.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- First Name -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name <span class="text-red-500">*</span></label>
        <input 
          type="text" 
          :value="formData.firstName"
          @input="$emit('update', 'firstName', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          placeholder="Enter first name"
        >
      </div>

      <!-- Last Name -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name <span class="text-red-500">*</span></label>
        <input 
          type="text" 
          :value="formData.lastName"
          @input="$emit('update', 'lastName', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          placeholder="Enter last name"
        >
      </div>

      <!-- Gender -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gender <span class="text-red-500">*</span></label>
        <select 
          :value="formData.gender"
          @change="$emit('update', 'gender', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <!-- Date of Birth -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date of Birth <span class="text-red-500">*</span></label>
        <input 
          type="date" 
          :value="formData.dob"
          @input="$emit('update', 'dob', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        >
      </div>
      
      <!-- Chief Complaint -->
      <div class="col-span-1 md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Chief Complaint <span class="text-red-500">*</span></label>
        <textarea 
          :value="formData.chiefComplaint"
          @input="$emit('update', 'chiefComplaint', $event.target.value)"
          rows="4"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
          placeholder="Describe the main reason the patient is seeking aligner treatment..."
        ></textarea>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
      <button 
        @click="validateAndNext"
        class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30 min-w-[140px] whitespace-nowrap"
      >
        <span>Next Step</span>
        <i class="fas fa-arrow-right text-sm"></i>
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
  // basic validation logic can go here
  if (!props.formData.firstName || !props.formData.lastName || !props.formData.gender) {
    alert("Please fill in the required fields.")
    return
  }
  emit('next')
}
</script>
