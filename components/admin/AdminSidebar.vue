<template>
  <aside 
    class="fixed inset-y-0 right-0 z-50 transform bg-slate-900 dark:bg-slate-950 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 shadow-2xl border-l border-white/5"
    :class="[
      !isOpen ? 'translate-x-full' : 'translate-x-0',
      isCollapsed ? 'w-24' : 'w-72'
    ]"
  >
    <!-- Collapse Toggle Button (Desktop Only) -->
    <button 
      @click="toggleCollapse"
      class="hidden lg:flex absolute top-10 h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white shadow-xl border border-white/10 hover:bg-slate-700 transition-all z-[60] group"
      :class="dir === 'rtl' ? '-left-4' : '-right-4'"
    >
      <i :class="getChevronIcon" class="fas text-[10px] transition-transform group-hover:scale-125"></i>
    </button>

    <div class="flex h-full flex-col p-6 overflow-hidden">
      <!-- Logo Section -->
      <NuxtLink :to="localePath('/admin')" class="mb-10 flex items-center gap-3 transition-all duration-300" :class="isCollapsed ? 'justify-center' : ''">
        <div class="flex h-12 items-center justify-center rounded-xl bg-white/5 p-2 backdrop-blur-sm border border-white/10 shadow-lg transition-all duration-300 overflow-hidden"
             :class="isCollapsed ? 'w-12 px-1' : 'w-32'">
          <img src="/logo.png" alt="Oralign" class="h-full w-full object-contain" :class="isCollapsed ? 'scale-150' : ''" />
        </div>
      </NuxtLink>

      <!-- Navigation Links -->
      <nav class="flex-1 space-y-2">
        <NuxtLink 
          v-for="item in menuItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center rounded-xl py-3.5 text-slate-400 transition-all hover:bg-slate-800/50 dark:hover:bg-slate-900/50 hover:text-white group relative overflow-hidden"
          :class="[
            isCollapsed ? 'justify-center px-0' : 'justify-between px-4',
          ]"
          active-class="!bg-[#0a5446] text-white shadow-xl shadow-[#0a5446]/40 border-r-4 border-brand-gold scale-[1.02] transform transition-all duration-300 ring-1 ring-white/10"
          :title="isCollapsed ? item.name : ''"
        >
          <div class="flex items-center transition-all duration-300" :class="isCollapsed ? 'gap-0' : 'gap-4'">
            <i :class="item.icon" class="text-lg transition-transform group-hover:scale-110 shrink-0"></i>
            <span v-if="!isCollapsed" class="font-bold text-sm tracking-wide whitespace-nowrap opacity-100 transition-opacity duration-300">{{ item.name }}</span>
          </div>
          <span v-if="item.badge && !isCollapsed" class="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white shadow-lg shadow-red-500/20 animate-in fade-in zoom-in duration-300">
            {{ item.badge }}
          </span>
          <!-- Tiny dot badge for collapsed state -->
          <span v-else-if="item.badge && isCollapsed" class="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500 shadow-sm border border-slate-900"></span>
        </NuxtLink>
      </nav>

      <!-- Bottom Profile/Settings -->
      <div class="mt-auto border-t border-slate-800 pt-6">
        <button 
          @click="logout"
          class="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-rose-500/10 text-slate-400 hover:text-rose-500"
          :class="isCollapsed ? 'justify-center' : 'gap-3'"
        >
          <i class="fas fa-sign-out-alt text-lg"></i>
          <span v-if="!isCollapsed" class="font-bold tracking-tight">{{ t('logout') }}</span>
        </button>
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
  </aside>

  <!-- Mobile Overlay -->
  <div 
    v-if="isOpen" 
    @click="$emit('close')"
    class="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
  ></div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

defineProps({
  isOpen: { type: Boolean, default: true }
})

defineEmits(['close'])

const { t, locale } = useI18n()
const { token, logout: authLogout } = useAuth()
const config = useRuntimeConfig()
const isRtl = computed(() => locale.value === 'ar')
const dir = computed(() => (isRtl.value ? 'rtl' : 'ltr'))
const { data: stats } = await useFetch(`${config.public.apiBase}/stats`, {
  headers: {
    Authorization: `Bearer ${token.value}`,
    Accept: 'application/json'
  }
})

const isCollapsed = ref(false)

const getChevronIcon = computed(() => {
  if (dir.value === 'rtl') {
    return isCollapsed.value ? 'fa-chevron-left' : 'fa-chevron-right'
  } else {
    return isCollapsed.value ? 'fa-chevron-right' : 'fa-chevron-left'
  }
})

onMounted(() => {
  const saved = localStorage.getItem('sidebar_is_collapsed')
  if (saved !== null) {
    isCollapsed.value = saved === 'true'
  }
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebar_is_collapsed', isCollapsed.value)
}

const showLogoutDialog = ref(false)

const logout = () => {
  showLogoutDialog.value = true
}

const handleLogout = async () => {
  showLogoutDialog.value = false
  await authLogout()
}

const localePath = useLocalePath()

const menuItems = computed(() => [
  { name: t('dashboard'), icon: 'fas fa-th-large', path: localePath('/admin') },
  { name: t('users'), icon: 'fas fa-users', path: localePath('/users') },
  { name: t('services'), icon: 'fas fa-wrench', path: localePath('/services') },
  { name: t('blogs'), icon: 'fas fa-paste', path: localePath('/blog') },
  { 
    name: t('cases_sidebar'), 
    icon: 'fas fa-briefcase-medical', 
    path: localePath('/admin/patient-cases'), 
    badge: stats.value?.unreadCasesCount > 0 ? stats.value.unreadCasesCount : null 
  },
  { name: t('all_categories'), icon: 'fas fa-layer-group', path: localePath('/admin/categories') },
  { name: t('gallery'), icon: 'fas fa-images', path: localePath('/gallery') },
  { name: t('areas'), icon: 'fas fa-map-marker-alt', path: localePath('/areas') },
])
</script>
