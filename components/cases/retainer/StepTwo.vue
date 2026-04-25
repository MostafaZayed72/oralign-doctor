<template>
  <div class="space-y-6">
    <div class="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <i class="fas fa-tooth text-primary"></i> Jaw Scans
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Specify jaw scan details and impression types.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Impression Type -->
      <div class="col-span-1 md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Impression Type</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label class="flex-1 cursor-pointer" @click.prevent="$emit('update', 'impressionType', '3d_scans')">
            <input type="radio" :value="'3d_scans'" :checked="formData.impressionType === '3d_scans'" class="peer sr-only" name="impressionType">
            <div class="rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4 text-center peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 peer-checked:text-emerald-600 font-medium transition-all h-full flex flex-col items-center justify-center gap-2">
              <i class="fas fa-cube text-2xl"></i>
              <span>3D Scans</span>
            </div>
          </label>
          <label class="flex-1 cursor-pointer" @click.prevent="$emit('update', 'impressionType', 'other')">
            <input type="radio" :value="'other'" :checked="formData.impressionType === 'other'" class="peer sr-only" name="impressionType">
            <div class="rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4 text-center peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 peer-checked:text-emerald-600 font-medium transition-all h-full flex flex-col items-center justify-center gap-2">
              <i class="fas fa-link text-2xl"></i>
              <span>STL Files Link</span>
            </div>
          </label>
          <label class="flex-1 cursor-pointer" @click.prevent="$emit('update', 'impressionType', 'clink_pickup')">
            <input type="radio" :value="'clink_pickup'" :checked="formData.impressionType === 'clink_pickup'" class="peer sr-only" name="impressionType">
            <div class="rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4 text-center peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 peer-checked:text-emerald-600 font-medium transition-all h-full flex flex-col items-center justify-center gap-2">
              <i class="fas fa-truck text-2xl"></i>
              <span>Clinic Pickup</span>
            </div>
          </label>
        </div>
      </div>

      <!-- STL Link (Conditional) -->
      <div v-if="formData.impressionType === 'other'" class="col-span-1 md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">STL Files Link <span class="text-red-500">*</span></label>
        <input 
          type="url" 
          :value="formData.stlFilesLink"
          @input="$emit('update', 'stlFilesLink', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          placeholder="https://link-to-your-scans.com/..."
        >
      </div>

      <!-- Arch -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Arch</label>
        <select 
          :value="formData.arch"
          @change="$emit('update', 'arch', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
        >
          <option value="Both">Both</option>
          <option value="Upper">Upper Only</option>
          <option value="Lower">Lower Only</option>
        </select>
      </div>

      <!-- Number of Sets -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Number of Sets</label>
        <select 
          :value="formData.numberOfSets"
          @change="$emit('update', 'numberOfSets', $event.target.value)"
          class="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
        >
          <option v-for="n in 5" :key="n" :value="n">{{ n }} Set(s)</option>
        </select>
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
        @click="validateAndNext"
        class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30 min-w-[140px] whitespace-nowrap"
      >
        <span>Next</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
const props = defineProps({
  formData: { type: Object, required: true }
})
const emit = defineEmits(['update', 'next', 'prev'])

const validateAndNext = () => {
  if (props.formData.impressionType === 'other' && !props.formData.stlFilesLink) {
    Swal.fire({
      title: 'Error!',
      text: 'Please provide the STL files link.',
      icon: 'error',
      confirmButtonColor: '#10b981'
    })
    return
  }
  emit('next')
}
</script>
