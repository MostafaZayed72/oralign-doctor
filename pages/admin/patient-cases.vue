<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700 relative">
    <!-- Top Filter Dropdown Area -->
    <div class="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div class="flex items-center gap-3">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
          <i class="fas fa-filter text-teal-500 mr-1 rtl:ml-1"></i>
          {{ t('filter_by_status') }}:
        </label>
        <div class="relative min-w-[220px]">
          <select 
            v-model="activeFilter"
            class="w-full pl-4 pr-10 py-2.5 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-#063c31 focus:border-transparent outline-none transition-all cursor-pointer appearance-none shadow-inner"
          >
            <option v-for="filter in filters" :key="filter" :value="filter">
              {{ filter === 'All Cases' ? t('all_cases') : t(filter) }}
            </option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <i class="fas fa-chevron-down text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="flex items-center gap-3">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
          <i class="fas fa-layer-group text-blue-500 mr-1 rtl:ml-1"></i>
          {{ t('filter_by_category') }}:
        </label>
        <div class="relative min-w-[200px]">
          <select 
            v-model="activeCategoryFilter"
            class="w-full pl-4 pr-10 py-2.5 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-#063c31 focus:border-transparent outline-none transition-all cursor-pointer appearance-none shadow-inner"
          >
            <option value="All Categories">{{ t('all_categories') }}</option>
            <option v-for="cat in allCategories" :key="cat.id" :value="cat.id">{{ cat.name_ar }}</option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <i class="fas fa-chevron-down text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Date Filter -->
      <div class="flex items-center gap-3">
        <label class="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
          <i class="fas fa-calendar-alt text-#d1b06b mr-1 rtl:ml-1"></i>
          {{ t('filter_by_date') }}:
        </label>
        <div class="relative min-w-[200px]">
          <select 
            v-model="activeDateFilter"
            class="w-full pl-4 pr-10 py-2.5 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-#d1b06b focus:border-transparent outline-none transition-all cursor-pointer appearance-none shadow-inner"
          >
            <option value="All Time">{{ t('all_time') }}</option>
            <option value="Last Day">{{ t('last_day') }}</option>
            <option value="Last Week">{{ t('last_week') }}</option>
            <option value="Last Month">{{ t('last_month') }}</option>
            <option value="Last 3 Months">{{ t('last_3_months') }}</option>
            <option value="Last Year">{{ t('last_year') }}</option>
            <option value="Custom Range">{{ t('custom_range') }}</option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <i class="fas fa-history text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Custom Date Inputs -->
      <transition name="fade">
        <div v-if="activeDateFilter === 'Custom Range'" class="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
          <div class="relative">
            <input 
              type="date" 
              v-model="customStartDate"
              class="pl-3 pr-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-#d1b06b transition-all shadow-sm"
              :placeholder="t('from_date')"
            >
          </div>
          <span class="text-slate-400 text-xs">-</span>
          <div class="relative">
            <input 
              type="date" 
              v-model="customEndDate"
              class="pl-3 pr-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-#d1b06b transition-all shadow-sm"
              :placeholder="t('to_date')"
            >
          </div>
        </div>
      </transition>
      
    </div>

    <!-- Column Group Selector -->
    <div class="flex items-center gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit mx-auto border border-slate-200 dark:border-slate-800 shadow-sm">
      <button 
        v-for="group in ['Virtual Planning', 'Finance', 'Laboratory']" 
        :key="group"
        @click="activeGroup = group"
        class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2"
        :class="getGroupButtonClass(group)"
      >
        <i class="fas" :class="{
          'fa-project-diagram': group === 'Virtual Planning',
          'fa-file-invoice-dollar': group === 'Finance',
          'fa-flask': group === 'Laboratory'
        }"></i>
        {{ t(group.toLowerCase().replace(' ', '_')) }}
      </button>
    </div>

    <!-- Main Table Card -->
    <div id="cases-table-card" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative z-0">
      
      <!-- Card Header -->
      <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ t('all_cases') }}</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t('all_cases_desc') }}</p>
          
          <div class="flex flex-wrap gap-3 mt-4">
            <button @click="downloadExcel" class="px-5 py-2.5 text-[13px] font-black rounded-xl bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white border border-green-200 dark:border-green-500/30 transition-all flex items-center gap-2 shadow-sm group">
                <i class="fas fa-file-excel group-hover:scale-105 transition-transform"></i> 
                {{ t('download_excel') }}
            </button>
            <button 
              @click="toggleDrafts" 
              class="px-5 py-2.5 text-[13px] font-black rounded-xl border transition-all flex items-center gap-2 shadow-sm"
              :class="showDrafts 
                ? 'bg-amber-500 text-white border-amber-400 hover:bg-amber-600' 
                : 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/30 hover:bg-amber-600 hover:text-white'"
            >
                <i class="fas" :class="showDrafts ? 'fa-folder-open' : 'fa-archive'"></i>
                {{ showDrafts 
                  ? (locale === 'ar' ? 'عرض الحالات النشطة' : 'Show Active Cases') 
                  : (locale === 'ar' ? 'صندوق المسودات (المحذوفة)' : 'Drafts Box (Deleted)') }}
            </button>
          </div>
        </div>

        <div class="flex flex-col items-end gap-3 w-full md:w-auto">
          <transition name="fade">
            <div v-if="selectedCases.length > 0" class="flex gap-2 flex-wrap">
              <template v-if="showDrafts">
                <button @click="restoreSelected" class="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-emerald-500/20">
                  <i class="fas fa-undo"></i> {{ locale === 'ar' ? 'استعادة' : 'Restore' }} <span class="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{{ selectedCases.length }}</span>
                </button>
                <button @click="forceDeleteSelected" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-red-600/20">
                  <i class="fas fa-trash-alt"></i> {{ locale === 'ar' ? 'حذف نهائياً' : 'Delete Permanently' }} <span class="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{{ selectedCases.length }}</span>
                </button>
              </template>
              <template v-else>
                <button @click="deleteSelected" class="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-red-500/20">
                  <i class="fas fa-trash-alt"></i> {{ t('delete') }} <span class="bg-white/20 px-2 py-0.5 rounded text-xs">{{ selectedCases.length }}</span>
                </button>
              </template>
            </div>
          </transition>
          <div class="relative w-full md:w-64">
             <input type="text" :placeholder="t('search')" v-model="searchQuery" class="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all dark:text-white">
             <i class="fas fa-search absolute rtl:right-3.5 ltr:left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          </div>
        </div>
      </div>

      <!-- Table Wrapper -->
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left rtl:text-right border-collapse whitespace-nowrap custom-patient-table">
          <thead>
            <tr :class="getGroupHeaderClass(activeGroup)" class="text-[11px] uppercase tracking-wider font-bold">
              <th class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 w-10 text-center">
                <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" class="rounded border-slate-300 text-#063c31 focus:ring-#063c31 w-4 h-4 cursor-pointer">
              </th>
              
              <!-- Virtual Planning Group (Reordered) -->
              <template v-if="activeGroup === 'Virtual Planning'">
                <th v-if="hasPermission('columns', 'vp_patient')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('patient') }}</th>
                <th v-if="hasPermission('columns', 'vp_doctor')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('doctor') }}</th>
                <th class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('uuid') }}</th>
                <th class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('date') }}</th>
                <th v-if="hasPermission('columns', 'vp_plans')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('temp_treatment_plan') }}</th>
                <th v-if="hasPermission('columns', 'vp_plans')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('treatment_plan1') }}</th>
                <th v-if="hasPermission('columns', 'vp_plans')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('treatment_plan2') }}</th>
                <th v-if="hasPermission('columns', 'vp_status')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('status') }}</th>
                <th v-if="hasPermission('columns', 'vp_actions')" class="px-2 py-3 border-b border-slate-200 dark:border-slate-800 text-center">{{ t('actions') }}</th>
              </template>

              <!-- Finance Group (Reordered) -->
              <template v-else-if="activeGroup === 'Finance'">
                <th v-if="hasPermission('columns', 'fin_patient')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('patient') }}</th>
                <th v-if="hasPermission('columns', 'fin_doctor')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('doctor') }}</th>
                <th v-if="hasPermission('columns', 'fin_package')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('package') }}</th>
                <th v-if="hasPermission('columns', 'fin_price_list')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('price_list') }}</th>
                <th v-if="hasPermission('columns', 'fin_doc_notes')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('document_notes') }}</th>
                <th v-if="hasPermission('columns', 'fin_receipts')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('receipt_bills') }}</th>
              </template>

              <!-- Laboratory Group (Reordered) -->
              <template v-else-if="activeGroup === 'Laboratory'">
                <th v-if="hasPermission('columns', 'lab_patient')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('patient') }}</th>
                <th v-if="hasPermission('columns', 'lab_doctor')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('doctor') }}</th>
                <th v-if="hasPermission('columns', 'lab_case_type')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('type') }}</th>
                <th v-if="hasPermission('columns', 'lab_aligners')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('aligners_delivered') }}</th>
                <th v-if="hasPermission('columns', 'lab_accessories')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('accessories') }}</th>
                <th v-if="hasPermission('columns', 'lab_manufacturing')" class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('manufacturing') }}</th>
                <th class="px-2 py-3 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('date_modified') }}</th>
                <th v-if="hasPermission('columns', 'lab_actions')" class="px-2 py-3 border-b border-slate-200 dark:border-slate-800 text-center">{{ t('actions') }}</th>
              </template>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            <tr v-if="pending" v-for="i in 5" :key="i" class="animate-pulse">
              <td class="p-4" colspan="13">
                <div class="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
              </td>
            </tr>
            <tr v-else-if="paginatedCases.length === 0">
              <td colspan="13" class="p-8 text-center text-slate-500 dark:text-slate-400 font-semibold">
                لا توجد بيانات متاحة
              </td>
            </tr>
            <tr v-else v-for="(item, index) in paginatedCases" :key="item.id" 
                @click="(e) => handleRowClick(item, e)" 
                class="transition-all cursor-pointer border-l-4 border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/20"
                :class="getRowClass(item)">
              <td class="p-0 border-r border-slate-200 dark:border-slate-800 text-center align-middle" :class="getGroupColClass(activeGroup, 0)">
                <div class="w-full h-full min-h-[38px] flex items-center justify-center p-2">
                  <input type="checkbox" v-model="selectedCases" :value="item.id" class="rounded border-slate-300 text-#063c31 focus:ring-#063c31 w-4 h-4 cursor-pointer">
                </div>
              </td>
              <template v-if="activeGroup === 'Virtual Planning'">
                <!-- Patient Block -->
                <td v-if="hasPermission('columns', 'patient')" @click.stop="openModal(item, 'general')" class="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle" :class="getGroupColClass(activeGroup, 1)">
                  <NuxtLink :to="localePath(`/case-details/${item.id}`)" class="min-h-[38px] flex items-center justify-center px-2.5 py-1.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-xl relative group overflow-hidden"
                       :class="getPatientLinkClass(item)">
                    <span v-if="item.is_admin_read === 0" class="absolute top-0 right-4 flex h-3 w-3 rounded-full bg-white shadow-sm animate-pulse z-20"></span>
                    <div class="flex flex-col items-center justify-center">
                      <span class="text-[15px] font-black tracking-tight"
                            :class="item.is_admin_read === 0 ? 'text-white' : 'text-slate-800 dark:text-slate-100'">
                        {{ item.patient }}
                      </span>
                      <span v-if="item.parent_id || item.case_type === 'refinement'" 
                            class="text-[10px] mt-1 font-bold uppercase tracking-wider flex items-center gap-1"
                            :class="item.is_admin_read === 0 ? 'text-amber-100/90' : 'text-amber-600 dark:text-amber-400'">
                        <i class="fas fa-sync-alt text-[9px]"></i>
                        {{ getRefinementLabel(item) }}
                      </span>
                    </div>
                  </NuxtLink>
                </td>
 
                <!-- Doctor Block -->
                <td v-if="hasPermission('columns', 'doctor')" @click.stop="openModal(item, 'general')" class="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle" :class="getGroupColClass(activeGroup, 2)">
                  <div class="min-h-[38px] flex items-center justify-center px-2.5 py-1.5 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[2px_2px_5px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-xl cursor-pointer group">
                    <span class="text-slate-600 dark:text-slate-300 text-[14px] font-black tracking-tight group-hover:text-teal-600 transition-colors">{{ item.doctor }}</span>
                  </div>
                </td>
 
                <!-- UUID Block -->
                <td @click.stop="openModal(item, 'all')" class="p-4 border-r border-slate-200 dark:border-slate-800 text-center align-middle" :class="getGroupColClass(activeGroup, 3)">
                   <span class="text-slate-500 dark:text-slate-400 font-mono text-[12px] font-bold">{{ item.uuid }}</span>
                </td>
 
                <!-- Date Block -->
                <td @click.stop="openModal(item, 'general')" class="p-4 border-r border-slate-200 dark:border-slate-800 text-center align-middle cursor-pointer" :class="getGroupColClass(activeGroup, 4)">
                  <span class="text-slate-700 dark:text-slate-300 text-[13px] font-black">{{ item.date_modified.split(' ')[0] }}</span>
                </td>
                
                <!-- Temporary Treatment Plan Block -->
                <td v-if="hasPermission('columns', 'plans')" @click.stop="openModal(item, 'plans')" class="p-2 border-r border-slate-200 dark:border-slate-800 align-middle text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div class="flex flex-col items-stretch justify-center gap-2 w-full">
                        <div class="flex flex-col items-stretch justify-center gap-1 w-full" @click.stop>
                            <a v-if="item.temp_treatment_plan_file && !checkDefault(item.temp_treatment_plan_file)" :href="fixFileUrl(item.temp_treatment_plan_file)" target="_blank" class="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all mx-auto" :title="t('download_pdf')">
                                <i class="fas fa-file-pdf text-red-500 text-lg"></i>
                            </a>
                            <a v-if="item.temp_treatment_plan_url" :href="item.temp_treatment_plan_url" target="_blank" class="w-full h-8 flex items-center justify-center text-white bg-teal-500 rounded shadow-md hover:bg-teal-600 transition-all gap-2 px-2" :title="locale === 'ar' ? 'عرض الرابط' : 'View Link'">
                                <i class="fas fa-external-link-alt text-[10px]"></i>
                                <span class="text-[10px] font-bold">{{ locale === 'ar' ? 'رابط' : 'Link' }}</span>
                            </a>
                            <button v-if="item.temp_treatment_plan && !checkDefault(item.temp_treatment_plan)" @click.stop="openNoteModal(item.temp_treatment_plan, t('temp_treatment_plan'))" class="w-full h-8 flex items-center justify-center text-white bg-slate-500 rounded shadow-md hover:bg-slate-600 transition-all gap-2 px-2">
                              <i class="fas fa-comment-dots text-[10px]"></i>
                              <span class="text-[10px] font-bold">{{ locale === 'ar' ? 'ملاحظة' : 'Note' }}</span>
                            </button>
                            
                            <!-- Approve Button (Only for Super Admin) -->
                            <button 
                              v-if="isSuperAdmin && (item.temp_treatment_plan_file || item.temp_treatment_plan_url || item.temp_treatment_plan)" 
                              @click.stop="approveTemporaryPlan(item)" 
                              class="w-full h-8 flex items-center justify-center text-white bg-green-600 hover:bg-green-700 rounded shadow-md transition-all gap-2 px-2 mt-1"
                              :title="locale === 'ar' ? 'اعتماد ونقل للخطة 1' : 'Approve & Move to Plan 1'"
                            >
                              <i class="fas fa-check text-[10px]"></i>
                              <span class="text-[10px] font-bold">{{ locale === 'ar' ? 'اعتماد' : 'Approve' }}</span>
                            </button>
                        </div>
                        <span v-if="item.temp_treatment_plan_status && !checkDefault(item.temp_treatment_plan_status)" class="text-[11px] font-black uppercase tracking-tight text-emerald-600 dark:text-emerald-400">
                          {{ item.temp_treatment_plan_status }}
                        </span>
                        <span v-else-if="!(item.temp_treatment_plan_file && !checkDefault(item.temp_treatment_plan_file)) && !item.temp_treatment_plan_url && !(item.temp_treatment_plan && !checkDefault(item.temp_treatment_plan))" class="text-[12px] font-black text-slate-400">—</span>
                    </div>
                </td>

                <!-- Treatment Plan Status 1 Block -->
                <td v-if="hasPermission('columns', 'plans')" @click.stop="openModal(item, 'plans')" class="p-2 border-r border-slate-200 dark:border-slate-800 align-middle text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" :class="getGroupColClass(activeGroup, 5)">
                    <div class="flex flex-col items-stretch justify-center gap-2 w-full">
                        <div class="flex flex-col items-stretch justify-center gap-1 w-full">
                            <a v-if="item.treatment_plan1_file && !checkDefault(item.treatment_plan1_file)" :href="fixFileUrl(item.treatment_plan1_file)" target="_blank" class="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all mx-auto" :title="t('download_pdf')">
                                <i class="fas fa-file-pdf text-red-500 text-lg"></i>
                            </a>
                            <a v-if="item.treatment_plan1_url" :href="item.treatment_plan1_url" target="_blank" class="w-full h-8 flex items-center justify-center text-white bg-teal-500 rounded shadow-md hover:bg-teal-600 transition-all gap-2 px-2" :title="locale === 'ar' ? 'عرض الرابط' : 'View Link'">
                                <i class="fas fa-external-link-alt text-[10px]"></i>
                                <span class="text-[10px] font-bold">{{ locale === 'ar' ? 'رابط' : 'Link' }}</span>
                            </a>
                            <button v-if="item.treatment_plan1 && !checkDefault(item.treatment_plan1)" @click.stop="openNoteModal(item.treatment_plan1, t('treatment_plan1'))" class="w-full h-8 flex items-center justify-center text-white bg-slate-500 rounded shadow-md hover:bg-slate-600 transition-all gap-2 px-2">
                              <i class="fas fa-comment-dots text-[10px]"></i>
                              <span class="text-[10px] font-bold">{{ locale === 'ar' ? 'ملاحظة' : 'Note' }}</span>
                            </button>
                        </div>
                        <span v-if="item.treatment_plan1_status && !checkDefault(item.treatment_plan1_status)" class="text-[12px] font-black uppercase tracking-tight text-slate-800 dark:text-slate-200">
                          {{ item.treatment_plan1_status }}
                        </span>
                        <span v-else-if="!(item.treatment_plan1_file && !checkDefault(item.treatment_plan1_file)) && !item.treatment_plan1_url && !(item.treatment_plan1 && !checkDefault(item.treatment_plan1))" class="text-[12px] font-black text-slate-400">—</span>
                    </div>
                </td>
                
                <!-- Treatment Plan Status 2 Block -->
                <td v-if="hasPermission('columns', 'plans')" @click.stop="openModal(item, 'plans')" class="p-2 border-r border-slate-200 dark:border-slate-800 align-middle text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" :class="getGroupColClass(activeGroup, 6)">
                    <div class="flex flex-col items-stretch justify-center gap-2 w-full">
                        <div class="flex flex-col items-stretch justify-center gap-1 w-full">
                            <a v-if="item.treatment_plan2 && !checkDefault(item.treatment_plan2)" :href="fixFileUrl(item.treatment_plan2)" target="_blank" class="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all mx-auto" :title="t('download_pdf')">
                                <i class="fas fa-file-pdf text-red-500 text-lg"></i>
                            </a>
                            <a v-if="item.treatment_plan2_url" :href="item.treatment_plan2_url" target="_blank" class="w-full h-8 flex items-center justify-center text-white bg-teal-500 rounded shadow-md hover:bg-teal-600 transition-all gap-2 px-2" :title="locale === 'ar' ? 'عرض الرابط' : 'View Link'">
                                <i class="fas fa-external-link-alt text-[10px]"></i>
                                <span class="text-[10px] font-bold">{{ locale === 'ar' ? 'رابط' : 'Link' }}</span>
                            </a>
                            <button v-if="item.treatment_plan2_text && !checkDefault(item.treatment_plan2_text)" @click.stop="openNoteModal(item.treatment_plan2_text, t('treatment_plan2'))" class="w-full h-8 flex items-center justify-center text-white bg-slate-500 rounded shadow-md hover:bg-slate-600 transition-all gap-2 px-2">
                              <i class="fas fa-comment-dots text-[10px]"></i>
                              <span class="text-[10px] font-bold">{{ locale === 'ar' ? 'ملاحظة' : 'Note' }}</span>
                            </button>
                        </div>
                        <span v-if="item.treatment_plan2_status && !checkDefault(item.treatment_plan2_status)" class="text-[12px] font-black uppercase tracking-tight text-slate-800 dark:text-slate-200">
                          {{ item.treatment_plan2_status }}
                        </span>
                        <span v-else-if="!(item.treatment_plan2 && !checkDefault(item.treatment_plan2)) && !item.treatment_plan2_url && !(item.treatment_plan2_text && !checkDefault(item.treatment_plan2_text))" class="text-[12px] font-black text-slate-400">—</span>
                    </div>
                </td>
 
                <!-- Status -->
                <td @click.stop="openModal(item, 'general')" class="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle cursor-pointer" :class="getGroupColClass(activeGroup, 7)">
                    <div class="w-full min-h-[38px] flex items-center justify-center bg-gradient-to-br from-white/20 via-transparent to-black/20 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)] border-t border-white/30 border-l border-white/20 rounded-xl transition-all duration-300 hover:scale-105 hover:z-30 hover:shadow-2xl z-10" :class="getBadgeClass(item.status)">
                      <span v-if="item.status" class="text-[12px] font-black uppercase tracking-tight text-white-force">
                        {{ item.status }}
                      </span>
                      <span v-else class="text-slate-400 text-xs font-bold">-</span>
                    </div>
                </td>
              </template>

              <!-- Finance Cells -->
              <template v-else-if="activeGroup === 'Finance'">
                <!-- Patient Block -->
                <td v-if="hasPermission('columns', 'patient')" @click.stop="openModal(item, 'general')" class="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle cursor-pointer" :class="getGroupColClass(activeGroup, 1)">
                  <NuxtLink :to="localePath(`/case-details/${item.id}`)" class="min-h-[38px] flex items-center justify-center px-2.5 py-1.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-xl relative group overflow-hidden"
                       :class="getPatientLinkClass(item)">
                    <span v-if="item.is_admin_read === 0" class="absolute top-0 right-4 flex h-3 w-3 rounded-full bg-white shadow-sm animate-pulse z-20"></span>
                    <div class="flex flex-col items-center justify-center">
                      <span class="text-[15px] font-black tracking-tight"
                            :class="item.is_admin_read === 0 ? 'text-white' : 'text-slate-800 dark:text-slate-100'">
                        {{ item.patient }}
                      </span>
                      <span v-if="item.parent_id || item.case_type === 'refinement'" 
                            class="text-[10px] mt-1 font-bold uppercase tracking-wider flex items-center gap-1"
                            :class="item.is_admin_read === 0 ? 'text-amber-100/90' : 'text-amber-600 dark:text-amber-400'">
                        <i class="fas fa-sync-alt text-[9px]"></i>
                        {{ getRefinementLabel(item) }}
                      </span>
                    </div>
                  </NuxtLink>
                </td>

                <!-- Doctor Block -->
                <td v-if="hasPermission('columns', 'doctor')" @click.stop="openModal(item, 'general')" class="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle cursor-pointer" :class="getGroupColClass(activeGroup, 2)">
                  <div class="min-h-[38px] flex items-center justify-center px-2.5 py-1.5 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[2px_2px_5px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-xl cursor-pointer group">
                    <span class="text-slate-600 dark:text-slate-300 text-[14px] font-black tracking-tight group-hover:text-teal-600 transition-colors">{{ item.doctor }}</span>
                  </div>
                </td>

                <!-- Package Block -->
                <td v-if="hasPermission('columns', 'package')" @click.stop="openModal(item, 'package')" class="p-4 border-r border-slate-200 dark:border-slate-800 text-center align-middle font-black text-slate-700 dark:text-slate-200 cursor-pointer" :class="getGroupColClass(activeGroup, 3)">
                    <div class="flex flex-col items-center justify-center gap-1">
                        <span>{{ item.package }}</span>
                        <span v-if="item.sub_package" class="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-widest">{{ item.sub_package }}</span>
                    </div>
                </td>

                <!-- Price List Block -->
                <td v-if="hasPermission('columns', 'finance')" @click.stop="openModal(item, 'documents')" class="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle cursor-pointer" :class="getGroupColClass(activeGroup, 4)">
                    <div class="flex flex-wrap items-center justify-center gap-2 p-2 min-h-[38px]">
                        <!-- Old price_list_url if exists -->
                        <button v-if="item.price_list_url" @click.stop="openPreview(item.price_list_url, locale === 'ar' ? 'قائمة الأسعار' : 'Price List')" class="w-10 h-10 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-md transition-all hover:scale-110" :title="locale === 'ar' ? 'معاينة قائمة الأسعار' : 'Preview Price List'">
                            <i class="fas fa-file-invoice text-sm"></i>
                        </button>
                        <!-- Documents of type price_list -->
                        <template v-if="item.documents && item.documents.filter(d => d.type === 'price_list').length">
                            <button v-for="(doc, dIdx) in item.documents.filter(d => d.type === 'price_list')" :key="doc.id" @click.stop="openPreview(doc.url, doc.name || (locale === 'ar' ? 'قائمة الأسعار' : 'Price List'))" class="w-10 h-10 flex flex-col items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-110" :title="doc.name || 'Price List'">
                                <i v-if="doc.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)" class="fas fa-image text-sm"></i>
                                <i v-else class="fas fa-file-pdf text-sm text-red-500"></i>
                                <span class="text-[8px] font-black truncate w-8 text-center">{{ dIdx + 1 }}</span>
                            </button>
                        </template>
                        <!-- If none -->
                        <span v-if="!item.price_list_url && (!item.documents || !item.documents.filter(d => d.type === 'price_list').length)" class="text-slate-400 font-bold">-</span>
                    </div>
                </td>

                <!-- Document Notes Block -->
                <td v-if="hasPermission('columns', 'finance')" @click.stop="openModal(item, 'documents')" class="p-4 border-r border-slate-200 dark:border-slate-800 text-center align-middle font-semibold text-slate-800 dark:text-white cursor-pointer" :class="getGroupColClass(activeGroup, 5)">
                    {{ item.document_notes || '--' }}
                </td>

                <!-- Receipt Block -->
                <td v-if="hasPermission('columns', 'finance')" @click.stop="openModal(item, 'documents')" class="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle cursor-pointer" :class="getGroupColClass(activeGroup, 6)">
                    <div class="flex flex-wrap items-center justify-center gap-2 p-2 min-h-[38px]">
                        <!-- Old receipt_url if exists -->
                        <button v-if="item.receipt_url" @click.stop="openPreview(item.receipt_url, locale === 'ar' ? 'الفاتورة' : 'Receipt')" class="w-10 h-10 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-all hover:scale-110" :title="locale === 'ar' ? 'معاينة الفاتورة' : 'Preview Receipt'">
                            <i class="fas fa-receipt text-sm"></i>
                        </button>
                        <!-- Documents of type receipt or bill -->
                        <template v-if="item.documents && item.documents.filter(d => d.type === 'receipt' || d.type === 'bill').length">
                            <button v-for="(doc, dIdx) in item.documents.filter(d => d.type === 'receipt' || d.type === 'bill')" :key="doc.id" @click.stop="openPreview(doc.url, doc.name || (doc.type === 'receipt' ? (locale === 'ar' ? 'الفاتورة' : 'Receipt') : (locale === 'ar' ? 'سند قبض' : 'Bill')))" class="w-10 h-10 flex flex-col items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-110" :class="doc.type === 'receipt' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'" :title="doc.name || (doc.type === 'receipt' ? 'Receipt' : 'Bill')">
                                <i v-if="doc.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)" class="fas fa-image text-sm"></i>
                                <i v-else-if="doc.type === 'receipt'" class="fas fa-receipt text-sm text-emerald-500"></i>
                                <i v-else class="fas fa-file-invoice-dollar text-sm text-amber-500"></i>
                                <span class="text-[8px] font-black truncate w-8 text-center">{{ dIdx + 1 }}</span>
                            </button>
                        </template>
                        <!-- If none -->
                        <span v-if="!item.receipt_url && (!item.documents || !item.documents.filter(d => d.type === 'receipt' || d.type === 'bill').length)" class="text-slate-400 font-bold">-</span>
                    </div>
                </td>
              </template>

              <!-- Laboratory Cells -->
              <template v-else-if="activeGroup === 'Laboratory'">
                <!-- Patient Block -->
                <td v-if="hasPermission('columns', 'patient')" @click.stop="openModal(item, 'general')" class="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle cursor-pointer" :class="getGroupColClass(activeGroup, 1)">
                  <NuxtLink :to="localePath(`/case-details/${item.id}`)" class="min-h-[38px] flex items-center justify-center px-2.5 py-1.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-xl relative group overflow-hidden"
                       :class="getPatientLinkClass(item)">
                    <span v-if="item.is_admin_read === 0" class="absolute top-0 right-4 flex h-3 w-3 rounded-full bg-white shadow-sm animate-pulse z-20"></span>
                    <div class="flex flex-col items-center justify-center">
                      <span class="text-[15px] font-black tracking-tight"
                            :class="item.is_admin_read === 0 ? 'text-white' : 'text-slate-800 dark:text-slate-100'">
                        {{ item.patient }}
                      </span>
                      <span v-if="item.parent_id || item.case_type === 'refinement'" 
                            class="text-[10px] mt-1 font-bold uppercase tracking-wider flex items-center gap-1"
                            :class="item.is_admin_read === 0 ? 'text-amber-100/90' : 'text-amber-600 dark:text-amber-400'">
                        <i class="fas fa-sync-alt text-[9px]"></i>
                        {{ getRefinementLabel(item) }}
                      </span>
                    </div>
                  </NuxtLink>
                </td>

                <!-- Doctor Block -->
                <td v-if="hasPermission('columns', 'doctor')" @click.stop="openModal(item, 'general')" class="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle cursor-pointer" :class="getGroupColClass(activeGroup, 2)">
                  <div class="min-h-[38px] flex items-center justify-center px-2.5 py-1.5 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[2px_2px_5px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-xl cursor-pointer group">
                    <span class="text-slate-600 dark:text-slate-300 text-[14px] font-black tracking-tight group-hover:text-teal-600 transition-colors">{{ item.doctor }}</span>
                  </div>
                </td>

                <!-- Type Block -->
                <td v-if="hasPermission('columns', 'case_type')" @click.stop="openModal(item, 'general')" class="p-4 border-r border-slate-200 dark:border-slate-800 text-center align-middle font-black text-slate-700 dark:text-slate-200 cursor-pointer" :class="getGroupColClass(activeGroup, 3)">
                    {{ item.case_type || '-' }}
                </td>
                
                <!-- Aligners Block -->
                <td v-if="hasPermission('columns', 'aligners')" @click.stop="openModal(item, 'aligners')" class="p-2 border-r border-slate-200 dark:border-slate-800 align-middle text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" :class="getGroupColClass(activeGroup, 4)">
                  <div class="flex flex-col items-stretch justify-center gap-2 w-full">
                      <div class="flex items-center justify-center gap-1 w-full" v-if="item.aligners_upper || item.aligners_lower">
                          <div class="flex-1 bg-blue-100 dark:bg-blue-900/50 px-2 py-1.5 rounded border border-blue-200 text-[10px] font-black text-blue-700 dark:text-blue-300">U: {{ item.aligners_upper || '0' }}</div>
                          <div class="flex-1 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1.5 rounded border border-indigo-200 text-[10px] font-black text-indigo-700 dark:text-indigo-300">L: {{ item.aligners_lower || '0' }}</div>
                      </div>
                      <button v-if="item.aligners_notes" @click.stop="openNoteModal(item.aligners_notes, t('aligners_delivered'))" class="w-full h-8 flex items-center justify-center bg-teal-500 text-white rounded shadow hover:bg-teal-600 transition-all gap-2">
                          <i class="fas fa-sticky-note text-[10px]"></i>
                          <span class="text-[10px] font-bold">{{ locale === 'ar' ? 'ملاحظة' : 'Note' }}</span>
                      </button>
                      <span v-else-if="!item.aligners_upper && !item.aligners_lower" class="text-slate-400 font-bold">-</span>
                  </div>
                </td>
                
                <!-- Accessories Block -->
                <td v-if="hasPermission('columns', 'accessories')" @click.stop="openModal(item, 'accessories')" class="p-2 border-r border-slate-200 dark:border-slate-800 align-middle text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" :class="getGroupColClass(activeGroup, 5)">
                  <div class="flex flex-col items-stretch justify-center gap-2 w-full">
                      <div class="flex items-center justify-center gap-1 w-full" v-if="item.accessories_data && getActiveAccessoriesCount(item.accessories_data) > 0">
                           <div v-for="(summary, index) in getAccessoriesSummary(item.accessories_data).slice(0, 2)" :key="index" class="w-full text-center text-[9px] font-black bg-slate-100 dark:bg-slate-700 px-1.5 py-1.5 rounded border border-slate-200 truncate">
                              {{ summary.label }}: {{ summary.teeth }}
                           </div>
                           <span v-if="getAccessoriesSummary(item.accessories_data).length > 2" class="text-[8px] text-slate-500 font-black">+{{ getAccessoriesSummary(item.accessories_data).length - 2 }} more</span>
                      </div>
                      <button v-if="item.accessories_notes" @click.stop="openNoteModal(item.accessories_notes, t('accessories'))" class="w-full h-8 flex items-center justify-center bg-rose-500 text-white rounded shadow hover:bg-rose-600 transition-all gap-2">
                          <i class="fas fa-sticky-note text-[10px]"></i>
                          <span class="text-[10px] font-bold">{{ locale === 'ar' ? 'ملاحظة' : 'Note' }}</span>
                      </button>
                      <span v-else-if="!item.accessories_data || getActiveAccessoriesCount(item.accessories_data) === 0" class="text-slate-400 font-bold">-</span>
                  </div>
                </td>

                <!-- Manufacturing -->
                <td @click.stop="openModal(item, 'general')" class="p-2 border-r border-slate-200 dark:border-slate-800 text-center align-middle cursor-pointer" :class="getGroupColClass(activeGroup, 6)">
                    <div class="w-full min-h-[38px] flex items-center justify-center bg-gradient-to-br from-white/20 via-transparent to-black/20 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)] border-t border-white/30 border-l border-white/20 rounded-xl transition-all duration-300 hover:scale-105 hover:z-30 hover:shadow-2xl z-10" :class="getLabBadgeClass(item.lab_status)">
                      <span v-if="item.lab_status" class="text-[12px] font-black uppercase tracking-tight text-white-force">
                        {{ item.lab_status }}
                      </span>
                      <span v-else class="text-slate-400 text-xs font-bold">-</span>
                    </div>
                </td>

                <!-- Date Modified Block -->
                <td @click.stop="openHistoryModal(item.modification_log)" class="p-4 border-r border-slate-200 dark:border-slate-800 text-center align-middle cursor-pointer" :class="getGroupColClass(activeGroup, 7)">
                    <button class="text-indigo-600 dark:text-indigo-400 font-black text-[12px] hover:underline underline-offset-4 decoration-2">
                        {{ item.date_modified.split(' ')[0] }}
                    </button>
                </td>

                <!-- Actions Block -->
                <td v-if="hasPermission('columns', 'actions')" @click.stop class="p-4 align-middle text-center" :class="getGroupColClass(activeGroup, 8)">
                    <div class="flex items-center justify-center gap-2">
                        <template v-if="showDrafts">
                          <button @click.stop="restoreSingleRow(item.id)" class="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white rounded shadow-lg hover:bg-emerald-600 active:scale-95 transition-all cursor-pointer" :title="locale === 'ar' ? 'استعادة' : 'Restore'">
                            <i class="fas fa-undo text-xs"></i>
                          </button>
                          <button @click.stop="forceDeleteSingleRow(item.id)" class="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded shadow-lg hover:bg-red-700 active:scale-95 transition-all cursor-pointer" :title="locale === 'ar' ? 'حذف نهائياً' : 'Delete Permanently'">
                            <i class="fas fa-trash-alt text-xs"></i>
                          </button>
                        </template>
                        <template v-else>
                          <button @click.stop="openModal(item)" class="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 active:scale-95 transition-all cursor-pointer">
                            <i class="fas fa-pen text-xs"></i>
                          </button>
                          <button v-if="hasPermission('actions', 'delete_case')" @click.stop="deleteSingleRow(item.id)" class="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded shadow-lg hover:bg-red-600 active:scale-95 transition-all cursor-pointer">
                            <i class="fas fa-trash-alt text-xs"></i>
                          </button>
                        </template>
                    </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination Controls -->
      <!-- Advanced Pagination Footer -->
      <div v-if="totalPages > 1" class="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-6 mt-auto">
        <div class="flex items-center gap-3">
            <span class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {{ t('page') }} 
            </span>
            <div class="px-4 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-black text-teal-600 dark:text-teal-400 shadow-inner flex items-center gap-2">
                <span>{{ currentPage }}</span>
                <span class="text-slate-300 dark:text-slate-700">/</span>
                <span class="opacity-60">{{ totalPages }}</span>
            </div>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          <!-- Jump to First -->
          <button 
            @click="currentPage = 1" 
            :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500"
            :title="locale === 'ar' ? 'الصفحة الأولى' : 'First Page'"
          >
            <i class="fas fa-angle-double-left rtl:rotate-180"></i>
          </button>

          <!-- Prev Page -->
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500"
          >
            <i class="fas fa-chevron-left rtl:rotate-180"></i>
          </button>

          <!-- Numbered Pages -->
          <div class="flex items-center gap-2 px-1">
            <template v-for="p in visiblePages" :key="p">
                <span v-if="p === '...'" class="px-2 text-slate-400 font-bold italic select-none">...</span>
                <button 
                  v-else
                  @click="currentPage = p"
                  class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border outline-none active:translate-y-[2px] active:shadow-none"
                  :class="p === currentPage 
                    ? 'bg-gradient-to-b from-teal-400 to-teal-600 text-white border-teal-500 shadow-[0_4px_0_rgb(13,148,136),0_8px_15px_rgba(20,184,166,0.2)]' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] hover:border-teal-500/50 hover:text-teal-500'"
                >
                  {{ p }}
                </button>
            </template>
          </div>

          <!-- Next Page -->
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500"
          >
            <i class="fas fa-chevron-right rtl:rotate-180"></i>
          </button>

          <!-- Jump to Last -->
          <button 
            @click="currentPage = totalPages" 
            :disabled="currentPage === totalPages"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500"
            :title="locale === 'ar' ? 'الصفحة الأخيرة' : 'Last Page'"
          >
            <i class="fas fa-angle-double-right rtl:rotate-180"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal Dialog -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all" @click.self="closeModal">
        <div class="bg-white dark:bg-slate-900 w-screen h-screen overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 relative z-[101]">
          <!-- Modal Header -->
          <div class="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 shadow-sm relative z-20">
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <i class="fas fa-edit text-teal-500"></i> {{ modalTitle }} <span class="text-teal-600 dark:text-teal-400 font-mono tracking-tighter opacity-80">{{ editForm.uuid }}</span>
            </h3>
            <button @click="closeModal" class="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 h-12 w-12 rounded-xl flex items-center justify-center transition-all">
                <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="p-10 space-y-12 overflow-y-auto flex-1 custom-scroll bg-slate-50/20 dark:bg-slate-950/20 relative">
            
            <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10" v-show="(activeModalSection === 'all' || activeModalSection === 'general') && hasPermission('actions', 'edit_general')">
                <!-- Patient Name -->
                <div class="space-y-2">
                  <label class="block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('patient_name') }}</label>
                  <input type="text" v-model="editForm.patient" class="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-lg font-bold focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none dark:text-white transition-all shadow-inner">
                </div>

                <!-- General Status -->
                <div class="space-y-2">
                  <label class="block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('general_status') }}</label>
                  <div class="relative">
                      <select v-model="editForm.status" class="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-lg font-bold focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none dark:text-white transition-all shadow-inner appearance-none cursor-pointer">
                        <option v-if="editForm.status && !['complete submission', 'incomplete submission', 'rejected'].includes(editForm.status)" :value="editForm.status" disabled>
                          {{ editForm.status }}
                        </option>
                        <option value="complete submission">{{ locale === 'ar' ? 'تقديم مكتمل (Complete)' : 'Complete' }}</option>
                        <option value="incomplete submission">{{ locale === 'ar' ? 'تقديم غير مكتمل (Incomplete)' : 'Incomplete' }}</option>
                        <option value="rejected">{{ locale === 'ar' ? 'مرفوض (Rejected)' : 'Rejected' }}</option>
                      </select>
                      <i class="fas fa-chevron-down absolute rtl:left-6 ltr:right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                  </div>
                </div>

                <!-- Lab Status -->
                <div class="space-y-2">
                  <label class="block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('lab_status_label') }}</label>
                  <div class="relative">
                      <select v-model="editForm.lab_status" class="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-lg font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none dark:text-white transition-all shadow-inner appearance-none cursor-pointer">
                        <option value="">{{ t('not_specified') }}</option>
                        <option v-for="ls in labStatuses" :key="ls" :value="ls" class="text-slate-900 dark:text-white">{{ ls }}</option>
                      </select>
                      <i class="fas fa-flask absolute rtl:right-6 ltr:left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                      <i class="fas fa-chevron-down absolute rtl:left-6 ltr:right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                  </div>
                </div>

                <!-- Case Type -->
                <div class="space-y-2">
                  <label class="block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ locale === 'ar' ? 'نوع الحالة (Case Type)' : 'Case Type' }}</label>
                  <div class="relative">
                      <select v-model="editForm.case_type" class="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-lg font-bold focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none dark:text-white transition-all shadow-inner appearance-none cursor-pointer">
                        <option value="aligner">Aligner</option>
                        <option value="retainer">Retainer</option>
                        <option value="refinement">Refinement</option>
                      </select>
                      <i class="fas fa-chevron-down absolute rtl:left-6 ltr:right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                  </div>
                </div>
            </div>

            <hr class="border-t-2 border-slate-300 dark:border-slate-700 relative z-0" v-show="activeModalSection === 'all'">

            <!-- Category Assignment -->
            <div class="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 bg-slate-100/60 dark:bg-slate-800/40 space-y-6 relative z-10 shadow-sm transition-all hover:shadow-md" v-show="(activeModalSection === 'all' || activeModalSection === 'package') && hasPermission('actions', 'edit_package')">
              <h4 class="text-xl font-black text-slate-800 dark:text-slate-300 flex items-center gap-3 pb-4 border-b-2 border-slate-300 dark:border-slate-700 uppercase tracking-widest"><i class="fas fa-tags text-2xl"></i> {{ locale === 'ar' ? 'الباقة' : 'Package' }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="space-y-2">
                    <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('main_category') }}</label>
                    <div class="relative">
                        <select v-model="editForm.main_category_id" @change="editForm.sub_category_id = null; editForm.sub_category_id2 = null" class="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-bold outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 dark:text-white shadow-sm cursor-pointer appearance-none">
                          <option :value="null">{{ t('select_category') }}</option>
                          <option v-for="cat in allCategories" :key="cat.id" :value="cat.id">{{ locale === 'ar' ? cat.name_ar : cat.name_en }}</option>
                        </select>
                        <i class="fas fa-chevron-down absolute rtl:left-5 ltr:right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ locale === 'ar' ? 'القسم الفرعي الأول' : 'Sub Category 1' }}</label>
                    <div class="relative">
                        <select v-model="editForm.sub_category_id" :disabled="!editForm.main_category_id" class="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-bold outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 dark:text-white shadow-sm cursor-pointer appearance-none disabled:opacity-50">
                          <option :value="null">{{ t('select_sub_category') }}</option>
                          <option v-for="sub in filteredSubCategories" :key="sub.id" :value="sub.id">{{ locale === 'ar' ? sub.name_ar : sub.name_en }}</option>
                        </select>
                        <i class="fas fa-chevron-down absolute rtl:left-5 ltr:right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ locale === 'ar' ? 'القسم الفرعي الثاني' : 'Sub Category 2' }}</label>
                    <div class="relative">
                        <select v-model="editForm.sub_category_id2" :disabled="!editForm.main_category_id" class="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-bold outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 dark:text-white shadow-sm cursor-pointer appearance-none disabled:opacity-50">
                          <option :value="null">{{ t('select_sub_category') }}</option>
                          <option v-for="sub in filteredSubCategories" :key="sub.id" :value="sub.id">{{ locale === 'ar' ? sub.name_ar : sub.name_en }}</option>
                        </select>
                        <i class="fas fa-chevron-down absolute rtl:left-5 ltr:right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>
                  </div>
              </div>
            </div>
            
            <hr class="border-t-2 border-slate-300 dark:border-slate-700 relative z-0" v-show="activeModalSection === 'all'">
            
            <div class="grid grid-cols-1 gap-6 relative z-10" v-show="(activeModalSection === 'all' || activeModalSection === 'aligners' || activeModalSection === 'accessories') && (hasPermission('actions', 'edit_aligners') || hasPermission('actions', 'edit_accessories'))">
                <!-- Aligners Delivered Section -->
                <div class="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-sm" v-show="(activeModalSection === 'all' || activeModalSection === 'aligners') && hasPermission('actions', 'edit_aligners')">
                    <h4 class="text-xl font-black text-slate-800 dark:text-slate-300 flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800 uppercase tracking-widest">
                       <i class="fas fa-box-open text-2xl"></i> {{ t('aligners_delivered') }}
                    </h4>
                    <div class="grid grid-cols-2 gap-8 mb-6">
                        <div class="space-y-2">
                             <label class="block text-xs font-black text-slate-500 dark:text-slate-400 mb-2 text-center uppercase tracking-widest">{{ t('upper') }}</label>
                             <input type="number" v-model="editForm.aligners_upper" placeholder="0" min="0" class="w-full px-6 py-4 rounded-2xl border-2 border-teal-200 dark:border-teal-700/50 bg-white dark:bg-slate-800 text-center text-2xl font-black text-slate-700 dark:text-teal-100 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all shadow-inner">
                        </div>
                        <div class="space-y-2">
                             <label class="block text-xs font-black text-slate-500 dark:text-slate-400 mb-2 text-center uppercase tracking-widest">{{ t('lower') }}</label>
                             <input type="number" v-model="editForm.aligners_lower" placeholder="0" min="0" class="w-full px-6 py-4 rounded-2xl border-2 border-teal-200 dark:border-teal-700/50 bg-white dark:bg-slate-800 text-center text-2xl font-black text-slate-700 dark:text-teal-100 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all shadow-inner">
                        </div>
                    </div>
                    <div class="space-y-2">
                         <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('aligners_notes_label') }}</label>
                         <textarea v-model="editForm.aligners_notes" rows="3" :placeholder="t('add_notes_placeholder')" class="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-medium outline-none focus:ring-4 focus:ring-teal-500/20 dark:text-white shadow-sm resize-none transition-all"></textarea>
                    </div>
                </div>

                <!-- Accessories Wizard UI -->
                <div class="p-8 rounded-3xl border-2 border-[#d1b06b]/30 bg-[#063c31] space-y-6 shadow-2xl relative overflow-hidden" v-show="(activeModalSection === 'all' || activeModalSection === 'accessories') && hasPermission('actions', 'edit_accessories')">
                    <!-- Glow effect -->
                    <div class="absolute inset-0 bg-gradient-to-br from-[#d1b06b]/5 to-transparent pointer-events-none"></div>

                    <h4 class="font-black text-[#d1b06b] flex items-center justify-center gap-3 pb-4 border-b border-[#d1b06b]/20 uppercase tracking-[0.3em] text-lg">
                      <i class="fas fa-magic text-2xl"></i> {{ t('accessories') }}
                    </h4>
                    
                    <div class="flex flex-col lg:flex-row gap-8">
                        <!-- Left Side: Controls -->
                        <div class="lg:w-1/4 space-y-8">
                            <!-- Type Selector -->
                            <div class="space-y-4">
                                <label class="block text-[10px] font-black text-[#d1b06b]/60 uppercase tracking-widest text-center">{{ t('type') }}</label>
                                <div class="flex flex-col gap-3">
                                    <button @click.prevent="activeAccessoryType = 'Buttons'" :class="activeAccessoryType === 'Buttons' ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.45)] border-amber-400' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'" class="w-full py-4 rounded-2xl font-black text-sm transition-all uppercase tracking-widest border-2 border-transparent">{{ t('buttons') }}</button>
                                    <button @click.prevent="activeAccessoryType = 'Slits'" :class="activeAccessoryType === 'Slits' ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.45)] border-cyan-400' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'" class="w-full py-4 rounded-2xl font-black text-sm transition-all uppercase tracking-widest border-2 border-transparent">{{ t('slits') }}</button>
                                </div>
                            </div>

                            <!-- Surface Selector -->
                            <div class="space-y-4">
                                <label class="block text-[10px] font-black text-[#d1b06b]/60 uppercase tracking-widest text-center">{{ t('surface') }}</label>
                                <div class="flex flex-col gap-3">
                                    <button @click.prevent="activeSurface = 'Buccal'" :class="activeSurface === 'Buccal' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)] border-emerald-400' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'" class="w-full py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border-2 border-transparent">{{ t('buccal') }}</button>
                                    <button @click.prevent="activeSurface = 'Lingual'" :class="activeSurface === 'Lingual' ? 'bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.35)] border-violet-400' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'" class="w-full py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border-2 border-transparent">{{ t('lingual') }}</button>
                                </div>
                            </div>

                            <button @click.prevent="clearActiveSection" v-if="getActiveAccessoriesCount(editForm.accessories_data) > 0" class="w-full py-4 text-xs font-black text-red-400 hover:text-red-300 border border-red-500/30 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest bg-red-500/5 mt-8">
                                <i class="fas fa-eraser"></i> {{ t('clear_section') }}
                            </button>
                        </div>

                        <!-- Right Side: Teeth Grids -->
                        <div class="lg:w-3/4 space-y-10 bg-black/20 p-6 rounded-3xl border border-white/5 shadow-inner overflow-x-auto">
                            <!-- Upper Jaw Section -->
                            <div class="space-y-4 min-w-[320px]">
                                <div class="flex items-center gap-4 mb-2">
                                    <span class="h-px flex-1 bg-white/10"></span>
                                    <span class="text-[10px] font-black text-[#d1b06b] uppercase tracking-[0.4em]">{{ t('upper') }}</span>
                                    <span class="h-px flex-1 bg-white/10"></span>
                                </div>
                                
                                <div class="flex items-center justify-center gap-1.5 md:gap-2.5 w-full">
                                    <!-- Right side teeth -->
                                    <div class="flex items-center gap-0.5 sm:gap-1">
                                        <button v-for="tooth in upperRightTeeth" :key="tooth" @click.prevent="toggleTooth(tooth, 'Upper')" 
                                                :class="getToothClass(tooth, 'Upper')" 
                                                class="w-8 h-8 sm:w-9 sm:h-9 md:w-10.5 md:h-10.5 rounded-lg sm:rounded-xl font-black text-[7.5px] sm:text-[9px] md:text-[10px] transition-all border-2 flex flex-col items-center justify-center relative pb-1 pt-0.5">
                                            <span class="leading-none">{{ tooth }}</span>
                                            <!-- Active indicator dot (Messenger style) -->
                                            <span v-if="isToothSelected(tooth, 'Upper')" class="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
                                        </button>
                                    </div>
                                    
                                    <!-- Vertical Divider -->
                                    <div class="w-0.5 h-7 sm:h-8 md:h-10 bg-white/20 rounded"></div>
                                    
                                    <!-- Left side teeth -->
                                    <div class="flex items-center gap-0.5 sm:gap-1">
                                        <button v-for="tooth in upperLeftTeeth" :key="tooth" @click.prevent="toggleTooth(tooth, 'Upper')" 
                                                :class="getToothClass(tooth, 'Upper')" 
                                                class="w-8 h-8 sm:w-9 sm:h-9 md:w-10.5 md:h-10.5 rounded-lg sm:rounded-xl font-black text-[7.5px] sm:text-[9px] md:text-[10px] transition-all border-2 flex flex-col items-center justify-center relative pb-1 pt-0.5">
                                            <span class="leading-none">{{ tooth }}</span>
                                            <!-- Active indicator dot (Messenger style) -->
                                            <span v-if="isToothSelected(tooth, 'Upper')" class="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Lower Jaw Section -->
                            <div class="space-y-4 min-w-[320px]">
                                <div class="flex items-center gap-4 mb-2">
                                    <span class="h-px flex-1 bg-white/10"></span>
                                    <span class="text-[10px] font-black text-[#d1b06b] uppercase tracking-[0.4em]">{{ t('lower') }}</span>
                                    <span class="h-px flex-1 bg-white/10"></span>
                                </div>
                                
                                <div class="flex items-center justify-center gap-1.5 md:gap-2.5 w-full">
                                    <!-- Right side teeth -->
                                    <div class="flex items-center gap-0.5 sm:gap-1">
                                        <button v-for="tooth in lowerRightTeeth" :key="tooth" @click.prevent="toggleTooth(tooth, 'Lower')" 
                                                :class="getToothClass(tooth, 'Lower')" 
                                                class="w-8 h-8 sm:w-9 sm:h-9 md:w-10.5 md:h-10.5 rounded-lg sm:rounded-xl font-black text-[7.5px] sm:text-[9px] md:text-[10px] transition-all border-2 flex flex-col items-center justify-center relative pb-1 pt-0.5">
                                            <span class="leading-none">{{ tooth }}</span>
                                            <!-- Active indicator dot (Messenger style) -->
                                            <span v-if="isToothSelected(tooth, 'Lower')" class="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
                                        </button>
                                    </div>
                                    
                                    <!-- Vertical Divider -->
                                    <div class="w-0.5 h-7 sm:h-8 md:h-10 bg-white/20 rounded"></div>
                                    
                                    <!-- Left side teeth -->
                                    <div class="flex items-center gap-0.5 sm:gap-1">
                                        <button v-for="tooth in lowerLeftTeeth" :key="tooth" @click.prevent="toggleTooth(tooth, 'Lower')" 
                                                :class="getToothClass(tooth, 'Lower')" 
                                                class="w-8 h-8 sm:w-9 sm:h-9 md:w-10.5 md:h-10.5 rounded-lg sm:rounded-xl font-black text-[7.5px] sm:text-[9px] md:text-[10px] transition-all border-2 flex flex-col items-center justify-center relative pb-1 pt-0.5">
                                            <span class="leading-none">{{ tooth }}</span>
                                            <!-- Active indicator dot (Messenger style) -->
                                            <span v-if="isToothSelected(tooth, 'Lower')" class="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 pt-8 border-t border-white/10 space-y-3">
                        <label class="block text-[10px] font-black text-[#d1b06b]/50 uppercase tracking-widest">{{ t('accessories_notes_label') }}</label>
                        <textarea v-model="editForm.accessories_notes" rows="3" :placeholder="t('add_accessories_placeholder')" class="w-full px-6 py-4 rounded-2xl border-2 border-white/10 bg-black/20 text-lg font-medium outline-none focus:ring-4 focus:ring-[#d1b06b]/20 focus:border-[#d1b06b]/50 text-white shadow-inner resize-none transition-all"></textarea>
                    </div>
                </div>
            </div>
            
            <hr class="border-t-2 border-slate-300 dark:border-slate-700 relative z-0" v-show="activeModalSection === 'all'">

            <!-- Temporary Plan Section (Only for Admin/Assistants) -->
            <div class="p-8 rounded-3xl border border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-8 relative z-10 shadow-sm transition-all hover:shadow-md" v-show="(activeModalSection === 'all' || activeModalSection === 'plans') && hasPermission('actions', 'edit_plans')">
              <h4 class="text-xl font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-3 pb-4 border-b-2 border-emerald-250 dark:border-emerald-800 uppercase tracking-widest"><i class="fas fa-file-invoice text-2xl"></i> {{ t('temp_treatment_plan') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- File Upload Temp Plan -->
                  <div class="space-y-2">
                    <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('upload_attachment') }}</label>
                    <div class="relative flex flex-col items-start w-full gap-4">
                      <label class="flex flex-col items-center justify-center w-full h-36 border-4 border-slate-200 dark:border-slate-800 border-dashed rounded-3xl cursor-pointer bg-white dark:bg-slate-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-400 group transition-all shadow-inner">
                          <div class="flex flex-col items-center justify-center pt-5 pb-6">
                              <i class="fas fa-cloud-upload-alt text-4xl text-slate-300 dark:text-slate-700 group-hover:text-emerald-400 transition-all mb-3"></i>
                              <p class="text-sm text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider" v-if="!editForm.selectedFileTemp">{{ t('click_to_upload') }}</p>
                              <p class="text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-4 py-1 rounded-full shadow-sm" v-else>{{ editForm.selectedFileTemp.name }}</p>
                          </div>
                          <input type="file" accept=".pdf,image/*" @change="onFileSelectedTemp" class="hidden" />
                      </label>
                      <div v-if="editForm.temp_treatment_plan_file_url && !editForm.selectedFileTemp" class="flex items-center gap-3 w-full">
                        <a :href="fixFileUrl(editForm.temp_treatment_plan_file_url)" target="_blank" class="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 text-base font-black bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-emerald-600 hover:text-emerald-700 hover:bg-slate-50 dark:text-emerald-400 dark:hover:bg-slate-700 transition-all shadow-md">
                            <i class="fas fa-external-link-alt text-lg"></i> {{ t('browse_current') }}
                        </a>
                        <button @click.prevent="removeAttachmentTemp" class="h-14 w-14 flex items-center justify-center text-xl font-bold bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 border-2 border-red-200 dark:border-red-500/30 rounded-2xl transition-all shadow-md" :title="t('delete_permanent')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-2">
                      <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('add_plan_notes') }}</label>
                      <textarea v-model="editForm.temp_treatment_plan" rows="4" :placeholder="t('add_plan_notes_placeholder')" class="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-medium outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white shadow-sm transition-all resize-y"></textarea>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('plan_url') }}</label>
                        <div class="relative group">
                          <i class="fas fa-link absolute rtl:right-5 ltr:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
                          <input type="text" v-model="editForm.temp_treatment_plan_url" placeholder="https://..." class="w-full px-12 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white shadow-sm transition-all">
                        </div>
                        <p class="mt-3 text-xs text-slate-400 font-black italic tracking-wide opacity-70">* {{ t('view_link_hint') }}</p>
                    </div>
                  </div>
              </div>
            </div>

            <!-- Plan 1 Section -->
            <div class="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 bg-slate-100/60 dark:bg-slate-800/40 space-y-8 relative z-10 shadow-sm transition-all hover:shadow-md" v-show="(activeModalSection === 'all' || activeModalSection === 'plans') && hasPermission('actions', 'edit_plans')">
              <h4 class="text-xl font-black text-slate-800 dark:text-slate-300 flex items-center gap-3 pb-4 border-b-2 border-slate-300 dark:border-slate-700 uppercase tracking-widest"><i class="fas fa-file-medical-alt text-2xl"></i> {{ t('treatment_plan_1') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- File Upload Plan 1 -->
                  <div class="space-y-2">
                    <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('upload_attachment') }}</label>
                    <div class="relative flex flex-col items-start w-full gap-4">
                      <label class="flex flex-col items-center justify-center w-full h-36 border-4 border-slate-200 dark:border-slate-800 border-dashed rounded-3xl cursor-pointer bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 group transition-all shadow-inner">
                          <div class="flex flex-col items-center justify-center pt-5 pb-6">
                              <i class="fas fa-cloud-upload-alt text-4xl text-slate-300 dark:text-slate-700 group-hover:text-blue-400 transition-all mb-3"></i>
                              <p class="text-sm text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider" v-if="!editForm.selectedFile1">{{ t('click_to_upload') }}</p>
                              <p class="text-sm font-black text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-4 py-1 rounded-full shadow-sm" v-else>{{ editForm.selectedFile1.name }}</p>
                          </div>
                          <input type="file" accept=".pdf,image/*" @change="onFileSelected1" class="hidden" />
                      </label>
                      <div v-if="editForm.treatment_plan1_file_url && !editForm.selectedFile1" class="flex items-center gap-3 w-full">
                        <a :href="fixFileUrl(editForm.treatment_plan1_file_url)" target="_blank" class="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 text-base font-black bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-blue-600 hover:text-blue-700 hover:bg-slate-50 dark:text-blue-400 dark:hover:bg-slate-700 transition-all shadow-md">
                            <i class="fas fa-external-link-alt text-lg"></i> {{ t('browse_current') }}
                        </a>
                        <button @click.prevent="removeAttachment1" class="h-14 w-14 flex items-center justify-center text-xl font-bold bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 border-2 border-red-200 dark:border-red-500/30 rounded-2xl transition-all shadow-md" :title="t('delete_permanent')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-2">
                      <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('add_plan_notes') }}</label>
                      <textarea v-model="editForm.treatment_plan1" rows="4" :placeholder="t('add_plan_notes_placeholder')" class="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-medium outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white shadow-sm transition-all resize-y"></textarea>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('plan_url') }}</label>
                        <div class="relative group">
                          <i class="fas fa-link absolute rtl:right-5 ltr:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                          <input type="text" v-model="editForm.treatment_plan1_url" placeholder="https://..." class="w-full px-12 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white shadow-sm transition-all">
                        </div>
                        <p class="mt-3 text-xs text-slate-400 font-black italic tracking-wide opacity-70">* {{ t('view_link_hint') }}</p>
                    </div>
                  </div>
              </div>
            </div>

            <!-- Plan 2 Section -->
            <div class="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-8 relative z-10 shadow-sm transition-all hover:shadow-md" v-show="(activeModalSection === 'all' || activeModalSection === 'plans') && hasPermission('actions', 'edit_plans')">
              <h4 class="text-xl font-black text-slate-800 dark:text-slate-300 flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800 uppercase tracking-widest"><i class="fas fa-paperclip text-2xl"></i> {{ t('treatment_plan_2') }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- File Upload Plan 2 -->
                  <div class="space-y-2">
                    <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('upload_attachment') }}</label>
                    <div class="relative flex flex-col items-start w-full gap-4">
                      <label class="flex flex-col items-center justify-center w-full h-36 border-4 border-slate-200 dark:border-slate-800 border-dashed rounded-3xl cursor-pointer bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-400 group transition-all shadow-inner">
                          <div class="flex flex-col items-center justify-center pt-5 pb-6">
                              <i class="fas fa-cloud-upload-alt text-4xl text-slate-300 dark:text-slate-700 group-hover:text-purple-400 transition-all mb-3"></i>
                              <p class="text-sm text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider" v-if="!editForm.selectedFile2">{{ t('click_to_upload') }}</p>
                              <p class="text-sm font-black text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-4 py-1 rounded-full shadow-sm" v-else>{{ editForm.selectedFile2.name }}</p>
                          </div>
                          <input type="file" accept=".pdf,image/*" @change="onFileSelected2" class="hidden" />
                      </label>
                      <div v-if="editForm.treatment_plan2_file_url && !editForm.selectedFile2" class="flex items-center gap-3 w-full">
                        <a :href="fixFileUrl(editForm.treatment_plan2_file_url)" target="_blank" class="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 text-base font-black bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-purple-600 hover:text-purple-700 hover:bg-slate-50 dark:text-purple-400 dark:hover:bg-slate-700 transition-all shadow-md">
                            <i class="fas fa-external-link-alt text-lg"></i> {{ t('browse_current') }}
                        </a>
                        <button @click.prevent="removeAttachment2" class="h-14 w-14 flex items-center justify-center text-xl font-bold bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 border-2 border-red-200 dark:border-red-500/30 rounded-2xl transition-all shadow-md" :title="t('delete_permanent')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-2">
                      <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('add_plan_notes') }}</label>
                      <textarea v-model="editForm.treatment_plan2_text" rows="4" :placeholder="t('add_plan_notes_placeholder')" class="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-medium outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white shadow-sm transition-all resize-y"></textarea>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('plan_url') }}</label>
                        <div class="relative group">
                          <i class="fas fa-link absolute rtl:right-5 ltr:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors"></i>
                          <input type="text" v-model="editForm.treatment_plan2_url" placeholder="https://..." class="w-full px-12 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-bold outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white shadow-sm transition-all">
                        </div>
                        <p class="mt-3 text-xs text-slate-400 font-black italic tracking-wide opacity-70">* {{ t('view_link_hint') }}</p>
                    </div>
                  </div>
              </div>
            </div>

            <!-- Documents & Invoices Section -->
            <div class="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 bg-slate-100/60 dark:bg-slate-800/40 space-y-8 relative z-10 shadow-sm transition-all hover:shadow-md" v-show="(activeModalSection === 'all' || activeModalSection === 'documents') && hasPermission('actions', 'edit_documents')">
              <h4 class="text-xl font-black text-slate-800 dark:text-slate-300 flex items-center gap-3 pb-4 border-b-2 border-slate-300 dark:border-slate-700 uppercase tracking-widest"><i class="fas fa-file-invoice-dollar text-2xl"></i> {{ t('documents_collection') }}</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- Price List Upload -->
                  <div class="space-y-2 col-span-1 md:col-span-2">
                    <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('price_list') }}</label>
                    <div class="relative flex flex-col items-start w-full gap-4">
                      <!-- Existing Documents -->
                      <div v-if="editForm.documents && editForm.documents.filter(d => d.type === 'price_list').length" class="flex flex-wrap gap-4 w-full">
                          <div v-for="(doc, idx) in editForm.documents.filter(d => d.type === 'price_list')" :key="doc.id" class="w-32 h-32 relative group rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shadow-md">
                              <img v-if="doc.url && doc.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)" :src="fixFileUrl(doc.url)" class="w-full h-full object-cover" />
                              <div v-else class="flex flex-col items-center gap-2">
                                  <i class="fas fa-file-pdf text-3xl text-red-500"></i>
                                  <span class="text-[9px] font-black text-slate-500 truncate w-24 text-center">{{ doc.name || 'Document' }}</span>
                              </div>
                              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <a :href="fixFileUrl(doc.url)" target="_blank" class="w-8 h-8 flex items-center justify-center bg-white text-blue-600 rounded-lg hover:scale-110"><i class="fas fa-external-link-alt text-xs"></i></a>
                                  <button @click.prevent="deleteExistingDocument(doc.id, editForm.documents.findIndex(d => d.id === doc.id))" class="w-8 h-8 flex items-center justify-center bg-white text-red-600 rounded-lg hover:scale-110"><i class="fas fa-trash-alt text-xs"></i></button>
                              </div>
                          </div>
                      </div>

                      <!-- Newly Added Files -->
                      <div v-if="editForm.price_list_files && editForm.price_list_files.length" class="flex flex-wrap gap-4 w-full">
                          <div v-for="(file, idx) in editForm.price_list_files" :key="idx" class="w-32 h-32 relative group rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shadow-md border-blue-400 border-dashed">
                              <img v-if="file.type && file.type.startsWith('image/')" :src="getFileThumbnail(file)" class="w-full h-full object-cover opacity-80" />
                              <div v-else class="flex flex-col items-center gap-2">
                                  <i class="fas fa-file text-3xl text-blue-500"></i>
                                  <span class="text-[9px] font-black text-slate-500 truncate w-24 text-center">{{ file.name }}</span>
                              </div>
                              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button @click.prevent="removePriceListFile(idx)" class="w-8 h-8 flex items-center justify-center bg-white text-red-600 rounded-lg hover:scale-110"><i class="fas fa-times text-xs"></i></button>
                              </div>
                          </div>
                      </div>

                      <label class="flex flex-col items-center justify-center w-full h-24 border-4 border-slate-200 dark:border-slate-800 border-dashed rounded-3xl cursor-pointer bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 group transition-all shadow-inner">
                          <div class="flex flex-col items-center justify-center pt-2 pb-2">
                               <i class="fas fa-plus-circle text-2xl text-slate-300 dark:text-slate-700 group-hover:text-blue-400 transition-all mb-1"></i>
                               <p class="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider">{{ t('upload_price_list') || 'Upload Price List' }}</p>
                          </div>
                          <input type="file" accept=".pdf,image/*" multiple @change="onPriceListSelected" class="hidden" />
                      </label>
                    </div>
                  </div>

                  <div class="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 pt-4 border-t-2 border-slate-100 dark:border-slate-800">
                      <!-- Bill Upload -->
                      <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('bills') || 'Bills' }}</label>
                        <div class="relative flex flex-col items-start w-full gap-4">
                          <div v-if="editForm.documents && editForm.documents.filter(d => d.type === 'bill').length" class="flex flex-wrap gap-4 w-full">
                              <div v-for="(doc, idx) in editForm.documents.filter(d => d.type === 'bill')" :key="doc.id" class="w-full h-20 relative group rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-100 flex items-center shadow-md px-4">
                                  <i class="fas fa-file-invoice-dollar text-2xl text-yellow-500 mr-3"></i>
                                  <span class="text-xs font-black text-slate-600 truncate flex-1">{{ doc.name || 'Document' }}</span>
                                  <div class="flex gap-2">
                                      <a :href="fixFileUrl(doc.url)" target="_blank" class="w-8 h-8 flex items-center justify-center bg-white text-blue-600 rounded-lg hover:scale-110 shadow"><i class="fas fa-external-link-alt text-xs"></i></a>
                                      <button @click.prevent="deleteExistingDocument(doc.id, editForm.documents.findIndex(d => d.id === doc.id))" class="w-8 h-8 flex items-center justify-center bg-white text-red-600 rounded-lg hover:scale-110 shadow"><i class="fas fa-trash-alt text-xs"></i></button>
                                  </div>
                              </div>
                          </div>
                          <div v-if="editForm.bill_files && editForm.bill_files.length" class="flex flex-wrap gap-4 w-full">
                              <div v-for="(file, idx) in editForm.bill_files" :key="idx" class="w-full h-20 relative group rounded-2xl border-2 border-yellow-400 border-dashed bg-yellow-50 flex items-center shadow-sm px-4">
                                  <i class="fas fa-file text-2xl text-yellow-500 mr-3"></i>
                                  <span class="text-xs font-black text-slate-600 truncate flex-1">{{ file.name }}</span>
                                  <button @click.prevent="removeBillFile(idx)" class="w-8 h-8 flex items-center justify-center bg-white text-red-600 rounded-lg hover:scale-110 shadow"><i class="fas fa-times text-xs"></i></button>
                              </div>
                          </div>
                          <label class="flex w-full h-16 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-yellow-50 hover:border-yellow-400 group transition-all items-center justify-center">
                              <i class="fas fa-plus-circle text-xl text-slate-300 group-hover:text-yellow-500 mr-2"></i>
                              <span class="text-xs text-slate-500 font-black uppercase">{{ t('add_bill') || 'Add Bill' }}</span>
                              <input type="file" accept=".pdf,image/*" multiple @change="onBillSelected" class="hidden" />
                          </label>
                        </div>
                      </div>

                      <!-- Receipt Upload -->
                      <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ t('receipt') }}</label>
                        <div class="relative flex flex-col items-start w-full gap-4">
                          <div v-if="editForm.documents && editForm.documents.filter(d => d.type === 'receipt').length" class="flex flex-wrap gap-4 w-full">
                              <div v-for="(doc, idx) in editForm.documents.filter(d => d.type === 'receipt')" :key="doc.id" class="w-full h-20 relative group rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-100 flex items-center shadow-md px-4">
                                  <i class="fas fa-receipt text-2xl text-emerald-500 mr-3"></i>
                                  <span class="text-xs font-black text-slate-600 truncate flex-1">{{ doc.name || 'Document' }}</span>
                                  <div class="flex gap-2">
                                      <a :href="fixFileUrl(doc.url)" target="_blank" class="w-8 h-8 flex items-center justify-center bg-white text-blue-600 rounded-lg hover:scale-110 shadow"><i class="fas fa-external-link-alt text-xs"></i></a>
                                      <button @click.prevent="deleteExistingDocument(doc.id, editForm.documents.findIndex(d => d.id === doc.id))" class="w-8 h-8 flex items-center justify-center bg-white text-red-600 rounded-lg hover:scale-110 shadow"><i class="fas fa-trash-alt text-xs"></i></button>
                                  </div>
                              </div>
                          </div>
                          <div v-if="editForm.receipt_files && editForm.receipt_files.length" class="flex flex-wrap gap-4 w-full">
                              <div v-for="(file, idx) in editForm.receipt_files" :key="idx" class="w-full h-20 relative group rounded-2xl border-2 border-emerald-400 border-dashed bg-emerald-50 flex items-center shadow-sm px-4">
                                  <i class="fas fa-file text-2xl text-emerald-500 mr-3"></i>
                                  <span class="text-xs font-black text-slate-600 truncate flex-1">{{ file.name }}</span>
                                  <button @click.prevent="removeReceiptFile(idx)" class="w-8 h-8 flex items-center justify-center bg-white text-red-600 rounded-lg hover:scale-110 shadow"><i class="fas fa-times text-xs"></i></button>
                              </div>
                          </div>
                          <label class="flex w-full h-16 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-emerald-50 hover:border-emerald-400 group transition-all items-center justify-center">
                              <i class="fas fa-plus-circle text-xl text-slate-300 group-hover:text-emerald-500 mr-2"></i>
                              <span class="text-xs text-slate-500 font-black uppercase">{{ t('add_receipt') || 'Add Receipt' }}</span>
                              <input type="file" accept=".pdf,image/*" multiple @change="onReceiptSelected" class="hidden" />
                          </label>
                        </div>
                      </div>

                      <!-- Notes Section -->
                      <div class="col-span-1 md:col-span-2 mt-4 pt-4 border-t-2 border-slate-100 dark:border-slate-800 space-y-2">
                        <label class="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                          <i class="fas fa-sticky-note text-teal-500 mr-1 rtl:ml-1"></i>
                          {{ locale === 'ar' ? 'ملاحظات المستندات' : 'Documents Notes' }}
                        </label>
                        <textarea 
                          v-model="editForm.document_notes"
                          rows="3"
                          :placeholder="locale === 'ar' ? 'اكتب ملاحظاتك هنا عن المستندات أو الفواتير...' : 'Enter document/bill notes here...'"
                          class="w-full px-5 py-4 text-sm font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none dark:text-white transition-all shadow-inner resize-y min-h-[100px]"
                        ></textarea>
                      </div>
                  </div> 
              </div>
            </div>

          </div>
          
          <!-- Modal Footer -->
          <div class="px-8 py-6 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-5 relative z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <button @click="closeModal" class="px-8 py-4 text-sm font-black text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all uppercase tracking-widest border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-700">
                {{ t('cancel_modal') }}
            </button>
            <button @click="saveEdit" :disabled="isSaving" class="px-12 py-4 text-sm font-black text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-2xl shadow-xl shadow-teal-500/20 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95 uppercase tracking-widest">
              <i v-if="isSaving" class="fas fa-spinner fa-spin text-lg"></i>
              <i v-else class="fas fa-check-double text-lg"></i>
              <span>{{ t('save_changes') }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
 
     <!-- Modification History Modal -->
    <transition name="fade">
      <div v-if="isHistoryModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-all" @click.self="closeHistoryModal">
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 relative">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-history text-teal-500"></i> {{ t('full_history') }}
            </h3>
            <button @click="closeHistoryModal" class="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 h-8 w-8 rounded-lg flex items-center justify-center transition-colors"><i class="fas fa-times text-lg"></i></button>
          </div>
          
          <!-- Modal Body -->
          <div class="p-6 space-y-4 overflow-y-auto max-h-[60vh] custom-scroll">
            <div v-if="paginatedHistory.length > 0" v-for="(log, idx) in paginatedHistory" :key="idx" class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 group hover:border-teal-500/30 transition-colors">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-black text-#063c31 dark:text-#d1b06b uppercase tracking-wider">{{ log.date }}</span>
                <span class="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span>
              </div>
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300 block leading-relaxed">{{ log.action }}</span>
            </div>
            <div v-else class="text-center py-10">
                <i class="fas fa-history text-slate-300 text-4xl mb-4"></i>
                <p class="text-slate-500 font-bold">{{ t('no_history_available') }}</p>
            </div>
          </div>
          
          <!-- History Pagination -->
          <div v-if="totalHistoryPages > 1" class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <span class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {{ historyCurrentPage }} / {{ totalHistoryPages }}
            </span>
            <div class="flex gap-2">
              <button @click="historyCurrentPage--" :disabled="historyCurrentPage === 1" class="px-4 py-2 text-[11px] font-black rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:grayscale transition-all shadow-sm">
                {{ t('prev_page') }}
              </button>
              <button @click="historyCurrentPage++" :disabled="historyCurrentPage === totalHistoryPages" class="px-4 py-2 text-[11px] font-black rounded-xl bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/30 disabled:opacity-30 disabled:grayscale transition-all">
                {{ t('next_page') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Note Modal Dialog -->
    <transition name="fade">
      <div v-if="isNoteModalOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all" :dir="locale === 'ar' ? 'rtl' : 'ltr'" @click.stop="isNoteModalOpen = false">
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 relative" @click.stop>
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 text-[18px]" style="font-family: 'Fira Code', monospace;">
              <i class="fas fa-comment-dots text-#063c31"></i> {{ activeNoteTitle }}
            </h3>
            <button @click="isNoteModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ltr:ml-auto rtl:mr-auto">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          <div class="p-6">
            <div class="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner min-h-[140px] text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed text-[16px] font-bold" style="font-family: 'Fira Code', monospace;">
                {{ activeNoteContent || t('no_notes_available') }}
            </div>
          </div>
          <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button @click="isNoteModalOpen = false" class="px-8 py-2.5 rounded-xl bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 font-black shadow-[0_4px_0_rgb(148,163,184),0_8px_15px_rgba(0,0,0,0.1)] border-t-2 border-white active:translate-y-1 active:shadow-none transition-all">
                {{ locale === 'ar' ? 'إغلاق' : 'Close' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Central Preview Modal -->
    <transition name="fade">
      <div v-if="isPreviewOpen" class="fixed inset-0 z-[150] flex flex-col items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md transition-all duration-300" @click="closePreview">
        <div class="relative max-w-[95vw] max-h-[85vh] flex flex-col items-center justify-center bg-transparent" @click.stop>
          
          <!-- Close Button -->
          <button @click="closePreview" class="absolute -top-14 ltr:right-0 rtl:left-0 text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 h-10 w-10 rounded-full flex items-center justify-center transition-all shadow-lg border border-slate-700/50 hover:scale-110">
            <i class="fas fa-times text-lg"></i>
          </button>
          
          <!-- Title / Info -->
          <div class="absolute -top-14 ltr:left-0 rtl:right-0 text-white bg-slate-800/90 px-4 py-2 rounded-xl text-xs font-black tracking-widest border border-slate-700/50 max-w-[60vw] truncate">
            {{ previewFileName }}
          </div>

          <!-- Image Preview -->
          <img v-if="previewFileType === 'image'" :src="previewFileUrl" class="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl bg-white border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200" />
          
          <!-- PDF / Document Preview -->
          <div v-else-if="previewFileType === 'pdf'" class="w-[90vw] h-[80vh] md:w-[75vw] md:h-[78vh] bg-white rounded-2xl overflow-hidden shadow-2xl relative border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <iframe :src="previewFileUrl" class="w-full h-full border-none"></iframe>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import Swal from 'sweetalert2'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const { token, user } = useAuth()
const isSuperAdmin = computed(() => {
  return user.value && (user.value.id === 1 || user.value.email === 'admin@doctors.oralign.co')
})
const hasPermission = (type, key) => {
  if (isSuperAdmin.value || user.value?.user_type === 'admin') return true
  const perms = user.value?.permissions
  if (!perms) return false
  const parsed = typeof perms === 'string' ? JSON.parse(perms) : perms
  if (!parsed || !parsed[type]) return false
  return !!parsed[type][key]
}
const headers = computed(() => ({
  Authorization: `Bearer ${token.value}`,
  Accept: 'application/json'
}))

const activeGroup = ref('Virtual Planning')

const isPreviewOpen = ref(false)
const previewFileUrl = ref('')
const previewFileType = ref('')
const previewFileName = ref('')

const openPreview = (url, name = '') => {
  if (!url) return
  const fixedUrl = fixFileUrl(url)
  previewFileUrl.value = fixedUrl
  previewFileName.value = name
  
  if (fixedUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    previewFileType.value = 'image'
  } else if (fixedUrl.match(/\.pdf$/i)) {
    previewFileType.value = 'pdf'
  } else {
    // Default fallback to iframe
    previewFileType.value = 'pdf'
  }
  
  isPreviewOpen.value = true
}

const closePreview = () => {
  isPreviewOpen.value = false
  previewFileUrl.value = ''
  previewFileType.value = ''
  previewFileName.value = ''
}

// Fix file URLs from cPanel server
const fixFileUrl = (url) => {
  if (!url) return url
  
  // If it's already a full URL, just clean it if needed
  if (url.startsWith('http')) {
    if (url.includes('test-api.oralign.co/uploads')) {
      return url.replace('test-api.oralign.co/uploads', 'test-api.oralign.co/public/uploads')
    }
    return url
  }
  
  // If it's just a filename (doesn't contain slashes or starts with patient_cases), 
  // point it to the production impressions folder
  const baseUrl = 'https://doctors.oralign.co/public/impressions'
  if (!url.includes('/')) {
     return `${baseUrl}/patient_cases/files/${url}`
  }
  
  // If it's a relative path starting with patient_cases/
  if (url.startsWith('patient_cases/')) {
    return `${baseUrl}/${url.replace('patient_cases/', 'patient_cases/files/')}`
  }
  
  return url
}

const getRowClass = (item) => {
  const isSelected = selectedCases.value.includes(item.id)
  const isUnread = item.is_admin_read === 0
  
  if (isSelected) return 'bg-teal-50 dark:bg-teal-900/20'

  if (activeGroup.value === 'Virtual Planning') {
    return isUnread 
      ? 'bg-green-100/90 dark:bg-emerald-900/20' 
      : 'bg-green-50/50 dark:bg-emerald-950/20'
  }
  if (activeGroup.value === 'Finance') {
    return isUnread 
      ? 'bg-[#d1b06b]/20 dark:bg-[#d1b06b]/15' 
      : 'bg-[#d1b06b]/5 dark:bg-[#d1b06b]/5'
  }
  if (activeGroup.value === 'Laboratory') {
    return isUnread 
      ? 'bg-blue-100/90 dark:bg-blue-900/20' 
      : 'bg-blue-50/50 dark:bg-blue-950/20'
  }
  return ''
}

const getGroupButtonClass = (group) => {
  if (activeGroup.value !== group) return 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all font-black'
  
  if (group === 'Virtual Planning') return 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_5px_0_rgb(6,95,70),0_10px_20px_rgba(16,185,129,0.3)] border-t-2 border-white/30 active:translate-y-1 active:shadow-none scale-105 font-black'
  if (group === 'Finance') return 'bg-gradient-to-b from-[#d1b06b] to-[#b89650] text-white shadow-[0_5px_0_#9a7e43,0_10px_20px_rgba(209,176,107,0.3)] border-t-2 border-white/30 active:translate-y-1 active:shadow-none scale-105 font-black'
  if (group === 'Laboratory') return 'bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-[0_5px_0_rgb(30,64,175),0_10px_20px_rgba(59,130,246,0.3)] border-t-2 border-white/30 active:translate-y-1 active:shadow-none scale-105 font-black'
  return ''
}

const getRefinementLabel = (item) => {
  const num = item.refinement_number || 1
  if (locale.value === 'ar') {
    const arNumbers = {
      1: 'الأول',
      2: 'الثاني',
      3: 'الثالث',
      4: 'الرابع',
      5: 'الخامس',
      6: 'السادس',
      7: 'السابع',
      8: 'الثامن',
      9: 'التاسع',
      10: 'العاشر'
    }
    return `الريفاينمينت ${arNumbers[num] || num}`
  } else {
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"]
      const v = n % 100
      return n + (s[(v - 20) % 10] || s[v] || s[0])
    }
    return `${getOrdinal(num)} Refinement`
  }
}

const getPatientLinkClass = (item) => {
  const isUnread = item.is_admin_read === 0
  const isRefinement = item.parent_id || item.case_type === 'refinement'
  
  if (isUnread) {
    if (isRefinement) {
      return 'bg-[#d1b06b] border-amber-300 text-white shadow-[0_0_15px_rgba(209,176,107,0.4)] brightness-110'
    } else {
      return 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] brightness-110'
    }
  } else {
    return 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-[2px_2px_5px_rgba(0,0,0,0.05)]'
  }
}

const handleRowClick = async (item, e) => {
  if (e.target.closest('button') || e.target.closest('a') || e.target.type === 'checkbox') return
  
  if (item.is_admin_read === 0) {
    try {
      await $fetch(`${config.public.apiBase}/patient-cases/${item.id}/read`, { method: 'POST', headers: headers.value })
      item.is_admin_read = 1
    } catch(err) { console.error('Mark as read failed', err) }
  }
  openModal(item)
}

const showDrafts = ref(false)
const toggleDrafts = () => {
  showDrafts.value = !showDrafts.value
  selectedCases.value = [] // clear selection
}

// Fetch initial data
const { data: response, pending, error, refresh } = await useFetch(() => `${config.public.apiBase}/patient-cases?show_drafts=${showDrafts.value ? 1 : 0}`, { headers })
const { data: catResponse } = await useFetch(`${config.public.apiBase}/categories`, { headers })

const cases = computed(() => {
    const rawData = response.value?.data || []
    
    // Build an ID map for parent tracing
    const idToParentMap = new Map()
    rawData.forEach(item => {
        const rc = item.raw_case || {}
        idToParentMap.set(item.id, item.parent_id || rc.parent_id || null)
    })
    
    const getRootId = (itemId) => {
        let currentId = itemId
        let visited = new Set()
        while (currentId) {
            if (visited.has(currentId)) break
            visited.add(currentId)
            const parentId = idToParentMap.get(currentId)
            if (!parentId) return currentId
            currentId = parentId
        }
        return currentId
    }

    // Merge raw_case fields into each item so treatment plan fields are always available
    const mappedResult = rawData.map(item => {
        const rc = item.raw_case || {}
        
        let packageName = '-'
        let subPackageName = ''
        const mainCatId = item.main_category_id || rc.main_category_id
        if (mainCatId && catResponse.value?.data) {
            const cat = catResponse.value.data.find(c => c.id === mainCatId)
            if (cat) {
                packageName = locale.value === 'ar' ? (cat.name_ar || cat.name_en) : (cat.name_en || cat.name_ar)
                const subCatId = item.sub_category_id || rc.sub_category_id
                const subCatId2 = item.sub_category_id2 || rc.sub_category_id2
                let parts = []
                if (subCatId && cat.sub_categories) {
                    const subCat = cat.sub_categories.find(s => s.id === subCatId)
                    if (subCat) {
                        parts.push(locale.value === 'ar' ? (subCat.name_ar || subCat.name_en) : (subCat.name_en || subCat.name_ar))
                    }
                }
                if (subCatId2 && cat.sub_categories) {
                    const subCat2 = cat.sub_categories.find(s => s.id === subCatId2)
                    if (subCat2) {
                        parts.push(locale.value === 'ar' ? (subCat2.name_ar || subCat2.name_en) : (subCat2.name_en || subCat2.name_ar))
                    }
                }
                subPackageName = parts.join(' / ')
            }
        }

        // Calculate refinement number in frontend as a fallback
        let refinementNumber = item.refinement_number || rc.refinement_number || 0
        const pId = item.parent_id || rc.parent_id || null
        
        if (pId && !refinementNumber) {
            const rootId = getRootId(item.id)
            // Get all items in the same family (meaning their root ID matches)
            const familyItems = rawData.filter(x => {
                const xRc = x.raw_case || {}
                const xPId = x.parent_id || xRc.parent_id || null
                return xPId && getRootId(x.id) === rootId
            })
            // Sort by id ascending to establish sequence
            familyItems.sort((a, b) => a.id - b.id)
            const idx = familyItems.findIndex(x => x.id === item.id)
            refinementNumber = idx !== -1 ? (idx + 1) : 1
        }

        return {
            ...item,
            package: packageName,
            sub_package: subPackageName,
            main_category_id: mainCatId,
            sub_category_id: item.sub_category_id || rc.sub_category_id || null,
            sub_category_id2: item.sub_category_id2 || rc.sub_category_id2 || null,
            // Ensure treatment plan fields are available from raw_case if not in top-level
            treatment_plan1_status: item.treatment_plan1_status || rc.treatment_plan1_status || null,
            treatment_plan1_file: item.treatment_plan1_file || rc.treatment_plan1_file || null,
            treatment_plan1_url: item.treatment_plan1_url || rc.treatment_plan1_url || null,
            treatment_plan1: item.treatment_plan1 ?? rc.treatment_plan1 ?? null,
            treatment_plan2_status: item.treatment_plan2_status || rc.treatment_plan2_status || null,
            treatment_plan2: item.treatment_plan2 ?? rc.treatment_plan2 ?? null,
            treatment_plan2_url: item.treatment_plan2_url || rc.treatment_plan2_url || null,
            treatment_plan2_text: item.treatment_plan2_text ?? rc.treatment_plan2_text ?? null,
            // Finance fields
            price_list_url: item.price_list_url || rc.price_list_url || null,
            receipt_url: item.receipt_url || rc.receipt_url || null,
            documents: item.documents || rc.documents || [],
            // Lab fields
            lab_status: item.lab_status || rc.lab_status || null,
            aligners_upper: item.aligners_upper ?? rc.aligners_upper ?? null,
            aligners_lower: item.aligners_lower ?? rc.aligners_lower ?? null,
            accessories_data: (() => {
                const rawVal = item.accessories_data || rc.accessories_data || null
                if (!rawVal) return null
                if (typeof rawVal === 'object') return rawVal
                try {
                    return JSON.parse(rawVal)
                } catch (e) {
                    console.error('Failed to parse accessories_data', e)
                    return null
                }
            })(),
            aligners_notes: item.aligners_notes || rc.aligners_notes || null,
            accessories_notes: item.accessories_notes || rc.accessories_notes || null,
            document_notes: item.document_notes || rc.document_notes || null,
            case_type: String(item.case_type || rc.case_type || 'aligner').toLowerCase(),
            parent_id: pId,
            refinement_number: refinementNumber
        }
    })

    // Filter to show only the latest case per patient
    // Backend already orders by created_at desc, so the first occurrence is the latest
    const uniqueCases = []
    const seenPatients = new Set()
    
    for (const item of mappedResult) {
        // Create a unique key combining patient name and doctor to minimize false merging
        const uniqueKey = `${item.patient?.trim()}-${item.doctor?.trim()}`
        
        if (!seenPatients.has(uniqueKey)) {
            seenPatients.add(uniqueKey)
            uniqueCases.push(item)
        }
    }

    return uniqueCases
})
const allCategories = computed(() => catResponse.value?.data || [])

const filteredSubCategories = computed(() => {
    if (!editForm.value.main_category_id) return []
    const main = allCategories.value.find(c => c.id === editForm.value.main_category_id)
    return main ? main.sub_categories : []
})

// UI State
const searchQuery = ref('')
const filters = ['All Cases', 'approved', 'rejected', 'modification', 'incomplete submission', 'complete submission', 'new impression needed', 'intraoral photos needed', 'extraoral photos needed', 'treatment plan generated', 'manufacturing', 'shipping', 'delivered', 'cancel']
const activeFilter = ref('All Cases')
 
 // Date Filter State
const activeDateFilter = ref('All Time')
const activeCategoryFilter = ref('All Categories')
const customStartDate = ref('')
const customEndDate = ref('')

// Search & Filter Logic
const filteredCases = computed(() => {
  let result = cases.value
 
  // 1. Filter by Status
  if (activeFilter.value !== 'All Cases') {
    result = result.filter(c => c.status === activeFilter.value)
  }

  // 1b. Filter by Category
  if (activeCategoryFilter.value !== 'All Categories') {
    result = result.filter(c => c.main_category_id === activeCategoryFilter.value)
  }
 
  // 2. Filter by Date
  if (activeDateFilter.value !== 'All Time') {
    const now = new Date()
    let threshold = null
 
    if (activeDateFilter.value === 'Last Day') {
        threshold = new Date(now.getTime() - (24 * 60 * 60 * 1000))
    } else if (activeDateFilter.value === 'Last Week') {
        threshold = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
    } else if (activeDateFilter.value === 'Last Month') {
        threshold = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    } else if (activeDateFilter.value === 'Last 3 Months') {
        threshold = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    } else if (activeDateFilter.value === 'Last Year') {
        threshold = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    }
 
    if (threshold && activeDateFilter.value !== 'Custom Range') {
        result = result.filter(c => {
            const caseDate = new Date(c.date_modified.split(' ')[0])
            return caseDate >= threshold
        })
    } else if (activeDateFilter.value === 'Custom Range') {
        if (customStartDate.value) {
            const start = new Date(customStartDate.value)
            result = result.filter(c => new Date(c.date_modified.split(' ')[0]) >= start)
        }
        if (customEndDate.value) {
            const end = new Date(customEndDate.value)
            end.setHours(23, 59, 59, 999)
            result = result.filter(c => new Date(c.date_modified.split(' ')[0]) <= end)
        }
    }
  }
 
  // 3. Search Filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.uuid?.toLowerCase().includes(q) || 
      c.patient?.toLowerCase().includes(q) ||
      c.doctor?.toLowerCase().includes(q)
    )
  }
 
  // Sort approved in last 7 days first, keeping date modified descending overall
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))

  const parseCaseDate = (dateStr) => {
    if (!dateStr) return new Date(0)
    const [datePart, timePart] = dateStr.split(' ')
    const [year, month, day] = datePart.split('-').map(Number)
    if (timePart) {
      const [hours, minutes, seconds] = timePart.split(':').map(Number)
      return new Date(year, month - 1, day, hours || 0, minutes || 0, seconds || 0)
    }
    return new Date(year, month - 1, day)
  }

  result = [...result].sort((a, b) => {
    const aDate = parseCaseDate(a.date_modified)
    const bDate = parseCaseDate(b.date_modified)
    
    const aIsApprovedRecent = a.status === 'approved' && aDate >= sevenDaysAgo
    const bIsApprovedRecent = b.status === 'approved' && bDate >= sevenDaysAgo
    
    if (aIsApprovedRecent && !bIsApprovedRecent) return -1
    if (!aIsApprovedRecent && bIsApprovedRecent) return 1
    
    // Within same group, sort descending by date modified
    return bDate.getTime() - aDate.getTime()
  })

  return result
})

// Pagination Logic
const currentPage = ref(1)
const itemsPerPage = 8

watch(currentPage, () => {
  if (typeof window !== 'undefined') {
    const tableCardEl = document.getElementById('cases-table-card')
    const mainEl = document.querySelector('main')
    if (tableCardEl && mainEl) {
      const mainRect = mainEl.getBoundingClientRect()
      const cardRect = tableCardEl.getBoundingClientRect()
      const relativeTop = cardRect.top - mainRect.top + mainEl.scrollTop
      mainEl.scrollTo({
        top: relativeTop - 10,
        behavior: 'smooth'
      })
    }
  }
})

const totalPages = computed(() => Math.ceil(filteredCases.value.length / itemsPerPage) || 1)

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2 
  
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  
  let pages = []
  pages.push(1)
  if (current > delta + 2) pages.push('...')
  
  const start = Math.max(2, current - delta)
  const end = Math.min(total - 1, current + delta)
  for (let i = start; i <= end; i++) pages.push(i)
  
  if (current < total - delta - 1) pages.push('...')
  pages.push(total)
  return pages
})

const paginatedCases = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCases.value.slice(start, end)
})

watch([activeFilter, activeCategoryFilter, activeDateFilter, customStartDate, customEndDate, searchQuery], () => {
  currentPage.value = 1
})
 
const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Cases', {
        views: [{ rightToLeft: locale.value === 'ar' }]
    })

    // Define Columns
    const columns = [
        { header: t('uuid'), key: 'uuid', width: 20 },
        { header: t('patient'), key: 'patient', width: 25 },
        { header: t('doctor'), key: 'doctor', width: 25 },
        { header: t('type'), key: 'type', width: 15 },
        { header: t('aligners_delivered'), key: 'aligners', width: 15 },
        { header: t('accessories'), key: 'accessories', width: 40 },
        { header: t('category_package'), key: 'category', width: 30 },
        { header: t('package'), key: 'price', width: 20 },
        { header: t('date_modified'), key: 'date', width: 25 },
        { header: t('lab'), key: 'lab', width: 15 },
        { header: t('status'), key: 'status', width: 15 },
        { header: t('price_list'), key: 'price_list_url', width: 40 },
        { header: t('receipt'), key: 'receipt_url', width: 40 },
        { header: t('treatment_plan1'), key: 'plan1', width: 20 },
        { header: t('treatment_plan2'), key: 'plan2', width: 20 }
    ]
    worksheet.columns = columns

    // Add Data
    filteredCases.value.forEach(c => {
        let accessoriesStr = '-'
        if (c.accessories_data) {
            const summary = getAccessoriesSummary(c.accessories_data)
            if (summary.length > 0) {
                accessoriesStr = summary.map(s => `${s.label}: ${s.teeth}`).join(' | ')
            }
        }

        worksheet.addRow({
            uuid: c.uuid,
            patient: c.patient,
            doctor: c.doctor,
            type: c.type,
            aligners: `${c.aligners_upper ?? 0}U / ${c.aligners_lower ?? 0}L`,
            accessories: accessoriesStr,
            category: `${c.main_category_name ? c.main_category_name + ' / ' : ''}${c.sub_category_name ?? ''}`,
            price: c.package,
            date: c.date_modified,
            lab: c.lab_status,
            status: c.status,
            price_list_url: c.price_list_url,
            receipt_url: c.receipt_url,
            plan1: c.treatment_plan1_status,
            plan2: c.treatment_plan2_status
        })
    })

    // Styling
    worksheet.getRow(1).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF14532D' } // Deep Forest Green
    }
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            cell.alignment = { 
                vertical: 'middle', 
                horizontal: locale.value === 'ar' ? 'right' : 'left',
                wrapText: true
            }
            cell.border = {
                top: {style:'thin', color: {argb: 'FFE2E8F0'}},
                left: {style:'thin', color: {argb: 'FFE2E8F0'}},
                bottom: {style:'thin', color: {argb: 'FFE2E8F0'}},
                right: {style:'thin', color: {argb: 'FFE2E8F0'}}
            }
        })
    })

    // Generate Buffer & Save
    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), `Oralign_Cases_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

// Dynamic UI Styling Helpers
const getGroupHeaderClass = (group) => {
  if (group === 'Virtual Planning') return 'bg-emerald-600 text-white font-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]'
  if (group === 'Finance') return 'bg-[#d1b06b] text-white font-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]'
  if (group === 'Laboratory') return 'bg-blue-600 text-white font-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]'
  return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200'
}

const getGroupColClass = (group, index) => {
  if (index % 2 === 0) return '' // Even columns are transparent
  
  // Odd columns get a theme-based subtle background
  if (group === 'Virtual Planning') return 'bg-emerald-500/5 dark:bg-emerald-400/5'
  if (group === 'Finance') return 'bg-[#d1b06b]/5 dark:bg-[#d1b06b]/5'
  if (group === 'Laboratory') return 'bg-blue-500/5 dark:bg-blue-400/5'
  
  return 'bg-slate-500/5'
}

// Dynamic Badge Colors
const getBadgeClass = (status) => {
  if (!status) return 'bg-slate-500 text-white-force'
  const s = status.toLowerCase()
  
  if (s.includes('approved')) return 'bg-emerald-600 text-white-force font-black' // green
  if (s.includes('rejected')) return 'bg-rose-600 text-white-force font-black' // red
  if (s.includes('modify') || s.includes('modification')) return 'bg-amber-500 text-white-force font-black' // gold/amber
  if (s.includes('complete submission')) return 'bg-[#006A9F] text-white-force font-black' 
  if (s.includes('incomplete submission')) return 'bg-orange-500 text-white-force font-black' 
  if (s.includes('delivered')) return 'bg-indigo-600 text-white-force font-black' // blue/indigo
  if (s.includes('shipped') || s.includes('shipping')) return 'bg-violet-600 text-white-force font-black' // purple
  if (s.includes('generated')) return 'bg-teal-600 text-white-force font-black'
  
  // Any other status
  return 'bg-slate-700 text-white-force font-black'
}

const labStatuses = [
    '3D Printing',
    'Thermoplasting',
    'Finishing',
    'Packaging',
    'Delivery'
]

const getLabBadgeClass = (status) => {
  if (!status) return 'bg-slate-500 text-white-force'
  const s = status.toLowerCase()
  if (s.includes('3d')) return 'bg-cyan-600 text-white-force shadow-lg font-black' 
  if (s.includes('thermo')) return 'bg-blue-600 text-white-force shadow-lg font-black'
  if (s.includes('finish')) return 'bg-fuchsia-600 text-white-force shadow-lg font-black'
  if (s.includes('packag')) return 'bg-amber-600 text-white-force shadow-lg font-black'
  if (s.includes('deliver')) return 'bg-emerald-600 text-white-force shadow-lg font-black'
  return 'bg-slate-600 text-white-force font-black' 
}

// UI State for Accessories
const activeAccessoryType = ref('Buttons')
const activeJaw = ref('Upper')
const activeSurface = ref('Buccal')

const upperRightTeeth = ['UR7', 'UR6', 'UR5', 'UR4', 'UR3', 'UR2', 'UR1']
const upperLeftTeeth = ['UL1', 'UL2', 'UL3', 'UL4', 'UL5', 'UL6', 'UL7']

const lowerRightTeeth = ['LR7', 'LR6', 'LR5', 'LR4', 'LR3', 'LR2', 'LR1']
const lowerLeftTeeth = ['LL1', 'LL2', 'LL3', 'LL4', 'LL5', 'LL6', 'LL7']

const toggleTooth = (tooth, jaw) => {
  if(!editForm.value.accessories_data) return
  if(!editForm.value.accessories_data[activeAccessoryType.value]) return
  
  const targetJaw = jaw || activeJaw.value
  const currentArray = editForm.value.accessories_data[activeAccessoryType.value][targetJaw][activeSurface.value]
  const index = currentArray.indexOf(tooth)
  if (index === -1) {
    currentArray.push(tooth)
  } else {
    currentArray.splice(index, 1)
  }
  // Force reactivity update for nested data
  editForm.value.accessories_data = { ...editForm.value.accessories_data }
}

const clearActiveSection = () => {
  if(!editForm.value.accessories_data) return
  if(!editForm.value.accessories_data[activeAccessoryType.value]) return
  
  editForm.value.accessories_data[activeAccessoryType.value][activeJaw.value][activeSurface.value] = []
  // Force reactivity update
  editForm.value.accessories_data = { ...editForm.value.accessories_data }
}

const isToothSelected = (tooth, jaw) => {
  if(!editForm.value.accessories_data) return false
  if(!editForm.value.accessories_data[activeAccessoryType.value]) return false
  const targetJaw = jaw || activeJaw.value
  return editForm.value.accessories_data[activeAccessoryType.value][targetJaw][activeSurface.value].includes(tooth)
}

const getToothClass = (tooth, jaw) => {
  const isSelected = isToothSelected(tooth, jaw)
  if (!isSelected) {
    return 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
  }
  
  if (activeAccessoryType.value === 'Buttons') {
    return 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-105'
  } else {
    return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] scale-105'
  }
}

const getActiveAccessoriesCount = (data) => {
    if (!data || typeof data !== 'object') return 0
    let count = 0
    const types = ['Buttons', 'Slits']
    for (const type of types) {
        const typeData = data[type]
        if (!typeData || typeof typeData !== 'object') continue
        
        for (const jaw in typeData) {
            const jawData = typeData[jaw]
            if (!jawData || typeof jawData !== 'object') continue
            
            for (const surface in jawData) {
                const teethArr = jawData[surface]
                if (Array.isArray(teethArr)) {
                    count += teethArr.length
                }
            }
        }
    }
    return count
}

const getAccessoriesSummary = (data) => {
    if (!data || typeof data !== 'object') return []
    const summary = []
    
    // Explicit nested loops with null checks to avoid all forEach calls
    const types = ['Buttons', 'Slits']
    const jaws = ['Upper', 'Lower']
    const surfaces = ['Buccal', 'Lingual']
    
    for (const type of types) {
        const typeData = data[type]
        if (!typeData || typeof typeData !== 'object') continue
        
        for (const jaw of jaws) {
            const jawData = typeData[jaw]
            if (!jawData || typeof jawData !== 'object') continue
            
            for (const surface of surfaces) {
                const teeth = jawData[surface]
                if (Array.isArray(teeth) && teeth.length > 0) {
                    summary.push({
                        label: `${type} / ${jaw} / ${surface}`,
                        teeth: teeth.join(', ')
                    })
                }
            }
        }
    }
    return summary
}

const mergeWithDefaultAccessories = (existingData) => {
    const base = JSON.parse(JSON.stringify(defaultAccessories))
    if (!existingData || typeof existingData !== 'object') return base
    
    // Deep merge valid data while ensuring structure
    for (const type of ['Buttons', 'Slits']) {
        if (!existingData[type]) continue
        for (const jaw of ['Upper', 'Lower']) {
            if (!existingData[type][jaw]) continue
            for (const surface of ['Buccal', 'Lingual']) {
                if (Array.isArray(existingData[type][jaw][surface])) {
                    base[type][jaw][surface] = [...existingData[type][jaw][surface]]
                }
            }
        }
    }
    return base
}

const defaultAccessories = {
    Buttons: { Upper: { Buccal: [], Lingual: [] }, Lower: { Buccal: [], Lingual: [] } },
    Slits: { Upper: { Buccal: [], Lingual: [] }, Lower: { Buccal: [], Lingual: [] } }
}

// Bulk Actions Logic
const selectedCases = ref([])

const isAllSelected = computed(() => paginatedCases.value.length > 0 && selectedCases.value.length === paginatedCases.value.length)

const toggleSelectAll = (e) => {
  if (e.target.checked) selectedCases.value = paginatedCases.value.map(c => c.id)
  else selectedCases.value = []
}

const deleteSelected = async () => {
    const result = await Swal.fire({
        title: t('confirm') || 'Confirm',
        text: t('delete_confirm') || 'Are you sure you want to delete?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: t('yes_delete') || 'Yes, delete it!'
    })
    if(!result.isConfirmed) return
    try {
        await $fetch(`${config.public.apiBase}/patient-cases/delete`, {
            method: 'POST', body: { ids: selectedCases.value },
            headers: headers.value
        })
        selectedCases.value = []
        await refresh()
    } catch(e) { console.error('Delete failed', e) }
}

const deleteSingleRow = async (id) => {
    const result = await Swal.fire({
        title: t('confirm') || 'Confirm',
        text: t('delete_confirm') || 'Are you sure you want to delete?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: t('yes_delete') || 'Yes, delete it!'
    })
    if(!result.isConfirmed) return
    try {
        await $fetch(`${config.public.apiBase}/patient-cases/delete`, {
            method: 'POST', body: { ids: [id] },
            headers: headers.value
        })
        await refresh()
    } catch(e) { console.error('Delete failed', e) }
}

const restoreSelected = async () => {
    const result = await Swal.fire({
        title: locale.value === 'ar' ? 'تأكيد الاستعادة' : 'Confirm Restore',
        text: locale.value === 'ar' ? 'هل أنت متأكد من استعادة الحالات المحددة؟' : 'Are you sure you want to restore the selected cases?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#64748b',
        confirmButtonText: locale.value === 'ar' ? 'نعم، استعدها!' : 'Yes, restore them!',
        cancelButtonText: t('cancel')
    })
    if(!result.isConfirmed) return
    try {
        await $fetch(`${config.public.apiBase}/patient-cases/restore`, {
            method: 'POST', body: { ids: selectedCases.value },
            headers: headers.value
        })
        selectedCases.value = []
        await refresh()
        Swal.fire({
            icon: 'success',
            title: locale.value === 'ar' ? 'تمت الاستعادة!' : 'Restored!',
            text: locale.value === 'ar' ? 'تم استعادة الحالات المحددة بنجاح.' : 'Selected cases restored successfully.',
            timer: 1500,
            showConfirmButton: false
        })
    } catch(e) { console.error('Restore failed', e) }
}

const forceDeleteSelected = async () => {
    const result = await Swal.fire({
        title: locale.value === 'ar' ? 'تأكيد الحذف النهائي' : 'Confirm Permanent Delete',
        text: locale.value === 'ar' ? 'تحذير: سيتم حذف الحالات المحددة نهائياً ولا يمكن التراجع عن هذا الإجراء!' : 'Warning: Selected cases will be deleted permanently and this action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: locale.value === 'ar' ? 'نعم، احذفها نهائياً!' : 'Yes, delete permanently!',
        cancelButtonText: t('cancel')
    })
    if(!result.isConfirmed) return
    try {
        await $fetch(`${config.public.apiBase}/patient-cases/force-delete`, {
            method: 'POST', body: { ids: selectedCases.value },
            headers: headers.value
        })
        selectedCases.value = []
        await refresh()
        Swal.fire({
            icon: 'success',
            title: locale.value === 'ar' ? 'تم الحذف النهائي!' : 'Permanently Deleted!',
            text: locale.value === 'ar' ? 'تم حذف الحالات المحددة نهائياً.' : 'Selected cases deleted permanently.',
            timer: 1500,
            showConfirmButton: false
        })
    } catch(e) { console.error('Force delete failed', e) }
}

const restoreSingleRow = async (id) => {
    const result = await Swal.fire({
        title: locale.value === 'ar' ? 'تأكيد الاستعادة' : 'Confirm Restore',
        text: locale.value === 'ar' ? 'هل أنت متأكد من استعادة هذه الحالة؟' : 'Are you sure you want to restore this case?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#64748b',
        confirmButtonText: locale.value === 'ar' ? 'نعم، استعدها!' : 'Yes, restore it!',
        cancelButtonText: t('cancel')
    })
    if(!result.isConfirmed) return
    try {
        await $fetch(`${config.public.apiBase}/patient-cases/restore`, {
            method: 'POST', body: { ids: [id] },
            headers: headers.value
        })
        await refresh()
        Swal.fire({
            icon: 'success',
            title: locale.value === 'ar' ? 'تمت الاستعادة!' : 'Restored!',
            text: locale.value === 'ar' ? 'تم استعادة الحالة بنجاح.' : 'Case restored successfully.',
            timer: 1500,
            showConfirmButton: false
        })
    } catch(e) { console.error('Restore failed', e) }
}

const forceDeleteSingleRow = async (id) => {
    const result = await Swal.fire({
        title: locale.value === 'ar' ? 'تأكيد الحذف النهائي' : 'Confirm Permanent Delete',
        text: locale.value === 'ar' ? 'تحذير: سيتم حذف هذه الحالة نهائياً ولا يمكن التراجع عن هذا الإجراء!' : 'Warning: This case will be deleted permanently and this action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: locale.value === 'ar' ? 'نعم، احذفها نهائياً!' : 'Yes, delete permanently!',
        cancelButtonText: t('cancel')
    })
    if(!result.isConfirmed) return
    try {
        await $fetch(`${config.public.apiBase}/patient-cases/force-delete`, {
            method: 'POST', body: { ids: [id] },
            headers: headers.value
        })
        await refresh()
        Swal.fire({
            icon: 'success',
            title: locale.value === 'ar' ? 'تم الحذف النهائي!' : 'Permanently Deleted!',
            text: locale.value === 'ar' ? 'تم حذف الحالة نهائياً.' : 'Case deleted permanently.',
            timer: 1500,
            showConfirmButton: false
        })
    } catch(e) { console.error('Force delete failed', e) }
}

// Note Modal State
const isNoteModalOpen = ref(false)
const activeNoteContent = ref('')
const activeNoteTitle = ref('')

// Modal Dialog Logic
const isModalOpen = ref(false)
const activeModalSection = ref('all')
const isTreatmentPlanOnly = ref(false)
const isGeneralDataOnly = ref(false)
const isAlignersOnly = ref(false)
const isDocumentsOnly = ref(false)
const isAccessoriesOnly = ref(false)
const isPackageOnly = ref(false)
const isSaving = ref(false)

const modalTitle = computed(() => {
  if (activeModalSection.value === 'general') return locale.value === 'ar' ? 'البيانات العامة للمريض' : 'General Patient Data'
  if (activeModalSection.value === 'package') return locale.value === 'ar' ? 'الباقة / التصنيف' : 'Package / Category'
  if (activeModalSection.value === 'aligners') return t('aligners_delivered')
  if (activeModalSection.value === 'accessories') return t('accessories')
  if (activeModalSection.value === 'plans') return locale.value === 'ar' ? 'خطة العلاج' : 'Treatment Plan'
  if (activeModalSection.value === 'documents') return t('documents_collection')
  return t('edit_case_data')
})
const editForm = ref({
    id: null,
    uuid: '',
    patient: '',
    status: '',
    lab_status: '',
    aligners_upper: null,
    aligners_lower: null,
    accessories_data: null,
    treatment_plan1_status: '',
    treatment_plan2_status: '',
    treatment_plan1: '',
    treatment_plan2_text: '',
    selectedFile1: null,
    selectedFile2: null,
    treatment_plan1_url: '',
    treatment_plan2_url: '',
    price_list_url: '',
    receipt_url: '',
    remove_attachment1: false,
    remove_attachment2: false,
    remove_price_list: false,
    remove_receipt: false,
    main_category_id: null,
    sub_category_id: null,
    sub_category_id2: null,
    aligners_notes: '',
    accessories_notes: '',
    case_type: 'aligner'
})

const checkDefault = (val) => {
    if (!val) return false;
    try {
        const s = decodeURIComponent(String(val)).trim().toLowerCase();
        // Check if string is exactly or ends with n/a, attached file, or مرفق ملف
        return /(n[\/\s\-]*a|مرفق\s*ملف|attached\s*file)(\.[a-z0-9]+)?$/i.test(s);
    } catch (e) {
        const s = String(val).trim().toLowerCase();
        return /(n[\/\s\-]*a|مرفق\s*ملف|attached\s*file)(\.[a-z0-9]+)?$/i.test(s);
    }
}

const openNoteModal = (content, title) => {
    if (checkDefault(content)) {
        activeNoteContent.value = ''
    } else {
        activeNoteContent.value = content || ''
    }
    activeNoteTitle.value = title || t('treatment_plan')
    isNoteModalOpen.value = true
}
 
 // Modification History Modal State
const isHistoryModalOpen = ref(false)
const selectedHistoryLog = ref([])
const historyCurrentPage = ref(1)
const historyItemsPerPage = 5
 
const openHistoryModal = (log) => {
    let parsedLog = log;
    if (typeof log === 'string' && log.trim().startsWith('[')) {
        try { 
            parsedLog = JSON.parse(log); 
        } catch(e) { 
            parsedLog = []; 
        }
    }
    selectedHistoryLog.value = Array.isArray(parsedLog) ? parsedLog : [];
    historyCurrentPage.value = 1
    isHistoryModalOpen.value = true
}
 
const totalHistoryPages = computed(() => Math.ceil(selectedHistoryLog.value.length / historyItemsPerPage) || 1)
 
const paginatedHistory = computed(() => {
    // Reverse to show newest first for the modal list
    const reversed = [...selectedHistoryLog.value].reverse()
    const start = (historyCurrentPage.value - 1) * historyItemsPerPage
    return reversed.slice(start, start + historyItemsPerPage)
})
 
const closeHistoryModal = () => {
    isHistoryModalOpen.value = false
}

// Prevent body scroll when modal is open
watch(isModalOpen, (isOpen) => {
  if (import.meta.client) {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }
})

// Cleanup on Unmount
onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

// Auto-update status when treatment plan content is added
watch([
  () => editForm.value.treatment_plan1,
  () => editForm.value.treatment_plan1_url,
  () => editForm.value.selectedFile1,
  () => editForm.value.treatment_plan2_text,
  () => editForm.value.treatment_plan2_url,
  () => editForm.value.selectedFile2
], (newValues) => {
  const hasContent = newValues.some(val => {
    if (typeof val === 'string') return val.trim().length > 0
    return !!val // handles files
  })
  
  if (hasContent && editForm.value.status !== 'treatment plan generated') {
    editForm.value.status = 'treatment plan generated'
  }
}, { deep: true })

const openModal = async (item, section = 'all') => {
    let targetSection = section
    if (section === true) {
        targetSection = 'plans'
    } else if (section === false) {
        targetSection = 'general'
    }
    
    // Check permission for specific section
    if (targetSection === 'general' && !hasPermission('actions', 'edit_general')) return
    if (targetSection === 'plans' && !hasPermission('actions', 'edit_plans')) return
    if (targetSection === 'package' && !hasPermission('actions', 'edit_package')) return
    if (targetSection === 'documents' && !hasPermission('actions', 'edit_documents')) return
    if (targetSection === 'aligners' && !hasPermission('actions', 'edit_aligners')) return
    if (targetSection === 'accessories' && !hasPermission('actions', 'edit_accessories')) return

    if (targetSection === 'all') {
      const allowed = []
      if (hasPermission('actions', 'edit_general')) allowed.push('general')
      if (hasPermission('actions', 'edit_package')) allowed.push('package')
      if (hasPermission('actions', 'edit_aligners')) allowed.push('aligners')
      if (hasPermission('actions', 'edit_accessories')) allowed.push('accessories')
      if (hasPermission('actions', 'edit_plans')) allowed.push('plans')
      if (hasPermission('actions', 'edit_documents')) allowed.push('documents')
      
      if (allowed.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: locale.value === 'ar' ? 'تنبيه' : 'Warning',
          text: locale.value === 'ar' ? 'ليس لديك صلاحية لتعديل أي جزء من الحالة' : 'You do not have permission to edit any section of the case'
        })
        return
      }
      
      if (allowed.length === 6) {
        activeModalSection.value = 'all'
      } else {
        activeModalSection.value = allowed[0]
      }
    } else {
      activeModalSection.value = targetSection
    }

    isTreatmentPlanOnly.value = activeModalSection.value === 'plans'
    isGeneralDataOnly.value = activeModalSection.value === 'general'
    isAlignersOnly.value = activeModalSection.value === 'aligners'
    isDocumentsOnly.value = activeModalSection.value === 'documents'
    isAccessoriesOnly.value = activeModalSection.value === 'accessories'
    isPackageOnly.value = activeModalSection.value === 'package'
    // Mark as read if not already read
    if (item.is_admin_read === 0) {
        // Update local object immediately for UI feedback
        item.is_admin_read = 1
        
        try {
            // Find and update the source object in the cases list to ensure reactivity
            const sourceCase = cases.value.find(c => c.id === item.id)
             if (sourceCase) sourceCase.is_admin_read = 1
            
            await $fetch(`${config.public.apiBase}/patient-cases/${item.id}/read`, { 
                method: 'POST',
                headers: headers.value
            })
        } catch (e) {
            console.error('Failed to mark as read', e)
        }
    }



    const isDefaultTp1Status = checkDefault(item.treatment_plan1_status)
    const isDefaultTp2Status = checkDefault(item.treatment_plan2_status)
    const isDefaultTp1 = checkDefault(item.treatment_plan1)
    const isDefaultTp2Text = checkDefault(item.treatment_plan2_text)
    const isDefaultTp1File = checkDefault(item.treatment_plan1_file)
    const isDefaultTp2File = checkDefault(item.treatment_plan2)

    editForm.value = {
        id: item.id,
        uuid: item.uuid,
        patient: item.patient,
        status: item.status,
        lab_status: item.lab_status || '',
        aligners_upper: item.aligners_upper || null,
        aligners_lower: item.aligners_lower || null,
        accessories_data: mergeWithDefaultAccessories(item.accessories_data),
        treatment_plan1_status: isDefaultTp1Status ? '' : (item.treatment_plan1_status || ''),
        treatment_plan2_status: isDefaultTp2Status ? '' : (item.treatment_plan2_status || ''),
        treatment_plan1: isDefaultTp1 ? '' : (item.treatment_plan1 || ''),
        treatment_plan2_text: isDefaultTp2Text ? '' : (item.treatment_plan2_text || ''),
        selectedFile1: null,
        selectedFile2: null,
        treatment_plan1_file_url: isDefaultTp1File ? '' : (item.treatment_plan1_file || ''),
        treatment_plan2_file_url: isDefaultTp2File ? '' : (item.treatment_plan2 || ''),
        treatment_plan1_url: item.treatment_plan1_url || '',
        treatment_plan2_url: item.treatment_plan2_url || '',
        
        // Temp Treatment Plan Fields
        temp_treatment_plan: checkDefault(item.temp_treatment_plan) ? '' : (item.temp_treatment_plan || ''),
        temp_treatment_plan_file_url: checkDefault(item.temp_treatment_plan_file) ? '' : (item.temp_treatment_plan_file || ''),
        temp_treatment_plan_url: item.temp_treatment_plan_url || '',
        temp_treatment_plan_status: item.temp_treatment_plan_status || 'pending',
        selectedFileTemp: null,
        remove_temp_treatment_plan_file: false,

        price_list_url: item.price_list_url || '',
        receipt_url: item.receipt_url || '',
        documents: item.documents || [],
        price_list_files: [],
        bill_files: [],
        receipt_files: [],
        remove_attachment1: false,
        remove_attachment2: false,
        remove_price_list: false,
        remove_receipt: false,
        main_category_id: item.main_category_id || null,
        sub_category_id: item.sub_category_id || null,
        sub_category_id2: item.sub_category_id2 || null,
        price_list_file: null,
        receipt_file: null,
        aligners_notes: item.aligners_notes || '',
        accessories_notes: item.accessories_notes || '',
        document_notes: item.document_notes || '',
        case_type: String(item.case_type || 'aligner').toLowerCase()
    }
    isModalOpen.value = true
}

const closeModal = () => {
    if(isSaving.value) return
    isModalOpen.value = false
    activeModalSection.value = 'all'
    editForm.value.selectedFile1 = null
    editForm.value.selectedFile2 = null
    editForm.value.price_list_file = null
    editForm.value.receipt_file = null
    editForm.value.price_list_files = []
    editForm.value.bill_files = []
    editForm.value.receipt_files = []
    editForm.value.documents = []
    editForm.value.remove_attachment1 = false
    editForm.value.remove_attachment2 = false
    editForm.value.remove_price_list = false
    editForm.value.remove_receipt = false
}

// File Handlers for New Documents
const onPriceListSelected = (e) => {
    const files = Array.from(e.target.files)
    if (files.length) {
        editForm.value.price_list_files = [...(editForm.value.price_list_files || []), ...files]
        editForm.value.remove_price_list = false
    }
}
const removePriceListFile = (index) => {
    editForm.value.price_list_files.splice(index, 1)
}
const removePriceList = () => {
    editForm.value.price_list_file = null
    editForm.value.price_list_url = ''
    editForm.value.remove_price_list = true
}

const onReceiptSelected = (e) => {
    const files = Array.from(e.target.files)
    if (files.length) {
        editForm.value.receipt_files = [...(editForm.value.receipt_files || []), ...files]
        editForm.value.remove_receipt = false
    }
}
const onBillSelected = (e) => {
    const files = Array.from(e.target.files)
    if (files.length) {
        editForm.value.bill_files = [...(editForm.value.bill_files || []), ...files]
    }
}
const removeReceiptFile = (index) => {
    editForm.value.receipt_files.splice(index, 1)
}
const removeBillFile = (index) => {
    editForm.value.bill_files.splice(index, 1)
}
const removeReceipt = () => {
    editForm.value.receipt_file = null
    editForm.value.receipt_url = ''
    editForm.value.remove_receipt = true
}

const getFileThumbnail = (file) => {
    if (!file) return null
    if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file)
    }
    return null
}

const onFileSelected1 = (event) => {
    editForm.value.selectedFile1 = event.target.files[0]
}

const onFileSelected2 = (event) => {
    editForm.value.selectedFile2 = event.target.files[0]
}

const removeAttachment1 = () => {
    editForm.value.remove_attachment1 = true
    editForm.value.treatment_plan1_file_url = ''
}

const onFileSelectedTemp = (event) => {
    editForm.value.selectedFileTemp = event.target.files[0]
}

const removeAttachmentTemp = () => {
    editForm.value.remove_temp_treatment_plan_file = true
    editForm.value.temp_treatment_plan_file_url = ''
}

const deleteExistingDocument = async (docId, index) => {
    const result = await Swal.fire({
        title: locale.value === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?',
        text: locale.value === 'ar' ? 'لن تتمكن من استرجاع هذا الملف!' : 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: locale.value === 'ar' ? 'نعم، احذفه!' : 'Yes, delete it!',
        cancelButtonText: locale.value === 'ar' ? 'إلغاء' : 'Cancel'
    })
    
    if (!result.isConfirmed) return;

    try {
        await $fetch(`${config.public.apiBase}/patient-cases/document/delete/${docId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token.value}` }
        })
        editForm.value.documents.splice(index, 1)
        await refresh()
        Swal.fire({
            title: locale.value === 'ar' ? 'تم الحذف بنجاح!' : 'Deleted successfully!',
            icon: 'success',
            confirmButtonColor: '#10b981',
            timer: 1500,
            showConfirmButton: false
        })
    } catch(e) {
        console.error(e)
    }
}
const removeAttachment2 = () => {
    editForm.value.remove_attachment2 = true
    editForm.value.treatment_plan2_file_url = ''
}

const approveTemporaryPlan = async (item) => {
  const result = await Swal.fire({
      title: locale.value === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?',
      text: locale.value === 'ar' ? 'هل تريد اعتماد هذه الخطة ونقلها كخطة علاج أولى للمريض؟' : 'Do you want to approve this plan and move it to treatment plan 1?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#3085d6',
      confirmButtonText: locale.value === 'ar' ? 'نعم، اعتمدها!' : 'Yes, approve it!',
      cancelButtonText: locale.value === 'ar' ? 'إلغاء' : 'Cancel'
  })
  
  if (!result.isConfirmed) return;

  try {
      const res = await $fetch(`${config.public.apiBase}/patient-cases/${item.id}/approve-temp-plan`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token.value}` }
      })
      if (res && res.success) {
          await refresh()
          Swal.fire({
              title: locale.value === 'ar' ? 'تم الاعتماد بنجاح!' : 'Approved successfully!',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 1500,
              showConfirmButton: false
          })
      }
  } catch(e) {
      console.error(e)
      Swal.fire({
          title: locale.value === 'ar' ? 'خطأ!' : 'Error!',
          text: e.data?.message || e.message,
          icon: 'error',
          confirmButtonColor: '#d33'
      })
  }
}

const saveEdit = async () => {
    isSaving.value = true
    const formData = new FormData()
    if (editForm.value.status) formData.append('status', editForm.value.status)
    if (editForm.value.patient) formData.append('patient_name', editForm.value.patient)
    if (editForm.value.treatment_plan1_status) formData.append('treatment_plan1_status', editForm.value.treatment_plan1_status)
    if (editForm.value.treatment_plan2_status) formData.append('treatment_plan2_status', editForm.value.treatment_plan2_status)
    
    // Only send text notes if they have actual content
    if (editForm.value.treatment_plan1 && editForm.value.treatment_plan1.trim()) formData.append('treatment_plan1', editForm.value.treatment_plan1)
    if (editForm.value.treatment_plan2_text && editForm.value.treatment_plan2_text.trim()) formData.append('treatment_plan2_text', editForm.value.treatment_plan2_text)
    
    // URLs - simplified (just send if not empty)
    if (editForm.value.treatment_plan1_url && editForm.value.treatment_plan1_url.trim()) {
        formData.append('treatment_plan1_url', editForm.value.treatment_plan1_url)
    }
    if (editForm.value.treatment_plan2_url && editForm.value.treatment_plan2_url.trim()) {
        formData.append('treatment_plan2_url', editForm.value.treatment_plan2_url)
    }
    
    // Files
    if (editForm.value.selectedFile1) formData.append('treatment_plan1_file', editForm.value.selectedFile1)
    if (editForm.value.selectedFileTemp) formData.append('temp_treatment_plan_file', editForm.value.selectedFileTemp)
    if (editForm.value.selectedFile2) formData.append('treatment_plan2', editForm.value.selectedFile2)
    if (editForm.value.remove_attachment1) formData.append('delete_treatment_plan1_file', 'true')
    if (editForm.value.remove_temp_treatment_plan_file) formData.append('delete_temp_treatment_plan_file', 'true')
    if (editForm.value.remove_attachment2) formData.append('delete_treatment_plan2', 'true')

    // Temp treatment plan fields
    if (editForm.value.temp_treatment_plan && editForm.value.temp_treatment_plan.trim()) formData.append('temp_treatment_plan', editForm.value.temp_treatment_plan)
    if (editForm.value.temp_treatment_plan_url && editForm.value.temp_treatment_plan_url.trim()) formData.append('temp_treatment_plan_url', editForm.value.temp_treatment_plan_url)
    if (editForm.value.temp_treatment_plan_status) formData.append('temp_treatment_plan_status', editForm.value.temp_treatment_plan_status)
    
    // Documents
    if (editForm.value.price_list_files && editForm.value.price_list_files.length > 0) {
        editForm.value.price_list_files.forEach(f => formData.append('price_list_files[]', f))
    }
    if (editForm.value.receipt_files && editForm.value.receipt_files.length > 0) {
        editForm.value.receipt_files.forEach(f => formData.append('receipt_files[]', f))
    }
    if (editForm.value.bill_files && editForm.value.bill_files.length > 0) {
        editForm.value.bill_files.forEach(f => formData.append('bill_files[]', f))
    }
    if (editForm.value.remove_price_list) formData.append('delete_price_list', 'true')
    if (editForm.value.remove_receipt) formData.append('delete_receipt', 'true')
    
    formData.append('main_category_id', editForm.value.main_category_id || 'null')
    formData.append('sub_category_id', editForm.value.sub_category_id || 'null')
    formData.append('sub_category_id2', editForm.value.sub_category_id2 || 'null')
    
    // Only send optional fields if they have actual values
    if (editForm.value.aligners_notes && editForm.value.aligners_notes.trim()) formData.append('aligners_notes', editForm.value.aligners_notes)
    if (editForm.value.accessories_notes && editForm.value.accessories_notes.trim()) formData.append('accessories_notes', editForm.value.accessories_notes)
    if (editForm.value.document_notes !== undefined) formData.append('document_notes', editForm.value.document_notes || '')
    if (editForm.value.aligners_upper !== null && editForm.value.aligners_upper !== '') formData.append('aligners_upper', editForm.value.aligners_upper)
    if (editForm.value.aligners_lower !== null && editForm.value.aligners_lower !== '') formData.append('aligners_lower', editForm.value.aligners_lower)
    if (editForm.value.accessories_data) formData.append('accessories_data', JSON.stringify(editForm.value.accessories_data))
    if (editForm.value.lab_status && editForm.value.lab_status.trim()) formData.append('lab_status', editForm.value.lab_status)
    formData.append('case_type', editForm.value.case_type || 'Aligner')

    try {
        const res = await $fetch(`${config.public.apiBase}/patient-cases/${editForm.value.id}/update`, {
            method: 'POST', 
            body: formData,
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })
        
        // Refresh data from API to get the correct modified dates and file URLs
        await refresh()
        
        // Close modal first
        closeModal()
        isSaving.value = false
        
        // Show success message
        Swal.fire({
            title: locale.value === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved Successfully!',
            text: locale.value === 'ar' ? 'تم تحديث بيانات الحالة' : 'Case data has been updated',
            icon: 'success',
            confirmButtonColor: '#10b981',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
        }).then(() => {
            navigateTo('/dashboard')
        })
    } catch(e) {
        console.error('Save failed', e)
        isSaving.value = false
        const errorMsg = e?.data?.message || e?.statusMessage || e?.message || t('save_failed') || 'حدث خطأ أثناء الحفظ'
        Swal.fire({
            title: t('error') || 'Error',
            text: errorMsg,
            icon: 'error',
            confirmButtonColor: '#10b981'
        })
    }
}
</script>

<style>
.custom-patient-table th {
  color: inherit;
}

.custom-patient-table td {
  font-size: 13px !important;
  color: #000000;
}

.dark .custom-patient-table th,
.dark .custom-patient-table td {
  color: #ffffff !important;
}

.text-white-force {
  color: #ffffff !important;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scroll::-webkit-scrollbar-thumb {
  background-color: #334155;
}
</style>
