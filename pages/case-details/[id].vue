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
                  UUID: {{ caseData.case.uuid || ('#CASE-' + caseData.case.id) }}
                </span>
                <span :class="getStatusClass(caseData.case.status)" class="px-3 py-1 rounded-full text-white text-xs font-black tracking-widest uppercase">
                  {{ caseData.case.status }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 relative z-10">
            <button 
              @click="downloadPDF" 
              :disabled="isGeneratingPDF"
              class="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-50"
            >
              <i v-if="isGeneratingPDF" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-file-pdf text-red-500"></i>
              {{ isGeneratingPDF ? 'Preparing PDF...' : 'Download PDF' }}
            </button>
            <button @click="refineCase" class="flex-1 md:flex-none px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
              <i class="fas fa-layer-group"></i>
              {{ $t('refinement') }}
            </button>
            <button class="flex-1 md:flex-none px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
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
          
          <!-- Main Column: Tab Content -->
          <div :class="activeTab === 'detailed_plan' ? 'lg:col-span-12' : 'lg:col-span-8'" class="space-y-8">
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
                    <img v-if="img" :src="fixFileUrl(img)" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
                
                <div v-if="caseData.treatmentOptions?.length" class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                  <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                      <thead>
                        <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                          <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">#</th>
                          <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-48">{{ $t('plan_option') || 'Plan Option' }}</th>
                          <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('details') || 'Details' }}</th>
                          <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">{{ $t('date') || 'Date' }}</th>
                          <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">{{ $t('time') || 'Time' }}</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                        <tr v-for="(opt, idx) in filteredOptions" :key="idx" class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group">
                          <td class="px-6 py-5 text-sm font-bold text-slate-400">{{ idx + 1 }}</td>
                          <td class="px-6 py-5">
                            <span class="inline-flex items-center px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase tracking-wider group-hover:bg-brand-primary/20 transition-colors">
                              {{ opt.treatmnet_option_type }}
                            </span>
                          </td>
                          <td class="px-6 py-5">
                            <div class="space-y-3">
                              <p class="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{{ opt.treatmnet_option_details }}</p>
                              
                              <!-- Visual Teeth Display -->
                              <div v-if="getTeethForOption(opt.treatmnet_option_type).length" class="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 max-w-lg">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                  <i class="fas fa-tooth text-brand-primary"></i>
                                  {{ $t('visual_teeth_map') || 'Visual Teeth Map' }}
                                </p>
                                <TeethSelector 
                                  :selectedTeeth="getTeethForOption(opt.treatmnet_option_type)" 
                                  readonly 
                                  compact 
                                />
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-5 whitespace-nowrap">
                            <span class="text-xs font-black text-slate-500 uppercase tracking-wider">{{ formatDate(opt.created_at) }}</span>
                          </td>
                          <td class="px-6 py-5 whitespace-nowrap">
                            <span class="text-xs font-black text-slate-400 uppercase tracking-wider">{{ formatTime(opt.created_at) }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div v-else class="text-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <i class="fas fa-clipboard-list text-4xl text-slate-300 mb-4"></i>
                  <p class="text-slate-500 font-bold uppercase tracking-widest text-sm">{{ $t('no_plans_yet') || 'No treatment plans recorded yet' }}</p>
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

          <!-- Right Column: Patient Stats & Actions (Hidden for Detailed Plan to allow full width) -->
          <div v-if="activeTab !== 'detailed_plan'" class="lg:col-span-4 space-y-8">
            
            <!-- Actions Card -->
            <div v-if="activeTab.startsWith('plan')" class="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-6">
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

        <!-- Bottom Section for Detailed Plan -->
        <div v-if="activeTab === 'detailed_plan'" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-12">
            <!-- Notes Card moved to bottom for detailed plan -->
            <div class="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-6">
               <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6">Internal Notes</h3>
               <textarea readonly class="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm text-slate-600 dark:text-slate-400 font-medium" rows="4" placeholder="No notes available..."></textarea>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Image Lightbox -->
    <Transition name="fade">
      <div v-if="showLightbox" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md" @click="showLightbox = false">
        <!-- Close Button -->
        <button @click="showLightbox = false" class="absolute top-8 right-8 w-14 h-14 rounded-full bg-white/10 hover:bg-red-500 hover:scale-110 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-xl border border-white/20 shadow-2xl group">
          <i class="fas fa-times text-2xl group-hover:rotate-90 transition-transform duration-300"></i>
        </button>

        <div class="relative max-w-7xl w-full h-full flex items-center justify-center" @click.stop>
          <img 
            :src="selectedImage" 
            class="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in duration-300" 
            alt="Medical Record"
          >
        </div>
      </div>
    </Transition>
    
    <!-- Hidden PDF Template (Rendered off-screen) -->
    <div v-if="caseData" class="fixed -left-[9999px] top-0 pointer-events-none">
      <div id="pdf-content" class="p-12 bg-white text-slate-900 font-sans" style="width: 800px;">
        <!-- Header -->
        <div class="flex justify-between items-start border-b-4 border-[#063c31] pb-8 mb-8">
          <div>
            <h1 class="text-4xl font-black text-[#063c31] uppercase tracking-tighter">Oralign</h1>
            <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Patient Treatment Summary</p>
          </div>
          <div class="text-right">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Date Generated</p>
            <p class="text-sm font-bold">{{ new Date().toLocaleDateString() }}</p>
          </div>
        </div>

        <!-- Patient Info Grid -->
        <div class="grid grid-cols-2 gap-8 mb-12 bg-slate-50 p-8 rounded-3xl border border-slate-100">
           <div>
             <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#063c31] mb-4">Patient Information</h4>
             <div class="space-y-2">
               <p class="text-sm"><strong>Name:</strong> {{ caseData.case.patient_name }}</p>
               <p class="text-sm"><strong>Gender:</strong> {{ caseData.case.gender }}</p>
               <p class="text-sm"><strong>DOB:</strong> {{ caseData.case.dob }}</p>
               <p class="text-sm"><strong>UUID:</strong> {{ caseData.case.uuid || ('#CASE-' + caseData.case.id) }}</p>
             </div>
           </div>
           <div>
             <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#063c31] mb-4">Case Details</h4>
             <div class="space-y-2">
               <p class="text-sm"><strong>Case Type:</strong> {{ caseData.case.case_type }}</p>
               <p class="text-sm"><strong>Status:</strong> {{ caseData.case.status }}</p>
               <p class="text-sm"><strong>Created:</strong> {{ formatDate(caseData.case.created_at) }}</p>
             </div>
           </div>
        </div>

        <!-- Detailed Plan Section -->
        <div v-if="caseData.detailedPlan" class="space-y-12">
          <h3 class="text-xl font-black text-[#063c31] border-b-2 border-slate-100 pb-2">Clinical Detailed Plan</h3>
          
          <div v-for="cat in clinicalCategories" :key="cat.id">
            <div v-if="isCategoryActive(cat.id)" class="break-inside-avoid space-y-6 p-6 rounded-3xl border border-slate-100 bg-white shadow-sm">
               <div class="flex items-center gap-4 border-b border-slate-50 pb-4">
                 <div class="w-10 h-10 rounded-xl bg-[#063c31]/10 flex items-center justify-center text-[#063c31]">
                   <i :class="cat.icon"></i>
                 </div>
                 <div>
                   <h4 class="text-sm font-black uppercase tracking-widest text-slate-800">{{ cat.label }}</h4>
                   <p class="text-xs font-bold text-[#063c31] mt-0.5">{{ getCategorySummary(cat.id) }}</p>
                 </div>
               </div>

               <!-- Tooth Diagram for PDF -->
               <div v-if="caseData.detailedPlan[cat.id]?.selectedTeeth?.length > 0" class="py-4">
                  <TeethSelector :selected-teeth="caseData.detailedPlan[cat.id].selectedTeeth" readonly compact />
               </div>

               <!-- Category Notes -->
               <div v-if="caseData.detailedPlan[cat.id]?.notes" class="bg-slate-50 p-4 rounded-xl border-l-4 border-[#063c31]">
                 <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinical Notes</p>
                 <p class="text-xs text-slate-700 leading-relaxed italic">"{{ caseData.detailedPlan[cat.id].notes }}"</p>
               </div>
            </div>
          </div>
        </div>

        <!-- History -->
        <div v-if="caseData.history?.length" class="mt-12 break-inside-avoid">
          <h3 class="text-xl font-black text-[#063c31] border-b-2 border-slate-100 pb-2 mb-6">Case History</h3>
          <div class="space-y-4">
            <div v-for="h in caseData.history" :key="h.id" class="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-sm font-bold text-slate-700">{{ h.status }}</span>
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest">{{ formatDate(h.created_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-20 pt-8 border-t border-slate-100 text-center">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">© {{ new Date().getFullYear() }} Oralign Dental Technologies. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import TeethSelector from '~/components/cases/TeethSelector.vue'
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
const isGeneratingPDF = ref(false)

const showLightbox = ref(false)
const selectedImage = ref("")

const clinicalCategories = [
  { id: 'crowdingSpacing', label: 'Crowding / Spacing', icon: 'fas fa-arrows-alt-h' },
  { id: 'transverseDiscrepancy', label: 'Transverse', icon: 'fas fa-expand-alt' },
  { id: 'verticalDiscrepancy', label: 'Vertical', icon: 'fas fa-arrows-alt-v' },
  { id: 'apDiscrepancy', label: 'A-P Discrepancy', icon: 'fas fa-exchange-alt' },
  { id: 'elastics', label: 'Elastics', icon: 'fas fa-link' },
  { id: 'biteRamps', label: 'Bite Ramps', icon: 'fas fa-mountain' },
  { id: 'pontics', label: 'Pontics', icon: 'fas fa-fill-drip' },
  { id: 'attachments', label: 'Attachments', icon: 'fas fa-thumbtack' },
  { id: 'toothSizeDiscrepancy', label: 'Tooth size', icon: 'fas fa-ruler-combined' },
  { id: 'archExpansion', label: 'Arch expansion', icon: 'fas fa-compress-arrows-alt' },
  { id: 'extraction', label: 'Extraction', icon: 'fas fa-minus-circle' },
  { id: 'ipr', label: 'IPR', icon: 'fas fa-cut' },
  { id: 'eruptionSpace', label: 'Eruption Space', icon: 'fas fa-external-link-alt' },
  { id: 'movementRestrictions', label: 'Restrictions', icon: 'fas fa-ban' },
  { id: 'passiveAligner', label: 'Passive Aligner', icon: 'fas fa-check-double' },
  { id: 'overcorrection', label: 'Overcorrection', icon: 'fas fa-plus-circle' }
]

const isCategoryActive = (id) => {
  if (!caseData.value?.detailedPlan) return false
  const cat = caseData.value.detailedPlan[id]
  if (!cat) return false
  return Object.keys(cat).length > 0 && (cat.selectedTeeth?.length > 0 || cat.option || cat.group || cat.notes)
}

const getCategorySummary = (id) => {
  if (!caseData.value?.detailedPlan) return 'Not specified'
  const cat = caseData.value.detailedPlan[id]
  if (!isCategoryActive(id)) return 'Not specified'
  
  if (cat.selectedTeeth?.length > 0) return `${cat.selectedTeeth.length} Teeth selected`
  if (cat.option) return cat.option
  if (cat.group) return cat.group
  return 'Specified with notes'
}

const downloadPDF = async () => {
  isGeneratingPDF.value = true
  try {
    const html2pdf = (await import('html2pdf.js')).default
    const element = document.getElementById('pdf-content')
    const opt = {
      margin: 0,
      filename: `Oralign_Summary_${caseData.value.case.patient_name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }
    await html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error('PDF Generation Error:', error)
  } finally {
    isGeneratingPDF.value = false
  }
}

const getTeethForOption = (type) => {
  if (!caseData.value?.detailedPlan) return []
  
  const normalizedType = type?.toUpperCase().trim().replace(/\s+/g, ' ')
  
  const mapping = {
    'ATTACHMENTS': 'attachments',
    'PONTICS': 'pontics',
    'BITE RAMPS': 'biteRamps',
    'ELASTICS': 'elastics',
    'IPR': 'ipr',
    'EXTRACTION': 'extraction',
    'ARCH EXPANSION': 'archExpansion',
    'OVERCORRECTION': 'overcorrection',
    'TEETH MOVEMENT RESTRICTION': 'movementRestrictions',
    'ERUPTION SPACE': 'eruptionSpace',
    'PASSIVE ALIGNER': 'passiveAligner',
    'CROWDING/SPACING': 'crowdingSpacing',
    'VERTICAL DISCREPANCY': 'verticalDiscrepancy',
    'TRANSVERSE DISCREPANCY': 'transverseDiscrepancy',
    'A-P DISCREPANCY': 'apDiscrepancy',
    'TOOTH SIZE DISCREPANCY': 'toothSizeDiscrepancy'
  }
  
  const key = mapping[normalizedType]
  if (key && caseData.value.detailedPlan[key]) {
    return caseData.value.detailedPlan[key].selectedTeeth || []
  }
  
  return []
}

const filteredOptions = computed(() => {
  if (!caseData.value?.treatmentOptions) return []
  
  return caseData.value.treatmentOptions.filter(opt => {
    // Check if details contain actual data beyond headers
    const details = opt.treatmnet_option_details || ''
    const cleaned = details
      .replace(/Teeth:|Notes:|Type:|Option:|Before Step:|Perform before:|\s+/g, '')
      .replace(/\|/g, '')
      .trim()
    
    const hasTeeth = getTeethForOption(opt.treatmnet_option_type).length > 0
    
    return cleaned.length > 0 || hasTeeth
  })
})

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
    'UUID': c.uuid || ('#CASE-' + c.id),
    'Case Type': c.case_type,
    'Case Status': c.status,
    'Date of Birth': c.dob,
    'Gender': c.gender || 'Not specified',
    'Treatment Plan 1': (c.treatment_plan1_status && c.treatment_plan1_status !== 'N/A' && c.treatment_plan1_status !== 'مرفق ملف') ? c.treatment_plan1_status : '—',
    'Treatment Plan 2': (c.treatment_plan2_status && c.treatment_plan2_status !== 'N/A' && c.treatment_plan2_status !== 'مرفق ملف') ? c.treatment_plan2_status : '—',
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
  if (activeTab.value === 'plan1') return fixFileUrl(caseData.value.case.treatment_plan1)
  if (activeTab.value === 'plan2') return fixFileUrl(caseData.value.case.treatment_plan2)
  return null
})

const currentPlanStatus = computed(() => {
  if (activeTab.value === 'plan1') return caseData.value.case.treatment_plan1_status
  if (activeTab.value === 'plan2') return caseData.value.case.treatment_plan2_status
  return null
})

const viewImage = (img) => {
  selectedImage.value = fixFileUrl(img)
  showLightbox.value = true
}

const fixFileUrl = (url) => {
  if (!url) return url
  
  // If it's already a full URL, just clean it if needed
  if (url.startsWith('http')) {
    if (url.includes('test-api.oralign.co/uploads')) {
      return url.replace('test-api.oralign.co/uploads', 'test-api.oralign.co/public/uploads')
    }
    return url
  }
  
  const baseUrl = 'https://doctors.oralign.co/public/impressions'
  
  // If it's just a filename (no slashes)
  if (!url.includes('/')) {
    // PDF files are treatment plans
    if (url.toLowerCase().endsWith('.pdf')) {
      return `${baseUrl}/patient_cases/files/${url}`
    }
    // Otherwise assume it's an x-ray/photo
    return `${baseUrl}/xraysphotos/${url}`
  }
  
  return url
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

const formatTime = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
