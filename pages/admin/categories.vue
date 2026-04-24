<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">إدارة الأقسام</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">إضافة وتعديل الأقسام الرئيسية والفرعية للحالات</p>
        </div>
        <button @click="openMainModal()" class="px-5 py-2.5 bg-[#063c31] hover:bg-[#063c31]/90 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#063c31]/20">
            <i class="fas fa-plus"></i> إضافة قسم رئيسي جديد
        </button>
    </div>

    <!-- Main Categories Grid -->
    <div class="grid grid-cols-1 gap-6">
        <div v-for="main in categories" :key="main.id" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
            <div class="p-6 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-xl bg-brand-gold/20 dark:bg-brand-primary/40 text-brand-primary dark:text-brand-gold flex items-center justify-center text-xl font-bold">
                        {{ main.name_ar[0] }}
                    </div>
                    <div>
                        <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ main.name_ar }}</h2>
                        <span class="text-xs text-slate-500 dark:text-slate-400 font-sans tracking-wide uppercase">{{ main.name_en }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="openMainModal(main)" class="h-9 w-9 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 transition-all">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button @click="deleteMain(main.id)" class="h-9 w-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 transition-all">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>

            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <i class="fas fa-list-ul text-brand-primary text-xs"></i> الأقسام الفرعية ({{ main.sub_categories?.length || 0 }})
                    </h3>
                    <button @click="openSubModal(main.id)" class="text-xs font-bold text-brand-primary hover:text-brand-primary/80 dark:text-brand-gold flex items-center gap-1 transition-colors">
                        <i class="fas fa-plus-circle"></i> إضافة قسم فرعي
                    </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <div v-for="sub in main.sub_categories" :key="sub.id" class="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex justify-between items-center hover:border-teal-500/30 transition-all">
                        <div>
                            <p class="text-[13px] font-bold text-slate-800 dark:text-slate-200">{{ sub.name_ar }}</p>
                            <p class="text-[10px] text-slate-500 dark:text-slate-400 font-sans uppercase">{{ sub.name_en }}</p>
                        </div>
                        <div class="flex gap-1">
                            <button @click="openSubModal(main.id, sub)" class="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-brand-primary hover:bg-brand-gold/10 dark:hover:bg-brand-primary/20 transition-all">
                                <i class="fas fa-pen text-[10px]"></i>
                            </button>
                            <button @click="deleteSub(sub.id)" class="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                <i class="fas fa-times text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                    <div v-if="!main.sub_categories?.length" class="col-span-full py-4 text-center text-xs text-slate-400 italic">
                        لا توجد أقسام فرعية لهذا القسم حالياً
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
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ modals.main.editing ? 'تعديل قسم رئيسي' : 'إضافة قسم رئيسي جديد' }}</h3>
                    <button @click="modals.main.open = false" class="text-slate-400 hover:text-red-500 transition-colors"><i class="fas fa-times"></i></button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">الاسم بالعربية</label>
                        <input v-model="modals.main.form.name_ar" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white">
                    </div>
                    <div>
                        <label class="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">الاسم بالإنجليزية</label>
                        <input v-model="modals.main.form.name_en" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white">
                    </div>
                </div>
                <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                    <button @click="modals.main.open = false" class="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">إلغاء</button>
                    <button @click="saveMain" class="px-6 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-brand-primary/20">حفظ</button>
                </div>
            </div>
        </div>
    </transition>

    <!-- Sub Category Modal -->
    <transition name="fade">
        <div v-if="modals.sub.open" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="modals.sub.open = false">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ modals.sub.editing ? 'تعديل قسم فرعي' : 'إضافة قسم فرعي جديد' }}</h3>
                    <button @click="modals.sub.open = false" class="text-slate-400 hover:text-red-500 transition-colors"><i class="fas fa-times"></i></button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">الاسم بالعربية</label>
                        <input v-model="modals.sub.form.name_ar" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white">
                    </div>
                    <div>
                        <label class="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">الاسم بالإنجليزية</label>
                        <input v-model="modals.sub.form.name_en" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white">
                    </div>
                </div>
                <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                    <button @click="modals.sub.open = false" class="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">إلغاء</button>
                    <button @click="saveSub" class="px-6 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-brand-primary/20">حفظ</button>
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
import { ref } from 'vue'

const config = useRuntimeConfig()
const { token } = useAuth()
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
    const isEditing = modals.value.main.editing
    const url = isEditing 
        ? `${config.public.apiBase}/categories/main/${modals.value.main.form.id}/update`
        : `${config.public.apiBase}/categories/main`
    
    try {
        await $fetch(url, { method: 'POST', body: modals.value.main.form, headers: headers.value })
        modals.value.main.open = false
        refresh()
    } catch(e) { console.error('Failed to save main category', e) }
}

const deleteMain = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم وكل الأقسام الفرعية التابعة له؟')) return
    try {
        await $fetch(`${config.public.apiBase}/categories/main/${id}/delete`, { method: 'POST', headers: headers.value })
        refresh()
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
    const isEditing = modals.value.sub.editing
    const url = isEditing 
        ? `${config.public.apiBase}/categories/sub/${modals.value.sub.form.id}/update`
        : `${config.public.apiBase}/categories/sub`
    
    try {
        await $fetch(url, { method: 'POST', body: modals.value.sub.form, headers: headers.value })
        modals.value.sub.open = false
        refresh()
    } catch(e) { console.error('Failed to save subcategory', e) }
}

const deleteSub = async (id) => {
    if (!confirm('حذف القسم الفرعي؟')) return
    try {
        await $fetch(`${config.public.apiBase}/categories/sub/${id}/delete`, { method: 'POST', headers: headers.value })
        refresh()
    } catch(e) { console.error('Failed to delete sub', e) }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
