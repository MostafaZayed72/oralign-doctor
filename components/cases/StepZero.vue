<template>
  <div class="space-y-6">
    <div class="text-center mb-8">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Select Case for Refinement</h3>
      <p class="text-gray-500 dark:text-gray-400 text-sm">Choose the existing case you want to refine</p>
    </div>

    <!-- Search / Filter -->
    <div class="relative max-w-md mx-auto mb-6">
      <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i class="fas fa-search text-gray-400"></i>
      </span>
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Search by patient name or ID..." 
        class="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      />
    </div>

    <!-- Cases List -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <i class="fas fa-circle-notch fa-spin text-3xl text-emerald-500 mb-4"></i>
      <p class="text-gray-500">Fetching cases...</p>
    </div>

    <div v-else-if="filteredCases.length === 0" class="text-center py-20">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-folder-open text-gray-400 text-xl"></i>
      </div>
      <p class="text-gray-500">No cases found.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
      <button 
        v-for="caseItem in filteredCases" 
        :key="caseItem.id"
        @click="selectCase(caseItem)"
        class="flex items-center p-4 border rounded-2xl transition-all duration-300 text-left group"
        :class="[
          selectedId === caseItem.id 
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 ring-1 ring-emerald-500' 
            : 'border-gray-100 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-[#252525]'
        ]"
      >
        <div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
          <i class="fas fa-user text-gray-400" :class="{'text-emerald-500': selectedId === caseItem.id}"></i>
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-gray-800 dark:text-gray-100">{{ caseItem.patient_name }}</h4>
          <p class="text-xs text-gray-500">ID: #{{ caseItem.id }} | {{ caseItem.case_type }}</p>
        </div>
        <div v-if="selectedId === caseItem.id" class="text-emerald-500">
          <i class="fas fa-check-circle text-xl"></i>
        </div>
      </button>
    </div>

    <!-- Navigation -->
    <div class="mt-8 flex justify-end">
      <button 
        @click="$emit('next')"
        :disabled="!selectedId"
        class="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all flex items-center space-x-2"
      >
        <span>Continue</span>
        <i class="fas fa-arrow-right text-xs"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true }
})

const emit = defineEmits(['update', 'next'])

const cases = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedId = ref(props.formData.parent_id)

const { token } = useAuth()

onMounted(async () => {
  try {
    const response: any = await $fetch('/api/doctor/cases', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (response?.success) {
      cases.value = response.data || []
    }
  } catch (e) {
    console.error('Failed to load cases:', e)
  } finally {
    loading.value = false
  }
})

const filteredCases = computed(() => {
  if (!searchQuery.value) return cases.value
  const query = searchQuery.value.toLowerCase()
  return cases.value.filter(c => 
    c.patient_name?.toLowerCase().includes(query) || 
    c.id.toString().includes(query)
  )
})

const selectCase = (caseItem: any) => {
  selectedId.value = caseItem.id
  emit('update', 'parent_id', caseItem.id)
  
  // Also pre-fill patient name if possible
  const names = caseItem.patient_name?.split(' ') || []
  emit('update', 'first_name', names[0] || '')
  emit('update', 'last_name', names.slice(1).join(' ') || '')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #10b98144;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #10b98166;
}
</style>
