<template>
  <div class="space-y-6">
    <div class="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <i class="fas fa-stethoscope text-primary"></i> Clinical Details
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Specify treatment preferences and instructions.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Treatment Arch -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Treatment Arch</label>
        <div class="flex gap-4">
          <label class="flex-1 cursor-pointer" @click.prevent="$emit('update', 'treatmentArch', 'Both')">
            <input type="radio" :value="'Both'" :checked="formData.treatmentArch === 'Both'" class="peer sr-only" name="arch">
            <div class="rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-center peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 peer-checked:text-emerald-600 font-medium transition-all">Both</div>
          </label>
          <label class="flex-1 cursor-pointer" @click.prevent="$emit('update', 'treatmentArch', 'Upper')">
            <input type="radio" :value="'Upper'" :checked="formData.treatmentArch === 'Upper'" class="peer sr-only" name="arch">
            <div class="rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-center peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 peer-checked:text-emerald-600 font-medium transition-all">Upper Only</div>
          </label>
          <label class="flex-1 cursor-pointer" @click.prevent="$emit('update', 'treatmentArch', 'Lower')">
            <input type="radio" :value="'Lower'" :checked="formData.treatmentArch === 'Lower'" class="peer sr-only" name="arch">
            <div class="rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-center peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 peer-checked:text-emerald-600 font-medium transition-all">Lower Only</div>
          </label>
        </div>
      </div>

      <!-- Midline -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Midline</label>
        <select 
          :value="formData.midline"
          @change="$emit('update', 'midline', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        >
          <option>Maintain</option>
          <option>Improve</option>
          <option>Correct Completely</option>
        </select>
      </div>

      <!-- Overjet -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Overjet</label>
        <select 
          :value="formData.overjet"
          @change="$emit('update', 'overjet', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        >
          <option>Maintain</option>
          <option>Improve</option>
          <option>Ideal</option>
        </select>
      </div>

      <!-- Overbite -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Overbite</label>
        <select 
          :value="formData.overbite"
          @change="$emit('update', 'overbite', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        >
          <option>Maintain</option>
          <option>Improve</option>
          <option>Ideal</option>
        </select>
      </div>
      
      <!-- Additional Instructions -->
      <div class="col-span-1 md:col-span-2 mt-4">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Additional Clinical Instructions</label>
        <textarea 
          :value="formData.additionalInstructions"
          @input="$emit('update', 'additionalInstructions', $event.target.value)"
          rows="3"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
          placeholder="Any specific instructions for the treatment planners?"
        ></textarea>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
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
defineProps({
  formData: { type: Object, required: true }
})
defineEmits(['update', 'next', 'prev'])
</script>
