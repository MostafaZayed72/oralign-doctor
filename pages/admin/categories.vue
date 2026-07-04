<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
    <!-- Back Button -->
    <div>
      <NuxtLink :to="localePath('/admin/patient-cases')" class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105">
        <i class="fas fa-arrow-left rtl:rotate-180"></i>
        <span>{{ locale === 'ar' ? 'رجوع' : 'Back' }}</span>
      </NuxtLink>
    </div>

    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ t('manage_categories') }}</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t('manage_categories_desc') }}</p>
        </div>
        <button @click="openMainModal()" class="px-5 py-2.5 bg-[#063c31] hover:bg-[#063c31]/90 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#063c31]/20">
            <i class="fas fa-plus"></i> {{ t('add_new_main_category') }}
        </button>
    </div>

    <!-- Main Categories Grid -->
    <div class="grid grid-cols-1 gap-6">
        <div v-for="main in categories" :key="main.id" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
            <div class="p-6 flex justify-between items-center bg-[#063c31] shadow-md border-b border-transparent">
                <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-xl bg-white/20 text-white flex items-center justify-center text-xl font-bold shadow-sm backdrop-blur-sm border border-white/10">
                        {{ main.name_ar ? main.name_ar[0] : 'C' }}
                    </div>
                    <div>
                        <h2 class="text-lg font-bold text-white">{{ main.name_ar }}</h2>
                        <span class="text-xs text-white/80 font-sans tracking-wide uppercase">{{ main.name_en }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="openMainModal(main)" class="h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/30 transition-all border border-white/5">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button @click="deleteMain(main.id)" class="h-9 w-9 flex items-center justify-center rounded-lg bg-red-500/30 text-white hover:bg-red-500/60 transition-all border border-white/5">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>

            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <i class="fas fa-list-ul text-[#063c31] text-xs"></i> {{ t('sub_categories_count') }} ({{ main.sub_categories?.length || 0 }})
                    </h3>
                    <button @click="openSubModal(main.id)" class="text-xs font-bold text-[#063c31] hover:text-[#063c31]/80 dark:text-[#d1b06b] flex items-center gap-1 transition-colors">
                        <i class="fas fa-plus-circle"></i> {{ t('add_new_sub_category') }}
                    </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <div v-for="sub in main.sub_categories" :key="sub.id" class="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex justify-between items-center hover:border-teal-500/30 transition-all">
                        <div>
                            <p class="text-[13px] font-bold text-slate-800 dark:text-slate-200">{{ sub.name_ar }}</p>
                            <p class="text-[10px] text-slate-500 dark:text-slate-400 font-sans uppercase">{{ sub.name_en }}</p>
                        </div>
                        <div class="flex gap-1">
                            <button @click="openSubModal(main.id, sub)" class="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-[#063c31] hover:bg-[#d1b06b]/10 dark:hover:bg-[#063c31]/20 transition-all">
                                <i class="fas fa-pen text-[10px]"></i>
                            </button>
                            <button @click="deleteSub(sub.id)" class="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                <i class="fas fa-times text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                    <div v-if="!main.sub_categories?.length" class="col-span-full py-4 text-center text-xs text-slate-400 italic">
                        {{ t('no_sub_categories') }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Category Modal -->
    <transition name="fade">
        <div v-if="modals.main.open" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="modals.main.open = false">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ modals.main.editing ? t('edit_main_category') : t('add_new_main_category') }}</h3>
                    <button @click="modals.main.open = false" class="text-slate-400 hover:text-red-500 transition-colors"><i class="fas fa-times"></i></button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">{{ t('category_name_ar') }}</label>
                        <input v-model="modals.main.form.name_ar" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-[#063c31] outline-none transition-all dark:text-white">
                    </div>
                    <div>
                        <label class="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">{{ t('category_name_en') }}</label>
                        <input v-model="modals.main.form.name_en" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-[#063c31] outline-none transition-all dark:text-white">
                    </div>
                </div>
                <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                    <button @click="modals.main.open = false" class="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">{{ t('cancel') }}</button>
                    <button @click="saveMain" :disabled="loading" class="px-6 py-2 bg-[#063c31] hover:bg-[#063c31]/90 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-[#063c31]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
                        {{ t('save') }}
                    </button>
                </div>
            </div>
        </div>
    </transition>

    <!-- Sub Category Modal -->
    <transition name="fade">
        <div v-if="modals.sub.open" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="modals.sub.open = false">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ modals.sub.editing ? t('edit_sub_category') : t('add_new_sub_category') }}</h3>
                    <button @click="modals.sub.open = false" class="text-slate-400 hover:text-red-500 transition-colors"><i class="fas fa-times"></i></button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">{{ t('category_name_ar') }}</label>
                        <input v-model="modals.sub.form.name_ar" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-[#063c31] outline-none transition-all dark:text-white">
                    </div>
                    <div>
                        <label class="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">{{ t('category_name_en') }}</label>
                        <input v-model="modals.sub.form.name_en" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-[#063c31] outline-none transition-all dark:text-white">
                    </div>
                </div>
                <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                    <button @click="modals.sub.open = false" class="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">{{ t('cancel') }}</button>
                    <button @click="saveSub" :disabled="loading" class="px-6 py-2 bg-[#063c31] hover:bg-[#063c31]/90 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-[#063c31]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
                        {{ t('save') }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
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
const localePath = useLocalePath()
const config = useRuntimeConfig()
const { token } = useAuth()
const loading = ref(false)

const headers = computed(() => ({
  Authorization: `Bearer ${token.value}`,
  Accept: 'application/json'
}))

const { data: response, refresh } = await useFetch(`${config.public.apiBase}/categories`, { headers })
const categories = computed(() => response.value?.data || [])

// Modals State
const modals = ref({
    main: { open: false, editing: false, form: { id: null, name_en: '', name_ar: '' } },
    sub: { open: false, editing: false, form: { id: null, main_category_id: null, name_en: '', name_ar: '' } }
})

// Main Category Actions
const openMainModal = (cat = null) => {
    if (cat) {
        modals.value.main.editing = true
        modals.value.main.form = { id: cat.id, name_en: cat.name_en, name_ar: cat.name_ar }
    } else {
        modals.value.main.editing = false
        modals.value.main.form = { id: null, name_en: '', name_ar: '' }
    }
    modals.value.main.open = true
}

const saveMain = async () => {
    if (!modals.value.main.form.name_ar || !modals.value.main.form.name_en) {
        Swal.fire({ icon: 'warning', text: locale.value === 'ar' ? 'يرجى إدخال جميع الأسماء' : 'Please enter all names' })
        return
    }

    loading.value = true
    const isEditing = modals.value.main.editing
    const url = isEditing 
        ? `${config.public.apiBase}/categories/main/${modals.value.main.form.id}/update`
        : `${config.public.apiBase}/categories/main`
    
    try {
        await $fetch(url, { 
            method: 'POST', 
            body: modals.value.main.form, 
            headers: headers.value 
        })
        
        await refresh()
        modals.value.main.open = false
        
        Swal.fire({
            icon: 'success',
            title: t('category_saved'),
            timer: 1500,
            showConfirmButton: false
        })
    } catch(e) { 
        console.error('Failed to save main category', e)
        Swal.fire({ icon: 'error', title: t('category_save_failed') })
    } finally {
        loading.value = false
    }
}

const deleteMain = async (id) => {
    const result = await Swal.fire({
        title: t('confirm_delete_title'),
        text: t('delete_main_confirm'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: t('yes_delete'),
        cancelButtonText: t('cancel')
    })
    
    if (!result.isConfirmed) return
    
    try {
        await $fetch(`${config.public.apiBase}/categories/main/${id}/delete`, { 
            method: 'POST', 
            headers: headers.value 
        })
        await refresh()
        Swal.fire({ icon: 'success', title: t('deleted'), timer: 1500 })
    } catch(e) { console.error('Failed to delete', e) }
}

// Sub Category Actions
const openSubModal = (mainId, sub = null) => {
    if (sub) {
        modals.value.sub.editing = true
        modals.value.sub.form = { id: sub.id, main_category_id: mainId, name_en: sub.name_en, name_ar: sub.name_ar }
    } else {
        modals.value.sub.editing = false
        modals.value.sub.form = { id: null, main_category_id: mainId, name_en: '', name_ar: '' }
    }
    modals.value.sub.open = true
}

const saveSub = async () => {
    if (!modals.value.sub.form.name_ar || !modals.value.sub.form.name_en) {
        Swal.fire({ icon: 'warning', text: locale.value === 'ar' ? 'يرجى إدخال جميع الأسماء' : 'Please enter all names' })
        return
    }

    loading.value = true
    const isEditing = modals.value.sub.editing
    const url = isEditing 
        ? `${config.public.apiBase}/categories/sub/${modals.value.sub.form.id}/update`
        : `${config.public.apiBase}/categories/sub`
    
    try {
        await $fetch(url, { 
            method: 'POST', 
            body: modals.value.sub.form, 
            headers: headers.value 
        })
        
        await refresh()
        modals.value.sub.open = false
        
        Swal.fire({
            icon: 'success',
            title: t('category_saved'),
            timer: 1500,
            showConfirmButton: false
        })
    } catch(e) { 
        console.error('Failed to save subcategory', e)
        Swal.fire({ icon: 'error', title: t('category_save_failed') })
    } finally {
        loading.value = false
    }
}

const deleteSub = async (id) => {
    const result = await Swal.fire({
        title: t('confirm_delete_title'),
        text: t('delete_sub_confirm'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: t('yes_delete'),
        cancelButtonText: t('cancel')
    })
    
    if (!result.isConfirmed) return
    
    try {
        await $fetch(`${config.public.apiBase}/categories/sub/${id}/delete`, { 
            method: 'POST', 
            headers: headers.value 
        })
        await refresh()
        Swal.fire({ icon: 'success', title: t('deleted'), timer: 1500 })
    } catch(e) { console.error('Failed to delete sub', e) }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
