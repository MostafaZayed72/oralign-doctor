<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          {{ t('notifications') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ t('notifications_desc') }}
        </p>
      </div>
      <div>
        <button 
          v-if="notifications.length > 0"
          @click="markAllAsRead"
          :disabled="loading"
          class="h-10 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-teal-600/10 transition-all active:scale-95 disabled:opacity-50"
        >
          <i class="fas fa-check-double"></i>
          {{ t('mark_all_read') }}
        </button>
      </div>
    </div>

    <!-- Notifications List Card -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative">
      <div class="divide-y divide-slate-100 dark:divide-slate-850">
        <!-- Loading state -->
        <div v-if="loading && notifications.length === 0" class="p-8 text-center animate-pulse space-y-4">
          <div v-for="i in 5" :key="i" class="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
        </div>

        <!-- Empty state -->
        <div v-else-if="notifications.length === 0" class="p-12 text-center flex flex-col items-center justify-center text-slate-400">
          <i class="far fa-bell-slash text-4xl mb-3 text-slate-350 dark:text-slate-700"></i>
          <span class="text-sm font-bold">{{ t('no_notifications') }}</span>
        </div>

        <!-- Notifications rows -->
        <div 
          v-else 
          v-for="notif in notifications" 
          :key="notif.id" 
          @click="handleNotificationClick(notif)"
          class="p-4 md:p-6 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
          :class="!notif.seen ? 'bg-slate-50/50 dark:bg-slate-800/40 border-l-4 border-l-teal-500 rtl:border-l-0 rtl:border-r-4 rtl:border-r-teal-500' : ''"
        >
          <div class="space-y-1 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span 
                v-if="!notif.seen" 
                class="inline-block h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse"
              ></span>
              <h3 class="text-sm font-black text-slate-850 dark:text-white" :class="!notif.seen ? 'text-teal-600 dark:text-teal-400' : ''">
                {{ notif.title }}
              </h3>
              <span class="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                :class="notif.seen ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400'"
              >
                {{ notif.seen ? t('read') : t('unread') }}
              </span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-350 font-semibold">{{ notif.text }}</p>
          </div>
          <div class="flex items-center gap-2 text-xs text-slate-450 dark:text-slate-500 whitespace-nowrap self-end md:self-center font-bold">
            <i class="far fa-clock"></i>
            <span>{{ notif.time_ago || notif.created_at }}</span>
          </div>
        </div>
      </div>

      <!-- Show More Footer -->
      <div 
        v-if="pagination.current_page < pagination.last_page" 
        class="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-850 text-center"
      >
        <button 
          @click="loadMore"
          :disabled="loading"
          class="h-11 px-8 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
        >
          <i v-if="loading" class="fas fa-spinner animate-spin"></i>
          <span>{{ loading ? t('loading_more') : t('show_more') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const { token } = useAuth()
const localePath = useLocalePath()

const notifications = ref([])
const loading = ref(false)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

const headers = {
  Authorization: `Bearer ${token.value}`,
  Accept: 'application/json'
}

const fetchNotifications = async (page = 1) => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/notifications`, {
      headers,
      params: {
        lang: locale.value,
        paginate: 1,
        per_page: 10,
        page
      }
    })
    if (res && res.success) {
      if (page === 1) {
        notifications.value = res.data || []
      } else {
        notifications.value = [...notifications.value, ...(res.data || [])]
      }
      if (res.pagination) {
        pagination.value = res.pagination
      }
    }
  } catch (err) {
    console.error('Failed to fetch notifications:', err)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (pagination.value.current_page < pagination.value.last_page) {
    fetchNotifications(pagination.value.current_page + 1)
  }
}

const markAllAsRead = async () => {
  loading.value = true
  try {
    await $fetch(`${config.public.apiBase}/notifications/mark-read`, {
      method: 'POST',
      headers
    })
    notifications.value.forEach(n => n.seen = 1)
    Swal.fire({
      icon: 'success',
      title: locale.value === 'ar' ? 'تم تحديد الكل كمقروء' : 'All marked as read',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (err) {
    console.error('Failed to mark all as read:', err)
  } finally {
    loading.value = false
  }
}

const handleNotificationClick = async (notif) => {
  if (!notif.seen) {
    try {
      await $fetch(`${config.public.apiBase}/notifications/${notif.id}/read`, {
        method: 'POST',
        headers
      })
      notif.seen = 1
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  // Redirect based on type
  if (notif.type === 'case' || notif.type_value_id) {
    navigateTo(localePath('/admin/patient-cases'))
  } else if (notif.type === 'doctor') {
    navigateTo(localePath('/admin/users'))
  }
}

onMounted(() => {
  fetchNotifications(1)
})
</script>
