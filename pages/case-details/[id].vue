<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] pt-24 pb-12 transition-colors duration-300">
    <div class="container mx-auto px-4 max-w-7xl">
      
      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col items-center justify-center min-h-[60vh]">
        <div class="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-slate-900 dark:text-slate-400 font-bold animate-pulse">{{ $t('loading_case_data') || 'جاري تحميل بيانات المريض...' }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-xl max-w-2xl mx-auto">
        <div class="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-exclamation-triangle text-3xl"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">{{ $t('error_occurred') || 'Error Occurred' }}</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-8">{{ error }}</p>
        <NuxtLink :to="localePath('/dashboard')" class="inline-flex items-center gap-2 px-8 py-3 bg-brand-primary text-white font-bold rounded-2xl hover:scale-105 transition-transform">
          <i class="fas fa-arrow-left"></i>
          {{ $t('back_to_dashboard') }}
        </NuxtLink>
      </div>

      <!-- Content -->
      <div v-else-if="caseData" class="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        <!-- Header / Quick Info -->
        <div class="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/5 rounded-full blur-3xl"></div>
          
          <div class="flex items-center gap-6 relative z-10">
            <div class="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner border border-slate-200 dark:border-slate-700 overflow-hidden">
              <i class="fas fa-hospital-user text-4xl mt-2"></i>
            </div>
            <div>
              <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-1 uppercase">{{ caseData.case.patient_name }}</h1>
              <div class="flex flex-wrap items-center gap-3">
                <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-black tracking-widest uppercase border border-slate-200 dark:border-slate-700">
                  UUID: {{ caseData.case.uuid }}
                </span>
                <span :class="getStatusClass(caseData.case.status)" class="px-3 py-1 rounded-full text-white text-xs font-black tracking-widest uppercase">
                  {{ caseData.case.status }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 relative z-10">
            <button @click="refineCase" class="flex-1 md:flex-none px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
              <i class="fas fa-layer-group"></i>
              {{ $t('refinement') }}
            </button>
            <button class="flex-1 md:flex-none px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
              <i class="fas fa-edit"></i>
              {{ $t('edit') }}
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap border"
            :class="[
              activeTab === tab.id 
                ? 'bg-[#005f59] !text-white shadow-xl shadow-[#005f59]/20 scale-105 border-[#005f59]' 
                : 'bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
          >
            {{ $t(tab.id) || tab.title }}
          </button>
        </div>

        <!-- Main Layout Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Left Column: Tab Content -->
          <div class="lg:col-span-8 space-y-8">
            <div class="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8 min-h-[500px]">
              
              <!-- Details Tab -->
              <div v-if="activeTab === 'details'" class="animate-in fade-in duration-500">
                <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <i class="fas fa-info-circle text-brand-primary"></i>
                  {{ $t('patient_case_informations') || 'Patient Case Informations' }}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-for="(val, label) in detailedInfo" :key="label" class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 transition-all hover:border-brand-primary/30">
                    <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">{{ label }}</p>
                    <p class="text-lg font-bold text-slate-900 dark:text-white">{{ val || '—' }}</p>
                  </div>
                </div>
              </div>

              <!-- Records Tab -->
              <div v-if="activeTab === 'records'" class="animate-in fade-in duration-500">
                <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <i class="fas fa-camera text-brand-primary"></i>
                  {{ $t('patient_records') || 'Patient Records' }}
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  <div v-for="(img, key) in recordImages" :key="key" class="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    <img v-if="img" :src="`https://doctors.oralign.co/impressions/xraysphotos/${img}`" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                      <i class="fas fa-image text-3xl mb-2"></i>
                      <span class="text-[10px] font-black uppercase tracking-tighter">{{ key }}</span>
                    </div>
                    <div v-if="img" class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button @click="viewImage(img)" class="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-110 transition-transform">
                        <i class="fas fa-eye"></i>
                      </button>
                      <a :href="`https://doctors.oralign.co/doctor/downloadXRaysPhotoFile/${img}`" class="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center hover:scale-110 transition-transform">
                        <i class="fas fa-download"></i>
                      </a>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 py-2 text-center text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest border-t border-slate-100 dark:border-slate-800">
                      {{ key.replace(/_/g, ' ') }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Detailed Plan Tab -->
              <div v-if="activeTab === 'detailed_plan'" class="animate-in fade-in duration-500">
                <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <i class="fas fa-list-check text-brand-primary"></i>
                  {{ $t('detailed_treatment_plan') }}
                </h3>
                <div class="space-y-4">
                  <div v-for="(opt, idx) in caseData.treatmentOptions" :key="idx" class="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group hover:border-brand-primary/30 transition-all">
                    <div class="flex items-center justify-between mb-3">
                      <span class="px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-black uppercase tracking-widest">
                        {{ opt.treatmnet_option_type }}
                      </span>
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ formatDate(opt.created_at) }}</span>
                    </div>
                    <p class="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{{ opt.treatmnet_option_details }}</p>
                  </div>
                  <div v-if="!caseData.treatmentOptions?.length" class="text-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <i class="fas fa-clipboard-list text-4xl text-slate-300 mb-4"></i>
                    <p class="text-slate-500 font-bold uppercase tracking-widest text-sm">{{ $t('no_plans_yet') || 'No treatment plans recorded yet' }}</p>
                  </div>
                </div>
              </div>

              <!-- History Tab -->
              <div v-if="activeTab === 'history'" class="animate-in fade-in duration-500">
                <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <i class="fas fa-history text-brand-primary"></i>
                  {{ $t('case_history') || 'Case History' }}
                </h3>
                <div class="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-12 ml-4">
                  <div v-for="(item, idx) in caseData.history" :key="idx" class="relative">
                    <div class="absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-[#1a1a1a] transition-colors" :class="idx === 0 ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-700'"></div>
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <span class="text-xs font-black text-brand-primary uppercase tracking-widest">{{ formatDate(item.created_at) }}</span>
                      <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase">
                        Done by {{ item.status?.includes('Admin') ? 'Admin' : 'Doctor' }}
                      </span>
                    </div>
                    <h4 class="text-lg font-bold text-slate-900 dark:text-white">{{ item.status }}</h4>
                  </div>
                </div>
              </div>

              <!-- Treatment Plan View -->
              <div v-if="activeTab.startsWith('plan')" class="animate-in fade-in duration-500">
                <div class="bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 p-4 min-h-[500px] flex items-center justify-center relative group">
                  <iframe v-if="currentPlanLink" :src="currentPlanLink" class="w-full h-[600px] rounded-2xl border-none shadow-2xl"></iframe>
                  <div v-else class="text-center">
                    <div class="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i class="fas fa-cube text-3xl text-slate-400"></i>
                    </div>
                    <p class="text-slate-500 font-bold uppercase tracking-widest text-sm">3D Plan Viewer Not Available</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Right Column: Patient Stats & Actions -->
          <div class="lg:col-span-4 space-y-8">
            
            <!-- Actions Card -->
            <div class="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-6">
              <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Actions</h3>
              
              <div class="space-y-3">
                <button @click="handlePlanAction('approved')" :disabled="actionLoading" class="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  <i class="fas fa-check-circle"></i> Approve
                </button>
                <button @click="handlePlanAction('modify')" :disabled="actionLoading" class="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  <i class="fas fa-edit"></i> Modify
                </button>
                <button @click="handlePlanAction('reject')" :disabled="actionLoading" class="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  <i class="fas fa-times-circle"></i> Reject
                </button>
              </div>

              <div v-if="currentPlanStatus" class="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Current Status</p>
                <div :class="getTpClass(currentPlanStatus)" class="inline-block px-4 py-1.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                  {{ currentPlanStatus }}
                </div>
              </div>
            </div>

            <!-- Notes Card -->
            <div class="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-6">
               <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6">Internal Notes</h3>
               <textarea readonly class="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm text-slate-600 dark:text-slate-400 font-medium" rows="4" placeholder="No notes available..."></textarea>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- Image Lightbox -->
    <div v-if="showLightbox" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm" @click="showLightbox = false">
      <div class="relative max-w-5xl w-full h-full flex items-center justify-center" @click.stop>
        <button @click="showLightbox = false" class="absolute -top-12 right-0 text-white text-3xl hover:text-slate-300 transition-colors">
          <i class="fas fa-times"></i>
        </button>
        <img :src="selectedImage" class="max-w-full max-h-full object-contain rounded-xl shadow-2xl shadow-black/50" alt="Medial Record">
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const { token } = useAuth()
const localePath = useLocalePath()
const { t } = useI18n()

const id = route.params.id
const pending = ref(true)
const error = ref(null)
const caseData = ref(null)
const activeTab = ref('details')
const actionLoading = ref(false)

const showLightbox = ref(false)
const selectedImage = ref("")

const tabs = computed(() => {
  if (!caseData.value) return []
  const t = []
  if (caseData.value.case.treatment_plan1) t.push({ id: 'plan1', title: 'Plan 1' })
  if (caseData.value.case.treatment_plan2) t.push({ id: 'plan2', title: 'Plan 2' })
  t.push({ id: 'details', title: 'Details' })
  if (caseData.value.case.case_type === 'aligner') {
    t.push({ id: 'records', title: 'Records' })
    t.push({ id: 'detailed_plan', title: 'Detailed Plan' })
  }
  t.push({ id: 'history', title: 'History' })
  return t
})

const detailedInfo = computed(() => {
  if (!caseData.value) return {}
  const c = caseData.value.case
  return {
    'Patient Name': c.patient_name,
    'UUID': c.uuid,
    'Case Type': c.case_type,
    'Case Status': c.status,
    'Date of Birth': c.dob,
    'Gender': c.gender || 'Not specified',
    'Treatment Plan 1': c.treatment_plan1_status || '—',
    'Treatment Plan 2': c.treatment_plan2_status || '—',
  }
})

const recordImages = computed(() => {
  if (!caseData.value?.records) return {}
  const r = caseData.value.records
  return {
    'Frontal': r.frontal,
    'Front_Smiling': r.front_smiling,
    'Front_Pose': r.front_pose,
    'Panoramic': r.panoramic,
    'Cephalometric': r.cephalometric,
    'Right_Buccal': r.right_buccal,
    'Left_Buccal': r.left_buccal,
    'Upper_Occlusal': r.upper_occlusal,
    'Lower_Occlusal': r.lower_occlusal,
  }
})

const currentPlanLink = computed(() => {
  if (activeTab.value === 'plan1') return caseData.value.case.treatment_plan1
  if (activeTab.value === 'plan2') return caseData.value.case.treatment_plan2
  return null
})

const currentPlanStatus = computed(() => {
  if (activeTab.value === 'plan1') return caseData.value.case.treatment_plan1_status
  if (activeTab.value === 'plan2') return caseData.value.case.treatment_plan2_status
  return null
})

const viewImage = (img) => {
  if (!img) return
  selectedImage.value = `https://doctors.oralign.co/impressions/xraysphotos/${img}`
  showLightbox.value = true
}

const handlePlanAction = async (action) => {
  let notes = "No notes"
  
  if (action === 'modify' || action === 'reject') {
    const { value: text, isDismissed } = await Swal.fire({
      title: action === 'modify' ? t('modification_notes') || 'Modification Notes' : t('rejection_reason') || 'Rejection Reason',
      input: 'textarea',
      inputPlaceholder: t('enter_notes_here') || 'Enter your notes here...',
      showCancelButton: true,
      confirmButtonColor: action === 'reject' ? '#ef4444' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t('submit') || 'Submit'
    })
    
    if (isDismissed) return
    notes = text || "No notes"
  } else {
    const result = await Swal.fire({
      title: t('are_you_sure') || 'Are you sure?',
      text: t('approve_plan_confirm') || 'You are about to approve this treatment plan.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: t('yes_approve') || 'Yes, Approve'
    })
    if (!result.isConfirmed) return
  }
  
  actionLoading.value = true
  try {
    const response = await $fetch(`/api/doctor/plan-action`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { 
        id: id, 
        action: action, 
        notes: notes, 
        plan: activeTab.value.includes('plan') ? activeTab.value : 'plan1' 
      }
    })
    
    if (response?.success) {
      Swal.fire({
        title: t('success') || 'Success!',
        text: t('action_submitted_successfully') || 'Action submitted successfully!',
        icon: 'success',
        confirmButtonColor: '#10b981'
      }).then(() => {
        window.location.reload()
      })
    }
  } catch (err) {
    Swal.fire({
      title: t('error') || 'Error',
      text: err.data?.message || t('action_failed') || 'Failed to submit action',
      icon: 'error'
    })
  } finally {
    actionLoading.value = false
  }
}

onMounted(async () => {
  try {
    const response = await $fetch(`/api/doctor/case-profile/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (response?.success) {
      caseData.value = response.data
    } else {
      error.value = response?.message || 'Case not found'
    }
  } catch (err) {
    error.value = err?.data?.message || 'Failed to load case data'
  } finally {
    pending.value = false
  }
})

const getStatusClass = (status) => {
  const s = status?.toLowerCase()
  if (s === 'complete submission') return 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
  if (s === 'cancel') return 'bg-red-500 shadow-lg shadow-red-500/20'
  return 'bg-blue-500 shadow-lg shadow-blue-500/20'
}

const getTpClass = (status) => {
  const s = status?.toLowerCase()
  if (s === 'approved') return 'bg-emerald-500'
  if (s === 'modify') return 'bg-amber-500'
  if (s === 'reject') return 'bg-red-500'
  return 'bg-slate-400'
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const refineCase = () => {
  navigateTo(localePath({ path: '/refinement-submission', query: { caseId: id } }))
}

// Expose functions to template
defineExpose({
  viewImage,
  handlePlanAction,
  refineCase
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
