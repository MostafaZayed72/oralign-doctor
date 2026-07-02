<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const colorMode = useColorMode()
const { locale, t, setLocale } = useI18n()
const { logout: authLogout, token } = useAuth()
const config = useRuntimeConfig()
const localePath = useLocalePath()

const showProfileMenu = ref(false)
const showLogoutDialog = ref(false)

// Notifications state
const showNotificationsMenu = ref(false)
const notifications = ref([])
const unreadCount = ref(0)

const headers = computed(() => ({
  Authorization: `Bearer ${token.value}`,
  Accept: 'application/json'
}))

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const closeProfileMenu = () => {
  showProfileMenu.value = false
}

const logout = () => {
  showProfileMenu.value = false
  showLogoutDialog.value = true
}

const handleLogout = async () => {
  showLogoutDialog.value = false
  await authLogout()
}

const toggleLanguage = () => {
  setLocale(locale.value === 'ar' ? 'en' : 'ar')
}

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Notifications methods
const toggleNotificationsMenu = () => {
  showNotificationsMenu.value = !showNotificationsMenu.value
  if (showNotificationsMenu.value) {
    fetchNotifications()
  }
}

const closeNotificationsMenu = () => {
  showNotificationsMenu.value = false
}

const fetchNotifications = async () => {
  if (!token.value) return
  try {
    const res = await $fetch(`${config.public.apiBase}/notifications`, {
      headers: headers.value,
      params: { lang: locale.value }
    })
    if (res && res.success) {
      notifications.value = res.data || []
      unreadCount.value = res.unread_count || 0
    }
  } catch (err) {
    console.error('Failed to fetch notifications:', err)
  }
}

const markAllAsRead = async () => {
  try {
    await $fetch(`${config.public.apiBase}/notifications/mark-read`, {
      method: 'POST',
      headers: headers.value
    })
    notifications.value.forEach(n => n.seen = 1)
    unreadCount.value = 0
  } catch (err) {
    console.error('Failed to mark all as read:', err)
  }
}

const handleNotificationClick = async (notif) => {
  closeNotificationsMenu()
  // Mark as read in backend
  try {
    await $fetch(`${config.public.apiBase}/notifications/${notif.id}/read`, {
      method: 'POST',
      headers: headers.value
    })
    await fetchNotifications()
  } catch (err) {
    console.error('Failed to mark notification as read:', err)
  }

  // Navigate based on type
  if (notif.type === 'case') {
    navigateTo(localePath('/admin/patient-cases'))
  } else if (notif.type === 'doctor') {
    navigateTo(localePath('/admin/users'))
  }
}

watch(locale, () => {
  fetchNotifications()
})

onMounted(() => {
  fetchNotifications()
  // Poll notifications every 60 seconds
  const interval = setInterval(fetchNotifications, 60000)
  onBeforeUnmount(() => {
    clearInterval(interval)
  })
})

defineEmits(['toggle-sidebar'])
</script>



<template>
  <header class="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 md:px-10 transition-colors duration-300">
    <div class="flex items-center gap-4">
      <button 
        @click="$emit('toggle-sidebar')"
        class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 lg:hidden"
      >
        <i class="fas fa-bars"></i>
      </button>
      <h2 class="text-xl font-bold text-slate-900 dark:text-white hidden md:block">{{ t('system_dashboard') }}</h2>
    </div>

    <!-- Right Side Actions -->
    <div class="flex items-center gap-4 md:gap-6">
      <!-- Language Toggle -->
      <button 
        @click="toggleLanguage"
        class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-all border border-slate-100/50 dark:border-slate-700/50" 
        :title="locale === 'ar' ? 'English' : 'العربية'"
      >
        <span class="text-xs font-bold">{{ locale === 'ar' ? 'EN' : 'AR' }}</span>
      </button>

      <!-- Theme Toggle -->
      <button 
        @click="toggleTheme"
        class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-all border border-slate-100/50 dark:border-slate-700/50" 
        :title="colorMode.value === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'"
      >
        <i :class="colorMode.value === 'dark' ? 'fas fa-sun' : 'fas fa-moon'" class="text-sm"></i>
      </button>

      <!-- Notifications -->
      <ClientOnly>
        <div class="relative" v-click-outside="closeNotificationsMenu">
          <button 
            @click="toggleNotificationsMenu"
            class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-all border border-slate-100/50 dark:border-slate-700/50"
            :title="t('notifications')"
          >
            <i class="far fa-bell text-sm"></i>
            <span v-if="unreadCount > 0" class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              {{ unreadCount }}
            </span>
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div 
              v-if="showNotificationsMenu"
              class="absolute top-full mt-2 w-80 md:w-96 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 origin-top overflow-hidden"
              :class="locale === 'ar' ? 'left-0' : 'right-0'"
            >
              <!-- Header -->
              <div class="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ t('notifications') }}</span>
                <button 
                  v-if="unreadCount > 0" 
                  @click="markAllAsRead" 
                  class="text-xs font-semibold text-brand-gold hover:underline"
                >
                  {{ t('mark_all_read') }}
                </button>
              </div>

              <!-- Notifications List -->
              <div class="max-h-80 overflow-y-auto">
                <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-8 text-slate-400">
                  <i class="far fa-bell-slash text-2xl mb-2 text-slate-350 dark:text-slate-600"></i>
                  <span class="text-xs">{{ t('no_notifications') }}</span>
                </div>
                <div 
                  v-else
                  v-for="notification in notifications" 
                  :key="notification.id"
                  @click="handleNotificationClick(notification)"
                  class="flex flex-col gap-1 px-4 py-3 border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                  :class="!notification.seen ? 'bg-slate-50/50 dark:bg-slate-800/40' : ''"
                >
                  <div class="flex justify-between items-start gap-2">
                    <span class="text-xs font-bold text-slate-955 dark:text-white" :class="!notification.seen ? 'text-teal-600 dark:text-teal-400' : ''">
                      {{ notification.title }}
                    </span>
                    <span class="text-[10px] text-slate-450 whitespace-nowrap">{{ notification.time_ago || notification.created_at }}</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-350 line-clamp-2">{{ notification.text }}</p>
                </div>
              </div>

              <!-- Footer -->
              <div class="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-center bg-slate-50/50 dark:bg-slate-800/80">
                <NuxtLink 
                  :to="localePath('/admin/patient-cases')" 
                  @click="closeNotificationsMenu"
                  class="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  {{ t('view_all_cases') }}
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
      </ClientOnly>



      <!-- Profile -->
      <div class="relative" v-click-outside="closeProfileMenu">
        <button 
          @click="toggleProfileMenu"
          class="flex items-center gap-3 hover:opacity-85 focus:outline-none transition-all duration-200 select-none"
          id="profile-dropdown-button"
        >
          <div class="hidden md:block" :class="locale === 'ar' ? 'text-right' : 'text-left'">
            <p class="text-sm font-bold text-slate-900 dark:text-white">{{ t('mostafa_zayed') }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('general_manager') }}</p>
          </div>
          <div class="h-10 w-10 overflow-hidden rounded-xl border-2 border-brand-gold/20 p-0.5 dark:border-brand-gold/40">
            <img src="https://ui-avatars.com/api/?name=Mostafa+Zayed&background=063C31&color=D1B06B" class="h-full w-full rounded-lg object-cover" />
          </div>
          <i class="fas fa-chevron-down text-[10px] text-slate-400 dark:text-slate-500 transition-transform duration-200" :class="showProfileMenu ? 'rotate-180' : ''"></i>
        </button>

        <!-- Dropdown Menu -->
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div 
            v-if="showProfileMenu"
            class="absolute top-full mt-2 w-48 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 origin-top"
            :class="locale === 'ar' ? 'left-0' : 'right-0'"
          >
            <button 
              @click="logout"
              class="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-start"
            >
              <i class="fas fa-sign-out-alt text-base"></i>
              <span>{{ t('logout') }}</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <AdminConfirmDialog 
      :is-open="showLogoutDialog"
      :title="t('logout')"
      :message="t('logout_confirm')"
      icon="fas fa-sign-out-alt"
      @confirm="handleLogout"
      @cancel="showLogoutDialog = false"
    />
  </header>
</template>
