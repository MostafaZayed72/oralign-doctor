<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          {{ locale === 'ar' ? 'إدارة الأطباء' : 'Doctors Management' }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ locale === 'ar' ? 'مراجعة طلبات تسجيل الأطباء وتفعيل حساباتهم لإرسال بيانات الدخول لهم.' : 'Review registration requests, activate accounts and email login details to doctors.' }}
        </p>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <!-- Status Filter -->
      <div class="flex items-center gap-3">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
          <i class="fas fa-filter text-teal-500 mr-1 rtl:ml-1"></i>
          {{ t('filter_by_status') }}:
        </label>
        <div class="relative min-w-[200px]">
          <select 
            v-model="statusFilter"
            class="w-full pl-4 pr-10 py-2.5 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all cursor-pointer appearance-none shadow-inner"
          >
            <option value="all">{{ locale === 'ar' ? 'الكل' : 'All' }}</option>
            <option value="inactive">{{ locale === 'ar' ? 'قيد الانتظار (غير نشط)' : 'Pending (Inactive)' }}</option>
            <option value="active">{{ locale === 'ar' ? 'نشط' : 'Active' }}</option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <i class="fas fa-chevron-down text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <input 
          type="text" 
          v-model="searchQuery" 
          :placeholder="locale === 'ar' ? 'بحث بالاسم، الإيميل أو الهاتف...' : 'Search by name, email or phone...'" 
          class="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all dark:bg-slate-900"
        >
        <i class="fas fa-search absolute rtl:right-3.5 ltr:left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
      </div>
    </div>

    <!-- Doctors Table Card -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative">
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left rtl:text-right border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <th class="p-4 text-center">{{ locale === 'ar' ? 'الاسم' : 'Name' }}</th>
              <th class="p-4 text-center">{{ t('email') }}</th>
              <th class="p-4 text-center">{{ t('phone') }}</th>
              <th class="p-4 text-center">{{ locale === 'ar' ? 'الموقع' : 'Location' }}</th>
              <th class="p-4 text-center">{{ t('status') }}</th>
              <th class="p-4 text-center">{{ locale === 'ar' ? 'تاريخ التسجيل' : 'Registration Date' }}</th>
              <th class="p-4 text-center">{{ locale === 'ar' ? 'الإجراءات' : 'Actions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            <!-- Loading skeleton -->
            <tr v-if="pending" v-for="i in 5" :key="i" class="animate-pulse">
              <td class="p-4" colspan="7">
                <div class="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
              </td>
            </tr>
            <!-- Empty state -->
            <tr v-else-if="filteredDoctors.length === 0">
              <td colspan="7" class="p-8 text-center text-slate-500 dark:text-slate-400 font-semibold">
                {{ locale === 'ar' ? 'لا يوجد أطباء مطابقين للتصفية' : 'No doctors matched your filters' }}
              </td>
            </tr>
            <!-- Doctors rows -->
            <tr 
              v-else 
              v-for="doc in filteredDoctors" 
              :key="doc.id" 
              class="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/10"
            >
              <!-- Name -->
              <td class="p-4 text-center font-bold text-slate-800 dark:text-slate-100">
                {{ doc.name }}
              </td>
              <!-- Email -->
              <td class="p-4 text-center font-semibold text-slate-600 dark:text-slate-300">
                {{ doc.email }}
              </td>
              <!-- Phone -->
              <td class="p-4 text-center font-semibold text-slate-600 dark:text-slate-300">
                {{ doc.phone }}
              </td>
              <!-- Location -->
              <td class="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                <span v-if="doc.country || doc.region || doc.area">
                  {{ [doc.country, doc.region, doc.area].filter(Boolean).join(' / ') }}
                </span>
                <span v-else class="text-slate-400">-</span>
              </td>
              <!-- Status -->
              <td class="p-4 text-center">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                  :class="doc.status === 'active' 
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'"
                >
                  <span class="h-1.5 w-1.5 rounded-full mr-1.5 rtl:ml-1.5" :class="doc.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                  {{ doc.status === 'active' ? (locale === 'ar' ? 'نشط' : 'Active') : (locale === 'ar' ? 'قيد الانتظار' : 'Pending') }}
                </span>
              </td>
              <!-- Created At -->
              <td class="p-4 text-center text-xs text-slate-500 dark:text-slate-400 font-sans">
                {{ doc.created_at || '-' }}
              </td>
              <!-- Actions -->
              <td class="p-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <!-- Approve Button -->
                  <button 
                    v-if="doc.status !== 'active'"
                    @click="approveDoctor(doc)"
                    :disabled="loading"
                    class="h-8 px-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <i class="fas fa-check"></i>
                    {{ locale === 'ar' ? 'تفعيل' : 'Approve' }}
                  </button>

                  <!-- Impersonate Button -->
                  <button 
                    v-if="doc.status === 'active'"
                    @click="impersonateDoctor(doc)"
                    :disabled="loading"
                    class="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition-all active:scale-95 disabled:opacity-50"
                    :title="locale === 'ar' ? 'تسجيل دخول كطبيب' : 'Login as Doctor'"
                  >
                    <i class="fas fa-user-secret"></i>
                    {{ locale === 'ar' ? 'دخول كطبيب' : 'Login As' }}
                  </button>

                  <!-- Delete Button -->
                  <button 
                    @click="deleteDoctor(doc.id)"
                    :disabled="loading"
                    class="h-8 w-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md shadow-red-500/10 transition-all active:scale-95 disabled:opacity-50"
                    :title="t('delete')"
                  >
                    <i class="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const { token, user } = useAuth()
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all') // 'all', 'active', 'inactive'

const headers = computed(() => ({
  Authorization: `Bearer ${token.value}`,
  Accept: 'application/json'
}))

// Fetch doctors
const { data: response, refresh, pending } = await useFetch(`${config.public.apiBase}/doctors`, { headers })
const doctors = computed(() => response.value?.data || [])

// Filtered doctors list
const filteredDoctors = computed(() => {
  return doctors.value.filter(doc => {
    // Status filter
    if (statusFilter.value === 'active' && doc.status !== 'active') return false
    if (statusFilter.value === 'inactive' && doc.status !== 'inactive') return false

    // Search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      const name = (doc.name || '').toLowerCase()
      const email = (doc.email || '').toLowerCase()
      const phone = (doc.phone || '').toLowerCase()
      return name.includes(query) || email.includes(query) || phone.includes(query)
    }

    return true
  })
})

const approveDoctor = async (doc) => {
  const result = await Swal.fire({
    title: locale.value === 'ar' ? 'تفعيل الحساب؟' : 'Activate Account?',
    text: locale.value === 'ar' 
      ? `هل تريد الموافقة على الطبيب ${doc.name}؟ سيتم توليد كلمة مرور عشوائية وإرسالها له بالبريد الإلكتروني.`
      : `Are you sure you want to approve Dr. ${doc.name}? A random password will be generated and emailed to them.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#64748b',
    confirmButtonText: locale.value === 'ar' ? 'نعم، موافقة وتفعيل' : 'Yes, Approve & Activate',
    cancelButtonText: t('cancel')
  })

  if (!result.isConfirmed) return

  loading.value = true
  try {
    await $fetch(`${config.public.apiBase}/doctors/${doc.id}/approve`, {
      method: 'POST',
      headers: headers.value
    })
    
    await refresh()
    Swal.fire({
      icon: 'success',
      title: locale.value === 'ar' ? 'تم التفعيل!' : 'Activated!',
      text: locale.value === 'ar' ? 'تم تفعيل الحساب بنجاح وإرسال البريد الإلكتروني.' : 'Account activated successfully and email sent.',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (e) {
    console.error('Failed to approve doctor', e)
    Swal.fire({
      icon: 'error',
      title: t('error'),
      text: e.data?.message || (locale.value === 'ar' ? 'حدث خطأ أثناء تفعيل الحساب.' : 'An error occurred during account activation.')
    })
  } finally {
    loading.value = false
  }
}

const deleteDoctor = async (id) => {
  const result = await Swal.fire({
    title: t('confirm_delete_title'),
    text: t('confirm_delete'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: t('yes_delete'),
    cancelButtonText: t('cancel')
  })

  if (!result.isConfirmed) return

  loading.value = true
  try {
    await $fetch(`${config.public.apiBase}/doctors/${id}`, {
      method: 'DELETE',
      headers: headers.value
    })
    await refresh()
    Swal.fire({
      icon: 'success',
      title: t('deleted'),
      text: locale.value === 'ar' ? 'تم حذف حساب الطبيب بنجاح.' : 'Doctor account deleted successfully.',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (e) {
    console.error('Failed to delete doctor', e)
    Swal.fire({
      icon: 'error',
      title: t('error'),
      text: e.data?.message || t('delete_failed_msg')
    })
  } finally {
    loading.value = false
  }
}

const impersonateDoctor = async (doc) => {
  const result = await Swal.fire({
    title: locale.value === 'ar' ? 'محاكاة تسجيل الدخول؟' : 'Simulate Login?',
    text: locale.value === 'ar'
      ? `هل تريد تسجيل الدخول ومحاكاة حساب الطبيب: ${doc.name}؟`
      : `Do you want to log in and impersonate Dr. ${doc.name}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#64748b',
    confirmButtonText: locale.value === 'ar' ? 'نعم، دخول' : 'Yes, Impersonate',
    cancelButtonText: t('cancel')
  })

  if (!result.isConfirmed) return

  loading.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/impersonate/${doc.id}`, {
      method: 'POST',
      headers: headers.value
    })

    if (response?.success && response?.token) {
      // Save current admin token to admin_token cookie
      const adminTokenCookie = useCookie('admin_token', { maxAge: 60 * 60 * 24 * 7 })
      adminTokenCookie.value = token.value

      // Update auth_token and auth_user
      token.value = response.token
      user.value = response.user

      // Show success
      Swal.fire({
        icon: 'success',
        title: locale.value === 'ar' ? 'تم الدخول بنجاح!' : 'Logged In!',
        text: locale.value === 'ar'
          ? `أنت الآن تتصفح كطبيب: ${response.user.f_name} ${response.user.l_name}`
          : `You are now browsing as: ${response.user.f_name} ${response.user.l_name}`,
        timer: 2000,
        showConfirmButton: false
      })

      // Redirect to doctor dashboard
      const localePath = useLocalePath()
      navigateTo(localePath('/dashboard'))
    }
  } catch (e) {
    console.error('Impersonation failed', e)
    Swal.fire({
      icon: 'error',
      title: t('error'),
      text: e.data?.message || (locale.value === 'ar' ? 'فشل تسجيل الدخول كطبيب.' : 'Impersonation failed.')
    })
  } finally {
    loading.value = false
  }
}
</script>
