<template>
  <div class="min-h-screen bg-gray-100 dark:bg-[#0f0f0f] pt-24 pb-12 transition-colors duration-300">
    <div class="container mx-auto px-4 max-w-7xl">

      <!-- Page Header -->
      <div class="mb-6">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{{ $t('dashboard_title') }}</h2>
        <nav class="flex text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
            <li class="inline-flex items-center">
              <NuxtLink :to="localePath('/')" class="hover:text-primary transition-colors">{{ $t('dashboard_title') }}</NuxtLink>
            </li>
            <li>
              <div class="flex items-center">
                <i class="fas fa-chevron-right rtl:rotate-180 mx-2 text-gray-400 text-xs"></i>
                <span class="text-gray-700 dark:text-gray-300">{{ authUser?.f_name }} {{ authUser?.l_name }} {{ $t('work_space') }}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Actions Bar (no card box) -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

        <!-- Submit Dropdown -->
        <div class="relative w-full md:w-auto" v-click-outside="() => showSubmitMenu = false">
          <button @click="showSubmitMenu = !showSubmitMenu"
            class="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-base shadow-lg shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300">
            <i class="fas fa-plus-square"></i>
            <span>{{ $t('submit') }}</span>
            <i class="fas fa-chevron-down text-xs ml-2 transition-transform duration-300" :class="{ 'rotate-180': showSubmitMenu }"></i>
          </button>
          <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
            <div v-show="showSubmitMenu" class="absolute z-50 mt-2 w-64 bg-white dark:bg-[#252525] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 left-0 rtl:left-auto rtl:right-0">
              <NuxtLink :to="localePath('/case-submission')" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-200">
                <i class="fas fa-upload text-primary w-5 text-center"></i>
                <span class="font-medium">{{ $t('new_case_aligner') }}</span>
              </NuxtLink>
              <div class="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
              <NuxtLink :to="localePath('/retainer-case-submission')" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-200">
                <i class="fas fa-cloud-upload-alt text-primary w-5 text-center"></i>
                <span class="font-medium">{{ $t('retainer') }}</span>
              </NuxtLink>
              <div class="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
              <NuxtLink :to="localePath('/refinement-submission')" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-200 text-start">
                <i class="fas fa-layer-group text-primary w-5 text-center"></i>
                <span class="font-medium">{{ $t('refinement') }}</span>
              </NuxtLink>
            </div>
          </transition>
        </div>

        <!-- Filter -->
        <div class="w-full md:w-64">
          <select v-model="statusFilter" class="w-full bg-white dark:bg-[#252525] dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:border-primary transition-colors font-medium cursor-pointer shadow-sm">
            <option value="All Cases">{{ $t('filter_all') }}</option>
            <option value="incomplete submission">{{ $t('filter_incomplete') }}</option>
            <option value="complete submission">{{ $t('filter_complete') }}</option>
            <option value="new impression needed">{{ $t('filter_impression') }}</option>
            <option value="intraoral photos needed">{{ $t('filter_intraoral') }}</option>
            <option value="extraoral photos needed">{{ $t('filter_extraoral') }}</option>
            <option value="treatment plan generated">{{ $t('filter_tp_generated') }}</option>
            <option value="shipping">{{ $t('filter_shipping') }}</option>
            <option value="delivered">{{ $t('filter_delivered') }}</option>
            <option value="cancel">{{ $t('filter_cancel') }}</option>
          </select>
        </div>
      </div>

      <!-- Cases Table Card -->
      <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">

        <!-- Title bar -->
        <div class="px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">{{ $t('all_cases') }}</h3>
            <p class="text-gray-400 dark:text-gray-500 text-sm mt-0.5">{{ $t('all_cases_subtitle') }}</p>
          </div>
          <span class="bg-primary/10 text-primary dark:bg-primary/20 text-sm font-bold px-4 py-1.5 rounded-full">
            {{ filteredCases.length }} {{ $t('case_word') }}
          </span>
        </div>

        <div v-if="pending" class="p-16 flex justify-center items-center">
          <i class="fas fa-spinner fa-spin text-4xl text-primary"></i>
        </div>

        <div v-else-if="!token" class="p-16 text-center">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-50 dark:bg-amber-900/20 mb-4">
            <i class="fas fa-lock text-3xl text-amber-400"></i>
          </div>
          <h4 class="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">{{ $t('please_login') }}</h4>
          <NuxtLink :to="localePath('/login')" class="inline-block mt-2 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">{{ $t('login') }}</NuxtLink>
        </div>

        <div v-else-if="fetchError" class="p-16 text-center">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
            <i class="fas fa-exclamation-triangle text-3xl text-red-400"></i>
          </div>
          <h4 class="text-lg font-bold text-gray-700 dark:text-gray-300">{{ $t('failed_load_cases') }}</h4>
          <p class="text-gray-400 text-sm mt-1">{{ fetchError }}</p>
        </div>

        <div v-else-if="filteredCases.length === 0" class="p-16 text-center">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-50 dark:bg-gray-800 mb-4">
            <i class="fas fa-folder-open text-3xl text-gray-400"></i>
          </div>
          <h4 class="text-lg font-bold text-gray-700 dark:text-gray-300">{{ $t('no_cases') }}</h4>
        </div>

        <div v-else class="table-wrapper overflow-x-auto">
          <table class="w-full text-center border-collapse dashboard-table">
            <thead>
              <tr>
                <th class="dashboard-th">{{ $t('col_uuid') }}</th>
                <th class="dashboard-th">{{ $t('col_patient') }}</th>
                <th class="dashboard-th">{{ $t('col_type') }}</th>
                <th class="dashboard-th">{{ $t('col_package') }}</th>
                <th class="dashboard-th">{{ $t('col_date') }}</th>
                <th class="dashboard-th">{{ $t('col_status') }}</th>
                <th class="dashboard-th">{{ $t('col_tp1') }}</th>
                <th class="dashboard-th">{{ $t('col_tp2') }}</th>
                <th class="dashboard-th">{{ $t('col_pdf') }}</th>
                <th class="dashboard-th">{{ $t('col_actions') || 'الإجراءات' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in filteredCases" :key="c.id" class="case-row">
                <td class="dashboard-td">
                  <NuxtLink :to="localePath(`/case-details/${c.id}`)" class="text-primary font-bold text-sm hover:underline cell-content">
                    {{ c.uuid || `Oralign-${c.id}` }}
                  </NuxtLink>
                </td>
                <td class="dashboard-td">
                  <NuxtLink :to="localePath(`/case-details/${c.id}`)" class="text-gray-800 dark:text-gray-200 font-semibold text-sm hover:text-primary transition-colors cell-content">
                    {{ c.patient_name }}
                  </NuxtLink>
                </td>
                <td class="dashboard-td text-gray-600 dark:text-gray-300 text-sm capitalize">
                  <span class="cell-content">{{ c.case_type }}</span>
                </td>
                <td class="dashboard-td text-gray-600 dark:text-gray-300 text-sm">
                  <span class="cell-content">{{ c.package_name || '—' }}</span>
                </td>
                <td class="dashboard-td text-gray-500 dark:text-gray-400 text-sm">
                  <span class="cell-content">{{ c.date_modified }}</span>
                </td>
                <td class="dashboard-td" :class="getStatusClass(c.status)">
                  <span class="text-white font-bold capitalize cell-content">{{ c.status }}</span>
                </td>
                <td class="dashboard-td" :class="c.treatment_plan1_status ? getTpClass(c.treatment_plan1_status) : ''">
                  <span v-if="c.treatment_plan1_status" class="text-white font-bold capitalize cell-content">{{ c.treatment_plan1_status }}</span>
                  <span v-else class="text-gray-400 dark:text-gray-600 text-sm font-bold cell-content">—</span>
                </td>
                <td class="dashboard-td" :class="c.treatment_plan2_status ? getTpClass(c.treatment_plan2_status) : ''">
                  <span v-if="c.treatment_plan2_status" class="text-white font-bold capitalize cell-content">{{ c.treatment_plan2_status }}</span>
                  <span v-else class="text-gray-400 dark:text-gray-600 text-sm font-bold cell-content">—</span>
                </td>
                <td class="dashboard-td bg-red-500">
                  <a :href="`https://doctors.oralign.co/doctor/case-pdf/${c.id}`" target="_blank" class="text-white font-bold flex items-center justify-center hover:underline cell-content">
                    <i class="fas fa-file-pdf mr-1"></i> PDF
                  </a>
                </td>
                <td class="dashboard-td">
                  <div class="flex items-center justify-center gap-3 cell-content">
                    <NuxtLink :to="localePath(`/case-details/${c.id}`)" class="text-blue-500 hover:text-blue-700 transition-colors transform hover:scale-110" :title="$t('view') || 'عرض'">
                      <i class="fas fa-eye text-lg"></i>
                    </NuxtLink>
                    <button @click.prevent="refineCase(c.id)" class="text-amber-500 hover:text-amber-700 transition-colors transform hover:scale-110" title="Edit">
                      <i class="fas fa-edit text-lg"></i>
                    </button>
                    <button @click.prevent="deleteCase(c.id)" class="text-red-500 hover:text-red-700 transition-colors transform hover:scale-110" :title="$t('delete') || 'حذف'">
                      <i class="fas fa-trash text-lg"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const { token, user: authUser } = useAuth()

const showSubmitMenu = ref(false)
const statusFilter = ref("All Cases")
const allCases = ref<any[]>([])
const pending = ref(false)
const fetchError = ref("")

const loadCases = async () => {
  if (!token.value) return
  pending.value = true
  fetchError.value = ""
  try {
    const response: any = await $fetch("/api/doctor/cases", {
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: "application/json",
      },
    })
    allCases.value = response?.data || []
  } catch (err: any) {
    fetchError.value = err?.data?.message || err?.message || "Unknown error"
  } finally {
    pending.value = false
  }
}

const filteredCases = computed(() => {
  if (statusFilter.value === "All Cases") return allCases.value
  return allCases.value.filter(
    (c: any) => c.status?.toLowerCase() === statusFilter.value.toLowerCase()
  )
})

const getStatusClass = (status: string) => {
  const s = status?.toLowerCase()
  if (s === "complete submission")   return "bg-emerald-500"
  if (s === "incomplete submission") return "bg-blue-500"
  if (s === "shipping")              return "bg-violet-500"
  if (s === "delivered")             return "bg-cyan-500"
  if (s === "cancel")                return "bg-red-500"
  return "bg-blue-400"
}

const getTpClass = (status: string) => {
  const s = status?.toLowerCase()
  if (s === "approved") return "bg-emerald-500"
  if (s === "modify")   return "bg-amber-500"
  if (s === "reject")   return "bg-red-500"
  return "bg-gray-400"
}

const vClickOutside = {
  mounted(el: any, binding: any) {
    el.__clickOutside = (e: Event) => { if (!el.contains(e.target)) binding.value() }
    document.body.addEventListener("click", el.__clickOutside)
  },
  unmounted(el: any) {
    document.body.removeEventListener("click", el.__clickOutside)
  },
}

import Swal from 'sweetalert2'

// Action Handlers
const editCase = (id: number) => {
  window.location.href = `https://doctors.oralign.co/doctor/case-details/${id}`
}

const refineCase = (id: number) => {
  navigateTo(localePath({ path: '/refinement-submission', query: { caseId: id } }))
}

const deleteCase = async (id: number) => {
  const result = await Swal.fire({
    title: useNuxtApp().$i18n.t('confirm_delete_title') || 'Are you sure?',
    text: useNuxtApp().$i18n.t('confirm_delete') || "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#ef4444',
    confirmButtonText: useNuxtApp().$i18n.t('yes_delete') || 'Yes, delete it!',
    cancelButtonText: useNuxtApp().$i18n.t('cancel') || 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      await $fetch(`/api/doctor/cases/${id}`, { 
        method: 'DELETE', 
        headers: { Authorization: `Bearer ${token.value}` } 
      })
      
      allCases.value = allCases.value.filter(c => c.id !== id)
      
      Swal.fire({
        title: 'Deleted!',
        text: 'Case has been deleted.',
        icon: 'success',
        confirmButtonColor: '#10b981'
      })
    } catch (e) {
      console.error(e)
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete case.',
        icon: 'error',
        confirmButtonColor: '#10b981'
      })
    }
  }
}

onMounted(() => loadCases())
</script>

<style scoped>
/* ── Table scroll ── */
.table-wrapper { scrollbar-width: thin; scrollbar-color: #CBD5E1 transparent; }
.table-wrapper::-webkit-scrollbar { height: 6px; }
.table-wrapper::-webkit-scrollbar-track { background: transparent; }
.table-wrapper::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 20px; }

/* ── 3D Status Box ── */
.status-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 108px;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  color: white;
  text-transform: capitalize;
  letter-spacing: 0.03em;
  white-space: nowrap;
  cursor: default;
  position: relative;
  box-shadow:
    0 4px 0 rgba(0, 0, 0, 0.18),
    0 8px 24px rgba(0, 0, 0, 0.13);
  background-color: inherit;
  transform: scale(1);
  transition:
    transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}
.status-box:hover {
  transform: scale(1.13);
  z-index: 2;
  box-shadow:
    0 8px 0 rgba(0, 0, 0, 0.18),
    0 18px 32px rgba(0, 0, 0, 0.18);
}

/* PDF link inherits 3D style */
.status-pdf {
  background-color: #ef4444 !important;
  text-decoration: none;
  cursor: pointer;
}
.status-pdf:hover {
  background-color: #dc2626 !important;
}

/* ألوان status-box حسب الحالة */
.bg-emerald-500 { background-color: #10b981 !important; }
.bg-blue-500    { background-color: #3b82f6 !important; }
.bg-violet-500  { background-color: #8b5cf6 !important; }
.bg-cyan-500    { background-color: #06b6d4 !important; }
.bg-red-500     { background-color: #ef4444 !important; }
.bg-blue-400    { background-color: #60a5fa !important; }
.bg-amber-500   { background-color: #f59e42 !important; }
.bg-gray-400    { background-color: #9ca3af !important; }

/* ── Table Styling to match screenshot ── */
.dashboard-table {
  border-collapse: collapse;
}

.dashboard-th {
  background-color: #10b981; /* Green Header */
  color: #ffffff;
  padding: 16px 12px;
  border: 1px solid #e5e7eb;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.dark .dashboard-th {
  background-color: #059669; /* Darker Green for Dark Mode */
  border-color: #374151;
}

.dashboard-td {
  padding: 16px 12px;
  border: 1px solid #e5e7eb;
  vertical-align: middle;
  transition: box-shadow 0.3s ease;
  /* 3D Tile effect using inset shadows */
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.7), inset -2px -2px 5px rgba(0, 0, 0, 0.05);
}

.dashboard-td:hover {
  /* تعميق الـ 3D عند الـ Hover وإضافة تظليل خفيف */
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.9), inset -2px -2px 5px rgba(0, 0, 0, 0.1), inset 0 0 0 9999px rgba(0, 0, 0, 0.02);
  cursor: default;
}

.dark .dashboard-td {
  border-color: #374151;
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.03), inset -2px -2px 5px rgba(0, 0, 0, 0.2);
}

.dark .dashboard-td:hover {
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.05), inset -2px -2px 5px rgba(0, 0, 0, 0.3), inset 0 0 0 9999px rgba(255, 255, 255, 0.02);
}

/* حركة زوم سلسة للكلام فقط داخل المربع */
.cell-content {
  display: inline-block;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}

.dashboard-td:hover .cell-content {
  transform: scale(1.12);
}

/* Alternating Column Colors to fill the square completely */
.dashboard-table td:nth-child(odd) {
  background-color: #ffffff;
}

.dashboard-table td:nth-child(even) {
  background-color: #fff8f1; /* Light Orange/Beige */
}

.dark .dashboard-table td:nth-child(odd) {
  background-color: #1a1a1a;
}

.dark .dashboard-table td:nth-child(even) {
  background-color: #26211d;
}

/* لا تغيير لون الصف عند hover */
.case-row { transition: none; }
</style>
