<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
    <!-- Back Button -->
    <div>
      <NuxtLink :to="localePath('/admin/patient-cases')" class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105">
        <i class="fas fa-arrow-left rtl:rotate-180"></i>
        <span>{{ locale === 'ar' ? 'رجوع' : 'Back' }}</span>
      </NuxtLink>
    </div>

    <!-- Page Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          {{ activeTab === 'doctors' ? (locale === 'ar' ? 'إدارة الأطباء' : 'Doctors Management') : (locale === 'ar' ? 'إدارة الموظفين' : 'Employees Management') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ activeTab === 'doctors' 
            ? (locale === 'ar' ? 'مراجعة طلبات تسجيل الأطباء وتفعيل حساباتهم لإرسال بيانات الدخول لهم.' : 'Review registration requests, activate accounts and email login details to doctors.')
            : (locale === 'ar' ? 'إضافة الموظفين وتعديل صلاحياتهم وقفل وفتح الخدمات لهم.' : 'Add employees, edit permissions, and toggle services visibility.') }}
        </p>
      </div>
      
      <!-- Add Employee Button -->
      <button 
        v-if="activeTab === 'employees'"
        @click="openEmployeeModal()"
        class="px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all active:scale-95 cursor-pointer"
      >
        <i class="fas fa-user-plus"></i>
        <span>{{ locale === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee' }}</span>
      </button>
    </div>

    <!-- Tab Selector -->
    <div class="flex border-b border-slate-200 dark:border-slate-800 gap-4 mb-2">
      <button 
        @click="activeTab = 'doctors'" 
        class="pb-3 text-lg font-black transition-all border-b-4 px-4 cursor-pointer"
        :class="activeTab === 'doctors' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
      >
        {{ locale === 'ar' ? 'الأطباء' : 'Doctors' }}
      </button>
      <button 
        @click="activeTab = 'employees'" 
        class="pb-3 text-lg font-black transition-all border-b-4 px-4 cursor-pointer"
        :class="activeTab === 'employees' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
      >
        {{ locale === 'ar' ? 'الموظفين (صلاحيات الأعمدة والخدمات)' : 'Employees (Permissions)' }}
      </button>
    </div>

    <!-- Filters & Search Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <!-- Status Filter -->
      <div v-show="activeTab === 'doctors'" class="flex items-center gap-3">
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

    <!-- Table Card -->
    <div id="doctors-table-card" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative">
      <div class="overflow-x-auto w-full">
        <!-- Doctors Table -->
        <table v-show="activeTab === 'doctors'" class="w-full text-left rtl:text-right border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <th class="p-4 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ locale === 'ar' ? 'الاسم' : 'Name' }}</th>
              <th class="p-4 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('email') }}</th>
              <th class="p-4 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('phone') }}</th>
              <th class="p-4 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ locale === 'ar' ? 'الموقع' : 'Location' }}</th>
              <th class="p-4 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('status') }}</th>
              <th class="p-4 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ locale === 'ar' ? 'تاريخ التسجيل' : 'Registration Date' }}</th>
              <th class="p-4 border-b border-slate-200 dark:border-slate-800 text-center">{{ locale === 'ar' ? 'الإجراءات' : 'Actions' }}</th>
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
              v-else-if="paginatedDoctors.length > 0" 
              v-for="doc in paginatedDoctors" 
              :key="doc.id" 
              class="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/10"
            >
              <!-- Name -->
              <td class="p-4 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-slate-800 dark:text-slate-100">
                {{ doc.name }}
              </td>
              <!-- Email -->
              <td class="p-4 border-r border-slate-200 dark:border-slate-800 text-center font-semibold text-slate-600 dark:text-slate-300">
                {{ doc.email }}
              </td>
              <!-- Phone -->
              <td class="p-4 border-r border-slate-200 dark:border-slate-800 text-center font-semibold text-slate-600 dark:text-slate-300">
                {{ doc.phone }}
              </td>
              <!-- Location -->
              <td class="p-4 border-r border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                <span v-if="doc.country || doc.region || doc.area">
                  {{ [doc.country, doc.region, doc.area].filter(Boolean).join(' / ') }}
                </span>
                <span v-else class="text-slate-400">-</span>
              </td>
              <!-- Status -->
              <td class="p-4 border-r border-slate-200 dark:border-slate-800 text-center">
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
              <td class="p-4 border-r border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 font-sans">
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
                    class="h-8 px-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <i class="fas fa-check"></i>
                    {{ locale === 'ar' ? 'تفعيل' : 'Approve' }}
                  </button>

                  <!-- Impersonate Button -->
                  <button 
                    v-if="doc.status === 'active'"
                    @click="impersonateDoctor(doc)"
                    :disabled="loading"
                    class="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    :title="locale === 'ar' ? 'تسجيل دخول كطبيب' : 'Login as Doctor'"
                  >
                    <i class="fas fa-user-secret"></i>
                    {{ locale === 'ar' ? 'دخول كطبيب' : 'Login As' }}
                  </button>

                  <!-- Delete Button -->
                  <button 
                    @click="deleteDoctor(doc.id)"
                    :disabled="loading"
                    class="h-8 w-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md shadow-red-500/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    :title="t('delete')"
                  >
                    <i class="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Employees Table -->
        <table v-show="activeTab === 'employees'" class="w-full text-left rtl:text-right border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <th class="p-4 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ locale === 'ar' ? 'الاسم' : 'Name' }}</th>
              <th class="p-4 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('email') }}</th>
              <th class="p-4 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ t('status') }}</th>
              <th class="p-4 border-b border-r border-slate-200 dark:border-slate-800 text-center">{{ locale === 'ar' ? 'تاريخ الإضافة' : 'Date Added' }}</th>
              <th class="p-4 border-b border-slate-200 dark:border-slate-800 text-center">{{ locale === 'ar' ? 'الإجراءات والصلاحيات' : 'Actions & Permissions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            <!-- Loading skeleton -->
            <tr v-if="loadingEmployees" v-for="i in 5" :key="i" class="animate-pulse">
              <td class="p-4" colspan="5">
                <div class="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
              </td>
            </tr>
            <!-- Empty state -->
            <tr v-else-if="filteredEmployees.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-500 dark:text-slate-400 font-semibold">
                {{ locale === 'ar' ? 'لا يوجد موظفين مطابقين للتصفية' : 'No employees matched your filters' }}
              </td>
            </tr>
            <!-- Employees rows -->
            <tr 
              v-else-if="paginatedEmployees.length > 0" 
              v-for="emp in paginatedEmployees" 
              :key="emp.id" 
              class="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/10"
            >
              <td class="p-4 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-slate-800 dark:text-slate-100">
                {{ emp.name }}
              </td>
              <td class="p-4 border-r border-slate-200 dark:border-slate-800 text-center font-semibold text-slate-600 dark:text-slate-300">
                {{ emp.email }}
              </td>
              <td class="p-4 border-r border-slate-200 dark:border-slate-800 text-center">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                  :class="emp.status === 'active' 
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'"
                >
                  <span class="h-1.5 w-1.5 rounded-full mr-1.5 rtl:ml-1.5" :class="emp.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                  {{ emp.status === 'active' ? (locale === 'ar' ? 'نشط' : 'Active') : (locale === 'ar' ? 'غير نشط' : 'Inactive') }}
                </span>
              </td>
              <td class="p-4 border-r border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 font-sans">
                {{ emp.created_at || '-' }}
              </td>
              <td class="p-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <!-- Permissions Button -->
                  <button 
                    @click="openPermissionsModal(emp)"
                    class="h-8 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-500/10 transition-all active:scale-95 cursor-pointer"
                  >
                    <i class="fas fa-shield-alt"></i>
                    {{ locale === 'ar' ? 'الصلاحيات والأعمدة' : 'Permissions' }}
                  </button>

                  <!-- Edit Button -->
                  <button 
                    @click="openEmployeeModal(emp)"
                    class="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-amber-500/10 transition-all active:scale-95 cursor-pointer"
                  >
                    <i class="fas fa-edit"></i>
                    {{ locale === 'ar' ? 'تعديل' : 'Edit' }}
                  </button>

                  <!-- Delete Button -->
                  <button 
                    @click="deleteEmployee(emp)"
                    class="h-8 px-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-rose-500/10 transition-all active:scale-95 cursor-pointer"
                  >
                    <i class="fas fa-trash"></i>
                    {{ locale === 'ar' ? 'حذف' : 'Delete' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls (Doctors) -->
      <div v-show="activeTab === 'doctors' && totalPages > 1" class="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-6 mt-auto">
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
          <button 
            @click="currentPage = 1" 
            :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500"
            :title="locale === 'ar' ? 'الصفحة الأولى' : 'First Page'"
          >
            <i class="fas fa-angle-double-left rtl:rotate-180"></i>
          </button>

          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500"
          >
            <i class="fas fa-chevron-left rtl:rotate-180"></i>
          </button>

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

          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500"
          >
            <i class="fas fa-chevron-right rtl:rotate-180"></i>
          </button>

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

      <!-- Pagination Controls (Employees) -->
      <div v-show="activeTab === 'employees' && totalEmpPages > 1" class="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-6 mt-auto">
        <div class="flex items-center gap-3">
            <span class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {{ t('page') }} 
            </span>
            <div class="px-4 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-black text-teal-600 dark:text-teal-400 shadow-inner flex items-center gap-2">
                <span>{{ currentEmpPage }}</span>
                <span class="text-slate-300 dark:text-slate-700">/</span>
                <span class="opacity-60">{{ totalEmpPages }}</span>
            </div>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          <button 
            @click="currentEmpPage = 1" 
            :disabled="currentEmpPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500"
            :title="locale === 'ar' ? 'الصفحة الأولى' : 'First Page'"
          >
            <i class="fas fa-angle-double-left rtl:rotate-180"></i>
          </button>

          <button 
            @click="currentEmpPage--" 
            :disabled="currentEmpPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500"
          >
            <i class="fas fa-chevron-left rtl:rotate-180"></i>
          </button>

          <div class="flex items-center gap-2 px-1">
            <template v-for="p in visibleEmpPages" :key="p">
                <span v-if="p === '...'" class="px-2 text-slate-400 font-bold italic select-none">...</span>
                <button 
                  v-else
                  @click="currentEmpPage = p"
                  class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border outline-none active:translate-y-[2px] active:shadow-none"
                  :class="p === currentEmpPage 
                    ? 'bg-gradient-to-b from-teal-400 to-teal-600 text-white border-teal-500 shadow-[0_4px_0_rgb(13,148,136),0_8px_15px_rgba(20,184,166,0.2)]' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] hover:border-teal-500/50 hover:text-teal-500'"
                >
                  {{ p }}
                </button>
            </template>
          </div>

          <button 
            @click="currentEmpPage++" 
            :disabled="currentEmpPage === totalEmpPages"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500"
          >
            <i class="fas fa-chevron-right rtl:rotate-180"></i>
          </button>

          <button 
            @click="currentEmpPage = totalEmpPages" 
            :disabled="currentEmpPage === totalEmpPages"
            class="w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_rgb(226,232,240)] dark:shadow-[0_3px_0_rgb(30,41,59)] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-500"
            :title="locale === 'ar' ? 'الصفحة الأخيرة' : 'Last Page'"
          >
            <i class="fas fa-angle-double-right rtl:rotate-180"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Employee Add/Edit Modal ─── -->
    <div v-if="isEmployeeModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all scale-100">
        <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
          <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <i class="fas" :class="employeeForm.id ? 'fa-user-edit' : 'fa-user-plus'"></i>
            {{ employeeForm.id ? (locale === 'ar' ? 'تعديل حساب الموظف' : 'Edit Employee') : (locale === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee') }}
          </h3>
          <button @click="isEmployeeModalOpen = false" class="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{{ locale === 'ar' ? 'الاسم الأول' : 'First Name' }} *</label>
              <input type="text" v-model="employeeForm.f_name" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none dark:text-white transition-all">
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{{ locale === 'ar' ? 'الاسم الأخير' : 'Last Name' }} *</label>
              <input type="text" v-model="employeeForm.l_name" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none dark:text-white transition-all">
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{{ locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address' }} *</label>
            <input type="email" v-model="employeeForm.email" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none dark:text-white transition-all">
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              {{ locale === 'ar' ? 'كلمة المرور' : 'Password' }} 
              <span v-if="!employeeForm.id">*</span>
              <span v-else class="text-[10px] text-slate-400 uppercase tracking-tight">({{ locale === 'ar' ? 'اتركه فارغاً لعدم التغيير' : 'leave empty to keep same' }})</span>
            </label>
            <input type="password" v-model="employeeForm.password" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none dark:text-white transition-all">
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{{ locale === 'ar' ? 'الحالة' : 'Status' }}</label>
            <select v-model="employeeForm.status" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none dark:text-white transition-all cursor-pointer">
              <option value="active">{{ locale === 'ar' ? 'نشط' : 'Active' }}</option>
              <option value="inactive">{{ locale === 'ar' ? 'غير نشط' : 'Inactive' }}</option>
            </select>
          </div>
        </div>

        <div class="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <button @click="isEmployeeModalOpen = false" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm transition-all cursor-pointer">
            {{ t('cancel') }}
          </button>
          <button @click="saveEmployee" class="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-teal-500/25 transition-all active:scale-95 cursor-pointer">
            {{ locale === 'ar' ? 'حفظ البيانات' : 'Save Employee' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Permissions & Columns Modal ─── -->
    <div v-if="isPermissionsModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all scale-100">
        <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
          <div>
            <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <i class="fas fa-shield-alt text-teal-500"></i>
              {{ locale === 'ar' ? 'تعديل الصلاحيات والأعمدة للموظف' : 'Configure Employee Permissions' }}
            </h3>
            <p class="text-xs text-slate-400 font-bold mt-0.5">{{ currentEmployee?.name }} ({{ currentEmployee?.email }})</p>
          </div>
          <button @click="isPermissionsModalOpen = false" class="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-6 space-y-6 overflow-y-auto flex-1 custom-scroll">
          <!-- 1. Pages/Services Permission -->
          <div class="space-y-3">
            <h4 class="text-sm font-black text-slate-700 dark:text-slate-300 border-b pb-2 flex items-center gap-2 uppercase tracking-widest"><i class="fas fa-layer-group text-teal-500"></i> {{ locale === 'ar' ? 'الخدمات المتاحة (الصفحات)' : 'Accessible Services (Pages)' }}</h4>
            <div class="grid grid-cols-2 gap-4">
              <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.pages.patient_cases" class="w-5 h-5 accent-teal-500 rounded cursor-pointer">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'جدول الحالات المرضية' : 'Patient Cases Table' }}</span>
              </label>
              <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.pages.categories" class="w-5 h-5 accent-teal-500 rounded cursor-pointer">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'إدارة الباقات والأقسام' : 'Packages & Categories' }}</span>
              </label>

              <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.pages.notifications" class="w-5 h-5 accent-teal-500 rounded cursor-pointer">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الإشعارات' : 'Notifications' }}</span>
              </label>
            </div>
          </div>

          <!-- 2a. Virtual Planning Columns -->
          <div class="space-y-3">
            <h4 class="text-sm font-black text-slate-700 dark:text-slate-300 border-b pb-2 flex items-center gap-2 uppercase tracking-widest">
              <i class="fas fa-project-diagram text-purple-500"></i>
              {{ locale === 'ar' ? 'أعمدة قسم التخطيط الافتراضي' : 'Virtual Planning Columns' }}
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label class="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800/40 cursor-pointer hover:bg-purple-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.vp_patient" class="w-4 h-4 accent-purple-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'المريض' : 'Patient' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800/40 cursor-pointer hover:bg-purple-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.vp_doctor" class="w-4 h-4 accent-purple-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الطبيب' : 'Doctor' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800/40 cursor-pointer hover:bg-purple-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.vp_plans" class="w-4 h-4 accent-purple-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الخطط العلاجية' : 'Treatment Plans' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800/40 cursor-pointer hover:bg-purple-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.vp_status" class="w-4 h-4 accent-purple-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الحالة' : 'Status' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800/40 cursor-pointer hover:bg-purple-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.vp_actions" class="w-4 h-4 accent-purple-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الإجراءات' : 'Actions' }}</span>
              </label>
            </div>
          </div>

          <!-- 2b. Finance Columns -->
          <div class="space-y-3">
            <h4 class="text-sm font-black text-slate-700 dark:text-slate-300 border-b pb-2 flex items-center gap-2 uppercase tracking-widest">
              <i class="fas fa-file-invoice-dollar text-amber-500"></i>
              {{ locale === 'ar' ? 'أعمدة قسم الماليات' : 'Finance Columns' }}
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label class="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 cursor-pointer hover:bg-amber-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.fin_patient" class="w-4 h-4 accent-amber-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'المريض' : 'Patient' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 cursor-pointer hover:bg-amber-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.fin_doctor" class="w-4 h-4 accent-amber-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الطبيب' : 'Doctor' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 cursor-pointer hover:bg-amber-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.fin_package" class="w-4 h-4 accent-amber-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الباقة' : 'Package' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 cursor-pointer hover:bg-amber-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.fin_price_list" class="w-4 h-4 accent-amber-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'قائمة الأسعار' : 'Price List' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 cursor-pointer hover:bg-amber-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.fin_doc_notes" class="w-4 h-4 accent-amber-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'ملاحظات الوثيقة' : 'Document Notes' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 cursor-pointer hover:bg-amber-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.fin_receipts" class="w-4 h-4 accent-amber-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الإيصالات والفواتير' : 'Receipts & Bills' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 cursor-pointer hover:bg-amber-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.fin_actions" class="w-4 h-4 accent-amber-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الإجراءات' : 'Actions' }}</span>
              </label>
            </div>
          </div>

          <!-- 2c. Laboratory Columns -->
          <div class="space-y-3">
            <h4 class="text-sm font-black text-slate-700 dark:text-slate-300 border-b pb-2 flex items-center gap-2 uppercase tracking-widest">
              <i class="fas fa-flask text-teal-500"></i>
              {{ locale === 'ar' ? 'أعمدة قسم المختبر' : 'Laboratory Columns' }}
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label class="flex items-center gap-2 p-2 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-800/40 cursor-pointer hover:bg-teal-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.lab_patient" class="w-4 h-4 accent-teal-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'المريض' : 'Patient' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-800/40 cursor-pointer hover:bg-teal-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.lab_doctor" class="w-4 h-4 accent-teal-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الطبيب' : 'Doctor' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-800/40 cursor-pointer hover:bg-teal-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.lab_case_type" class="w-4 h-4 accent-teal-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'نوع الحالة' : 'Case Type' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-800/40 cursor-pointer hover:bg-teal-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.lab_aligners" class="w-4 h-4 accent-teal-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الألاينر المسلم' : 'Aligners Delivered' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-800/40 cursor-pointer hover:bg-teal-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.lab_accessories" class="w-4 h-4 accent-teal-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الملحقات' : 'Accessories' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-800/40 cursor-pointer hover:bg-teal-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.lab_manufacturing" class="w-4 h-4 accent-teal-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'حالة التصنيع' : 'Manufacturing Status' }}</span>
              </label>
              <label class="flex items-center gap-2 p-2 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-800/40 cursor-pointer hover:bg-teal-100/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.columns.lab_actions" class="w-4 h-4 accent-teal-500 rounded">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'الإجراءات' : 'Actions' }}</span>
              </label>
            </div>
          </div>

          <!-- 3. Actions Permissions inside Dialogue -->
          <div class="space-y-3">
            <h4 class="text-sm font-black text-slate-700 dark:text-slate-300 border-b pb-2 flex items-center gap-2 uppercase tracking-widest"><i class="fas fa-lock text-rose-500"></i> {{ locale === 'ar' ? 'العمليات المسموح بها للموظف' : 'Allowed Actions inside Case Editor' }}</h4>
            <div class="grid grid-cols-2 gap-4">
              <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.actions.edit_general" class="w-5 h-5 accent-teal-500 rounded">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'تعديل البيانات العامة للحالة' : 'Edit General Case Info' }}</span>
              </label>
              <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.actions.edit_aligners" class="w-5 h-5 accent-teal-500 rounded">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'تعديل أعداد وحالات الألاينر' : 'Edit Aligners Details' }}</span>
              </label>
              <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.actions.edit_accessories" class="w-5 h-5 accent-teal-500 rounded">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'تعديل الملحقات المسلمة' : 'Edit Accessories Details' }}</span>
              </label>
              <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.actions.edit_plans" class="w-5 h-5 accent-teal-500 rounded">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'تعديل ورفع الخطط العلاجية' : 'Edit Treatment Plans' }}</span>
              </label>
              <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.actions.edit_documents" class="w-5 h-5 accent-teal-500 rounded">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'تعديل الملفات والماليات والملاحظات' : 'Edit Finance & Files' }}</span>
              </label>
              <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.actions.edit_package" class="w-5 h-5 accent-teal-500 rounded">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'تعديل الباقة أو التصنيف' : 'Edit Package/Category' }}</span>
              </label>
              <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                <input type="checkbox" v-model="permissionsForm.actions.delete_case" class="w-5 h-5 accent-teal-500 rounded">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ locale === 'ar' ? 'حذف الحالة المرضية' : 'Delete Case' }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <button @click="isPermissionsModalOpen = false" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm transition-all cursor-pointer">
            {{ t('cancel') }}
          </button>
          <button @click="savePermissions" class="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-teal-500/25 transition-all active:scale-95 cursor-pointer">
            {{ locale === 'ar' ? 'تحديث الصلاحيات' : 'Save Permissions' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

const { t, locale } = useI18n()
const localePath = useLocalePath()
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

// Pagination Logic
const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(filteredDoctors.value.length / itemsPerPage) || 1)

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

const paginatedDoctors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredDoctors.value.slice(start, end)
})

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

watch(currentPage, () => {
  if (typeof window !== 'undefined') {
    const tableCardEl = document.getElementById('doctors-table-card')
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

// ─── Employee Management Logic ──────────────────────────────────────────────────
const activeTab = ref('doctors')
const employeesList = ref([])
const loadingEmployees = ref(false)

const fetchEmployees = async () => {
  loadingEmployees.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/employees`, { headers: headers.value })
    if (res?.success) {
      employeesList.value = res.data || []
    }
  } catch (e) {
    console.error('Failed to fetch employees', e)
  } finally {
    loadingEmployees.value = false
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'employees') {
    fetchEmployees()
  }
})

const filteredEmployees = computed(() => {
  return employeesList.value.filter(emp => {
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      const name = (emp.name || '').toLowerCase()
      const email = (emp.email || '').toLowerCase()
      return name.includes(query) || email.includes(query)
    }
    return true
  })
})

const currentEmpPage = ref(1)
const totalEmpPages = computed(() => Math.ceil(filteredEmployees.value.length / itemsPerPage) || 1)
const visibleEmpPages = computed(() => {
  const total = totalEmpPages.value
  const current = currentEmpPage.value
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
const paginatedEmployees = computed(() => {
  const start = (currentEmpPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEmployees.value.slice(start, end)
})

watch([searchQuery], () => {
  currentEmpPage.value = 1
})

const isEmployeeModalOpen = ref(false)
const employeeForm = ref({
  id: null,
  f_name: '',
  l_name: '',
  email: '',
  password: '',
  status: 'active'
})

const openEmployeeModal = (emp = null) => {
  if (emp) {
    employeeForm.value = {
      id: emp.id,
      f_name: emp.f_name || '',
      l_name: emp.l_name || '',
      email: emp.email || '',
      password: '',
      status: emp.status || 'active'
    }
  } else {
    employeeForm.value = {
      id: null,
      f_name: '',
      l_name: '',
      email: '',
      password: '',
      status: 'active'
    }
  }
  isEmployeeModalOpen.value = true
}

const saveEmployee = async () => {
  if (!employeeForm.value.f_name || !employeeForm.value.l_name || !employeeForm.value.email) {
    Swal.fire({
      icon: 'error',
      title: t('error'),
      text: locale.value === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields'
    })
    return
  }
  
  if (!employeeForm.value.id && !employeeForm.value.password) {
    Swal.fire({
      icon: 'error',
      title: t('error'),
      text: locale.value === 'ar' ? 'يرجى إدخال كلمة المرور للموظف الجديد' : 'Please enter a password for the new employee'
    })
    return
  }

  loading.value = true
  try {
    const url = employeeForm.value.id 
      ? `${config.public.apiBase}/employees/${employeeForm.value.id}/update`
      : `${config.public.apiBase}/employees`
    
    const body = { ...employeeForm.value }
    if (!body.password) delete body.password

    const res = await $fetch(url, {
      method: 'POST',
      headers: headers.value,
      body
    })

    if (res?.success) {
      Swal.fire({
        icon: 'success',
        title: locale.value === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved Successfully!',
        timer: 1500,
        showConfirmButton: false
      })
      isEmployeeModalOpen.value = false
      fetchEmployees()
    }
  } catch (e) {
    console.error(e)
    Swal.fire({
      icon: 'error',
      title: t('error'),
      text: e.data?.message || (locale.value === 'ar' ? 'فشل حفظ بيانات الموظف' : 'Failed to save employee data')
    })
  } finally {
    loading.value = false
  }
}

const deleteEmployee = async (emp) => {
  const result = await Swal.fire({
    title: locale.value === 'ar' ? 'حذف الموظف؟' : 'Delete Employee?',
    text: locale.value === 'ar' ? `هل أنت متأكد من حذف الحساب الخاص بـ ${emp.name}؟` : `Are you sure you want to delete the account for ${emp.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: locale.value === 'ar' ? 'نعم، احذف' : 'Yes, Delete',
    cancelButtonText: t('cancel')
  })

  if (!result.isConfirmed) return

  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/employees/${emp.id}`, {
      method: 'DELETE',
      headers: headers.value
    })
    if (res?.success) {
      Swal.fire({
        icon: 'success',
        title: locale.value === 'ar' ? 'تم الحفظ!' : 'Deleted!',
        timer: 1500,
        showConfirmButton: false
      })
      fetchEmployees()
    }
  } catch (e) {
    console.error(e)
    Swal.fire({
      icon: 'error',
      title: t('error'),
      text: locale.value === 'ar' ? 'فشل حذف الموظف' : 'Failed to delete employee'
    })
  } finally {
    loading.value = false
  }
}

const isPermissionsModalOpen = ref(false)
const currentEmployee = ref(null)

const defaultPerms = {
  pages: { patient_cases: true, categories: true, doctors: true, notifications: true },
  columns: {
    // Virtual Planning
    vp_patient: true, vp_doctor: true, vp_plans: true, vp_status: true, vp_actions: true,
    // Finance
    fin_patient: true, fin_doctor: true, fin_package: true, fin_price_list: true, fin_doc_notes: true, fin_receipts: true, fin_actions: true,
    // Laboratory
    lab_patient: true, lab_doctor: true, lab_case_type: true, lab_aligners: true, lab_accessories: true, lab_manufacturing: true, lab_actions: true,
    // Legacy (keep for backward compat)
    patient: true, doctor: true, case_type: true, aligners: true, accessories: true, finance: true, plans: true, package: true, actions: true
  },
  actions: {
    edit_general: true, edit_aligners: true, edit_accessories: true,
    edit_plans: true, edit_documents: true, edit_package: true, delete_case: true
  }
}

const permissionsForm = ref(JSON.parse(JSON.stringify(defaultPerms)))

const openPermissionsModal = (emp) => {
  currentEmployee.value = emp

  const rawPerms = emp.permissions
  if (rawPerms) {
    const parsed = typeof rawPerms === 'string' ? JSON.parse(rawPerms) : rawPerms
    permissionsForm.value = {
      pages: { ...defaultPerms.pages, ...(parsed.pages || {}) },
      columns: { ...defaultPerms.columns, ...(parsed.columns || {}) },
      actions: { ...defaultPerms.actions, ...(parsed.actions || {}) }
    }
  } else {
    permissionsForm.value = JSON.parse(JSON.stringify(defaultPerms))
  }

  isPermissionsModalOpen.value = true
}

const savePermissions = async () => {
  if (!currentEmployee.value) return
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/employees/${currentEmployee.value.id}/update`, {
      method: 'POST',
      headers: headers.value,
      body: {
        f_name: currentEmployee.value.f_name,
        l_name: currentEmployee.value.l_name,
        email: currentEmployee.value.email,
        status: currentEmployee.value.status,
        permissions: permissionsForm.value
      }
    })

    if (res?.success) {
      Swal.fire({
        icon: 'success',
        title: locale.value === 'ar' ? 'تم تحديث الصلاحيات بنجاح!' : 'Permissions Updated!',
        timer: 1500,
        showConfirmButton: false
      })
      isPermissionsModalOpen.value = false
      fetchEmployees()
    }
  } catch (e) {
    console.error(e)
    Swal.fire({
      icon: 'error',
      title: t('error'),
      text: locale.value === 'ar' ? 'فشل حفظ الصلاحيات' : 'Failed to save permissions'
    })
  } finally {
    loading.value = false
  }
}
</script>
