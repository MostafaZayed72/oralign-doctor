<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{{ t('dashboard') }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here is a quick overview of the latest statistics.</p>
      </div>
      <div class="flex items-center gap-2 text-emerald-500 font-bold text-[11px] tracking-widest uppercase">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        LIVE FEED
      </div>
    </div>

    <div v-if="pending" class="flex justify-center py-20">
      <i class="fas fa-spinner fa-spin text-4xl text-brand-primary"></i>
    </div>

    <!-- Stats Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Users -->
      <div class="bg-[#0f3c2e] rounded-[2rem] p-8 text-center text-white shadow-xl shadow-emerald-900/20 hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="h-16 w-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 shadow-inner">
          <i class="fas fa-users text-2xl opacity-80 group-hover:opacity-100 transition-opacity"></i>
        </div>
        <h3 class="text-[11px] font-black tracking-[0.3em] text-white/60 mb-3 uppercase">{{ t('users') }}</h3>
        <p class="text-4xl font-black">{{ stats?.users || 0 }}</p>
        <div class="w-10 h-1 bg-white/20 mx-auto mt-6 rounded-full group-hover:w-16 transition-all duration-500"></div>
      </div>

      <!-- Messages -->
      <div class="bg-[#d4a017] rounded-[2rem] p-8 text-center text-white shadow-xl shadow-yellow-900/20 hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="h-16 w-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 shadow-inner">
          <i class="fas fa-envelope text-2xl opacity-80 group-hover:opacity-100 transition-opacity"></i>
        </div>
        <h3 class="text-[11px] font-black tracking-[0.3em] text-white/60 mb-3 uppercase">TOTAL MESSAGES</h3>
        <p class="text-4xl font-black">{{ stats?.messages || 0 }}</p>
        <div class="w-10 h-1 bg-white/20 mx-auto mt-6 rounded-full group-hover:w-16 transition-all duration-500"></div>
      </div>

      <!-- Services -->
      <div class="bg-[#2563eb] rounded-[2rem] p-8 text-center text-white shadow-xl shadow-blue-900/20 hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="h-16 w-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 shadow-inner">
          <i class="fas fa-hand-holding-medical text-2xl opacity-80 group-hover:opacity-100 transition-opacity"></i>
        </div>
        <h3 class="text-[11px] font-black tracking-[0.3em] text-white/60 mb-3 uppercase">TOTAL SERVICES</h3>
        <p class="text-4xl font-black">{{ stats?.services || 0 }}</p>
        <div class="w-10 h-1 bg-white/20 mx-auto mt-6 rounded-full group-hover:w-16 transition-all duration-500"></div>
      </div>

      <!-- Patient Cases -->
      <div class="bg-[#1e293b] rounded-[2rem] p-8 text-center text-white shadow-xl shadow-slate-900/20 hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="h-16 w-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 shadow-inner">
          <i class="fas fa-briefcase-medical text-2xl opacity-80 group-hover:opacity-100 transition-opacity"></i>
        </div>
        <h3 class="text-[11px] font-black tracking-[0.3em] text-white/60 mb-3 uppercase">PATIENT CASES</h3>
        <p class="text-4xl font-black">{{ stats?.unreadCasesCount || stats?.patientCases || 0 }}</p>
        <div class="w-10 h-1 bg-white/20 mx-auto mt-6 rounded-full group-hover:w-16 transition-all duration-500"></div>
      </div>

      <!-- Articles -->
      <div class="bg-[#475569] rounded-[2rem] p-8 text-center text-white shadow-xl shadow-slate-900/20 hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="h-16 w-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 shadow-inner">
          <i class="fas fa-newspaper text-2xl opacity-80 group-hover:opacity-100 transition-opacity"></i>
        </div>
        <h3 class="text-[11px] font-black tracking-[0.3em] text-white/60 mb-3 uppercase">TOTAL ARTICLES</h3>
        <p class="text-4xl font-black">{{ stats?.blogs || 0 }}</p>
        <div class="w-10 h-1 bg-white/20 mx-auto mt-6 rounded-full group-hover:w-16 transition-all duration-500"></div>
      </div>

      <!-- Images -->
      <div class="bg-[#8b1a3e] rounded-[2rem] p-8 text-center text-white shadow-xl shadow-rose-900/20 hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="h-16 w-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 shadow-inner">
          <i class="fas fa-images text-2xl opacity-80 group-hover:opacity-100 transition-opacity"></i>
        </div>
        <h3 class="text-[11px] font-black tracking-[0.3em] text-white/60 mb-3 uppercase">TOTAL IMAGES</h3>
        <p class="text-4xl font-black">{{ stats?.galleryImages || 0 }}</p>
        <div class="w-10 h-1 bg-white/20 mx-auto mt-6 rounded-full group-hover:w-16 transition-all duration-500"></div>
      </div>

      <!-- Areas -->
      <div class="bg-[#065f46] rounded-[2rem] p-8 text-center text-white shadow-xl shadow-emerald-900/20 hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="h-16 w-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 shadow-inner">
          <i class="fas fa-map-marked-alt text-2xl opacity-80 group-hover:opacity-100 transition-opacity"></i>
        </div>
        <h3 class="text-[11px] font-black tracking-[0.3em] text-white/60 mb-3 uppercase">TOTAL AREAS</h3>
        <p class="text-4xl font-black">{{ stats?.areas || 0 }}</p>
        <div class="w-10 h-1 bg-white/20 mx-auto mt-6 rounded-full group-hover:w-16 transition-all duration-500"></div>
      </div>

      <!-- Pages -->
      <div class="bg-[#6b21a8] rounded-[2rem] p-8 text-center text-white shadow-xl shadow-purple-900/20 hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="h-16 w-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 shadow-inner">
          <i class="fas fa-file-alt text-2xl opacity-80 group-hover:opacity-100 transition-opacity"></i>
        </div>
        <h3 class="text-[11px] font-black tracking-[0.3em] text-white/60 mb-3 uppercase">TOTAL PAGES</h3>
        <p class="text-4xl font-black">{{ stats?.pages || 0 }}</p>
        <div class="w-10 h-1 bg-white/20 mx-auto mt-6 rounded-full group-hover:w-16 transition-all duration-500"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import { computed } from 'vue'

const { t } = useI18n()
const config = useRuntimeConfig()
const { token } = useAuth()
const headers = computed(() => ({
  Authorization: `Bearer ${token.value}`,
  Accept: 'application/json'
}))

const { data: response, pending } = await useFetch(`${config.public.apiBase}/stats`, { headers })
const stats = computed(() => response.value?.data || response.value || {})
</script>
