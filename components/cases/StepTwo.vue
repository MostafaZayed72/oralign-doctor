<template>
  <div class="space-y-4 animate-in fade-in duration-700">
    <!-- Header -->
    <div class="border-b border-slate-100 dark:border-slate-800 pb-2">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-black text-[#063c31] dark:text-white flex items-center gap-2">
            <i class="fas fa-tooth text-[#063c31]"></i> Detailed Plan (optional)
          </h3>
          <p class="text-[9px] text-[#063c31]/50 dark:text-[#063c31]/40 mt-0.5 font-medium">Click on each category to specify clinical details and treatment goals.</p>
        </div>
        <div class="hidden md:block">
           <span class="px-3 py-1 rounded-full bg-brand-primary/5 text-[#063c31] text-[10px] font-bold uppercase tracking-widest border border-brand-primary/10">
             Step 5 of 6
           </span>
        </div>
      </div>
    </div>

    <!-- Content Wrapper -->
    <div class="flex flex-col xl:flex-row gap-4">
      <!-- Grid -->
      <div class="flex-1">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="openCategory(cat)"
            class="group relative p-2 rounded-[1.2rem] border-2 transition-all duration-300 text-center space-y-0.5 overflow-hidden flex flex-col items-center justify-center min-h-[85px] shadow-sm"
            :class="[
              formData.detailedPlan[cat.id] && Object.keys(formData.detailedPlan[cat.id]).length > 0
                ? 'bg-white dark:bg-slate-900 border-brand-primary ring-4 ring-brand-primary/5' 
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-brand-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
          >
            <!-- Background Accent -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" :class="cat.color || 'bg-brand-primary'"></div>
            
            <h4 class="text-xs sm:text-sm font-black tracking-wide text-[#063c31]/70 dark:text-slate-200 leading-tight group-hover:text-[#063c31] transition-colors z-10 inline-block first-letter:uppercase lowercase px-2">{{ cat.label }}</h4>
            
            <!-- Selection Marker -->
            <div v-if="formData.detailedPlan[cat.id] && Object.keys(formData.detailedPlan[cat.id]).length > 0" class="mt-1">
               <div class="px-2 py-0.5 rounded-full bg-brand-primary/10 text-[#063c31] text-[7px] font-black uppercase tracking-tighter">Selected</div>
            </div>

            <!-- Decorative card corner -->
            <div class="absolute -top-6 -right-6 w-12 h-12 rounded-full blur-xl transition-all duration-500 group-hover:scale-150" :class="cat.color || 'bg-brand-primary/20'"></div>
          </button>
        </div>
      </div>

      <!-- Additional Instructions -->
      <div class="w-full xl:w-64 shrink-0">
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] p-4 border border-slate-100 dark:border-slate-800 h-full flex flex-col">
          <label class="block text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300 mb-3 px-1 flex items-center gap-2">
            <i class="fas fa-edit text-[#063c31]"></i> Instructions
          </label>
          <textarea 
            :value="formData.additionalInstructions"
            @input="$emit('update', 'additionalInstructions', $event.target.value)"
            class="flex-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none shadow-sm min-h-[150px]"
            placeholder="Technical notes..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Detailed Treatment Plan Table (Summary) -->
    <div v-if="Object.keys(formData.detailedPlan).some(k => hasSelection(k))" class="mt-8 animate-in slide-in-from-bottom-5 duration-700">
      <div class="flex items-center gap-3 mb-4">
        <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
        <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-[#063c31]">Detailed treatment Plan</h4>
        <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
      </div>
      
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300 w-16">#</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300">Plan Option</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300">Details</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(cat, index) in categories" :key="cat.id">
              <tr v-if="hasSelection(cat.id)" class="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                <td class="px-6 py-4 text-xs font-bold text-[#063c31]/40">{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full" :class="cat.color"></div>
                    <span class="text-sm font-bold text-[#063c31]/70 dark:text-slate-200">{{ cat.label }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1.5">
                    <template v-for="(val, key) in formData.detailedPlan[cat.id]" :key="key">
                      <span v-if="Array.isArray(val) && val.length > 0" class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[9px] font-bold text-[#063c31]/50">
                        {{ key === 'selectedTeeth' ? val.length + ' Teeth' : val.join(', ') }}
                      </span>
                      <span v-else-if="val && typeof val === 'string' && key !== 'notes'" class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[9px] font-bold text-[#063c31]/50">
                        {{ val }}
                      </span>
                      <span v-else-if="val === true" class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[9px] font-bold text-[#063c31]/50">
                        {{ key }}
                      </span>
                    </template>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openCategory(cat)" class="text-[10px] font-black text-[#063c31] uppercase tracking-widest hover:underline">Edit</button>
                    <button @click="clearCategory(cat.id)" class="w-7 h-7 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                      <i class="fas fa-times text-[10px]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between items-center pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
      <button 
        @click="$emit('prev')"
        class="group px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest text-[#063c31]/50 hover:text-[#063c31] dark:hover:text-white flex items-center gap-2 transition-all"
      >
        <i class="fas fa-chevron-left transition-transform group-hover:-translate-x-1"></i>
        Previous
      </button>
      
      <button 
        @click="$emit('next')"
        class="group relative px-8 py-2 bg-[#063c31] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#063c31]/20 hover:scale-105 hover:shadow-[#063c31]/40 active:scale-95 transition-all duration-300 flex items-center gap-2 overflow-hidden"
      >
        <span>Next Step</span>
        <i class="fas fa-chevron-right transition-transform group-hover:translate-x-1"></i>
        <div class="absolute inset-0 w-1/2 h-full bg-white/10 -skew-x-[45deg] -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
      </button>
    </div>

    <!-- Category Modal -->
    <Transition name="modal">
      <div v-if="activeCategory" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="activeCategory = null"></div>
        <div class="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
           
           <div class="p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <!-- Modal Header -->
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h4 class="text-lg font-black text-[#063c31] flex items-center gap-2">
                  <i :class="activeCategory.icon"></i> {{ activeCategory.label }}
                </h4>
                <button @click="activeCategory = null" class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#063c31]/40 hover:text-[#063c31] dark:hover:text-white transition-colors">
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <!-- Modal Content -->
              <div class="space-y-4 py-2">
                <p class="text-xs text-[#063c31]/70 italic font-medium">Let us know how you would like to treat the {{ activeCategory.label.toLowerCase() }} in this case</p>
                
                <!-- 1. Crowding/Spacing -->
                <template v-if="activeCategory.id === 'crowdingSpacing'">
                  <div class="space-y-6">
                    <!-- Crowding -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Crowding Treatment options</h5>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label v-for="opt in crowdingOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-colors">
                          <input type="checkbox" :checked="isOptSelected('crowdingSpacing', 'crowding', opt)" @change="toggleOpt('crowdingSpacing', 'crowding', opt)" class="w-4 h-4 rounded border-slate-300 text-[#063c31] focus:ring-brand-primary" />
                          <span class="text-sm font-bold text-[#063c31] dark:text-slate-200 group-hover:text-[#063c31] dark:group-hover:text-white transition-colors">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <!-- Spacing -->
                    <div class="space-y-4 pt-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Spacing Treatment options</h5>
                      <div class="grid grid-cols-1 gap-3">
                        <label v-for="opt in spacingOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-colors">
                          <input type="checkbox" :checked="isOptSelected('crowdingSpacing', 'spacing', opt)" @change="toggleOpt('crowdingSpacing', 'spacing', opt)" class="w-4 h-4 rounded border-slate-300 text-[#063c31] focus:ring-brand-primary" />
                          <span class="text-sm font-bold text-[#063c31] dark:text-slate-200 group-hover:text-[#063c31] dark:group-hover:text-white transition-colors">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- 2. Transverse discrepancy -->
                <template v-else-if="activeCategory.id === 'transverseDiscrepancy'">
                  <div class="space-y-4">
                    <!-- Crossbite -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Crossbite Treatment options</h5>
                      <div class="space-y-2">
                        <label v-for="opt in crossbiteOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                          <input type="radio" :checked="formData.detailedPlan.transverseDiscrepancy?.crossbite === opt" @change="setSingleOpt('transverseDiscrepancy', 'crossbite', opt)" class="w-4 h-4 border-slate-300 text-[#063c31] focus:ring-brand-primary" name="crossbite" />
                          <span class="text-sm font-bold text-[#063c31] dark:text-slate-200 group-hover:text-[#063c31] dark:group-hover:text-white">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <!-- Scissor bite -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Scissor Treatment options</h5>
                      <div class="space-y-2">
                        <label v-for="opt in scissorOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                          <input type="radio" :checked="formData.detailedPlan.transverseDiscrepancy?.scissor === opt" @change="setSingleOpt('transverseDiscrepancy', 'scissor', opt)" class="w-4 h-4 border-slate-300 text-[#063c31] focus:ring-brand-primary" name="scissor" />
                          <span class="text-sm font-bold text-[#063c31] dark:text-slate-200 group-hover:text-[#063c31] dark:group-hover:text-white">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <!-- Midline -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Upper Midline</h5>
                      <div class="flex gap-4">
                        <label v-for="opt in midlineOpts" :key="opt" class="flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all" :class="formData.detailedPlan.transverseDiscrepancy?.midline === opt ? 'border-brand-primary bg-brand-primary/5 text-[#063c31]' : 'border-slate-100 dark:border-slate-800 text-[#063c31]/80'" @click="setSingleOpt('transverseDiscrepancy', 'midline', opt)">
                          <span class="text-xs font-black text-[#063c31] dark:text-slate-200">{{ opt }}</span>
                        </label>
                      </div>
                      <label class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                        <input type="checkbox" :checked="formData.detailedPlan.transverseDiscrepancy?.acceptMidline" @change="setSingleOpt('transverseDiscrepancy', 'acceptMidline', $event.target.checked)" class="w-4 h-4 rounded border-slate-300 text-[#063c31] focus:ring-brand-primary" />
                        <span class="text-sm font-bold text-[#063c31] dark:text-slate-200 group-hover:text-[#063c31] dark:group-hover:text-white">Accept resulting midline</span>
                      </label>
                    </div>
                  </div>
                </template>

                <!-- 3. Vertical discrepancy -->
                <template v-else-if="activeCategory.id === 'verticalDiscrepancy'">
                  <div class="space-y-4">
                    <!-- Openbite -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Openbite Treatment options</h5>
                      <div class="space-y-2">
                        <label v-for="opt in openbiteOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                          <input type="radio" :checked="formData.detailedPlan.verticalDiscrepancy?.openbite === opt" @change="setSingleOpt('verticalDiscrepancy', 'openbite', opt)" class="w-4 h-4 border-slate-300 text-[#063c31] focus:ring-brand-primary" name="openbite" />
                          <span class="text-sm font-bold text-[#063c31] dark:text-slate-200 group-hover:text-[#063c31] dark:group-hover:text-white">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <!-- Deepbite -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Deepbite Treatment options</h5>
                      <div class="grid grid-cols-1 gap-3">
                        <label v-for="opt in deepbiteOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                          <input type="checkbox" :checked="isOptSelected('verticalDiscrepancy', 'deepbite', opt)" @change="toggleOpt('verticalDiscrepancy', 'deepbite', opt)" class="w-4 h-4 rounded border-slate-300 text-[#063c31] focus:ring-brand-primary" />
                          <span class="text-sm font-bold text-[#063c31] dark:text-slate-200 group-hover:text-[#063c31] dark:group-hover:text-white">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- 4. A-P discrepancy -->
                <template v-else-if="activeCategory.id === 'apDiscrepancy'">
                  <div class="space-y-4">
                    <!-- Class II -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Class II Treatment options</h5>
                      <div class="grid grid-cols-1 gap-3">
                        <label v-for="opt in classIIOpts" :key="opt" class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-colors">
                          <input type="checkbox" :checked="isOptSelected('apDiscrepancy', 'classII', opt)" @change="toggleOpt('apDiscrepancy', 'classII', opt)" class="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#063c31] focus:ring-brand-primary" />
                          <span class="text-sm font-bold text-[#063c31] dark:text-slate-200 group-hover:text-[#063c31] dark:group-hover:text-white transition-colors leading-relaxed">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <!-- Class III -->
                    <div class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Class III Treatment options</h5>
                      <div class="grid grid-cols-1 gap-3">
                        <label v-for="opt in classIIIOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                          <input type="checkbox" :checked="isOptSelected('apDiscrepancy', 'classIII', opt)" @change="toggleOpt('apDiscrepancy', 'classIII', opt)" class="w-4 h-4 rounded border-slate-300 text-[#063c31] focus:ring-brand-primary" />
                          <span class="text-sm font-bold text-[#063c31] dark:text-slate-200 group-hover:text-[#063c31] dark:group-hover:text-white">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- 5. Elastics -->
                <template v-else-if="activeCategory.id === 'elastics'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Select the teeth requiring buttons and precision cuts placement (cutouts)</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.elastics?.selectedTeeth || []" :compact="true" @toggle="(tooth) => toggleTooth('elastics', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300">Do you have any notes regarding the elastics?</label>
                      <textarea :value="formData.detailedPlan.elastics?.notes" @input="setSingleOpt('elastics', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 6. Bite Ramps -->
                <template v-else-if="activeCategory.id === 'biteRamps'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Select the teeth group on which you want to place bite ramps</h5>
                      <div class="flex gap-4 mb-6">
                        <label v-for="grp in biteRampGroups" :key="grp" class="flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all" :class="formData.detailedPlan.biteRamps?.group === grp ? 'border-brand-primary bg-brand-primary/5 text-[#063c31]' : 'border-slate-100 dark:border-slate-800 text-[#063c31]/80'" @click="setBiteRampGroup(grp)">
                          <span class="text-xs font-bold">{{ grp }}</span>
                        </label>
                      </div>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.biteRamps?.selectedTeeth || []" :compact="true" @toggle="(tooth) => toggleTooth('biteRamps', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300">Do you have any notes regarding the Bite ramps?</label>
                      <textarea :value="formData.detailedPlan.biteRamps?.notes" @input="setSingleOpt('biteRamps', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 7. Pontics -->
                <template v-else-if="activeCategory.id === 'pontics'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Select the teeth requiring pontic placement</h5>
                      <p class="text-[10px] text-[#063c31]/60 italic">The pontics will be painted based on the patients teeth color (painting of pontics will only be applied to the anterior 8 teeth)</p>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.pontics?.selectedTeeth || []" :compact="true" @toggle="(tooth) => toggleTooth('pontics', tooth)" />
                    </div>
                  </div>
                </template>

                <!-- 8. Attachments -->
                <template v-else-if="activeCategory.id === 'attachments'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Select the teeth where you dont want to place attachments</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.attachments?.selectedTeeth || []" :compact="true" @toggle="(tooth) => toggleTooth('attachments', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300">Perform attachments before</label>
                      <input :value="formData.detailedPlan.attachments?.beforeStep" @input="setSingleOpt('attachments', 'beforeStep', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Write Step Numbers Separated by..." />
                    </div>
                  </div>
                </template>

                <!-- 9. Tooth size Discrepancy -->
                <template v-else-if="activeCategory.id === 'toothSizeDiscrepancy'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Increasing the arch width between</h5>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label v-for="opt in toothSizeOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all" :class="formData.detailedPlan.toothSizeDiscrepancy?.option === opt ? 'border-brand-primary bg-brand-primary/5 text-[#063c31]' : 'border-slate-100 dark:border-slate-800 text-[#063c31]/80'" @click="setSingleOpt('toothSizeDiscrepancy', 'option', opt)">
                          <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="formData.detailedPlan.toothSizeDiscrepancy?.option === opt ? 'border-brand-primary' : 'border-slate-300'">
                            <div v-if="formData.detailedPlan.toothSizeDiscrepancy?.option === opt" class="w-2 h-2 rounded-full bg-brand-primary"></div>
                          </div>
                          <span class="text-xs font-black text-[#063c31] dark:text-slate-200">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300">Do you have any notes regarding the Tooth Size Discrepancy?</label>
                      <textarea :value="formData.detailedPlan.toothSizeDiscrepancy?.notes" @input="setSingleOpt('toothSizeDiscrepancy', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 10. Arch expansion -->
                <template v-else-if="activeCategory.id === 'archExpansion'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Increasing the arch width between</h5>
                      <div class="flex flex-wrap gap-4 mb-6">
                        <label v-for="grp in archExpansionGroups" :key="grp" class="flex-1 min-w-[200px] flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all" :class="formData.detailedPlan.archExpansion?.group === grp ? 'border-brand-primary bg-brand-primary/5 text-[#063c31]' : 'border-slate-100 dark:border-slate-800 text-[#063c31]/80'" @click="setArchExpansionGroup(grp)">
                          <span class="text-xs font-bold">{{ grp }}</span>
                        </label>
                      </div>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.archExpansion?.selectedTeeth || []" :compact="true" @toggle="(tooth) => toggleTooth('archExpansion', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300">Do you have any notes regarding the Arch Expansion?</label>
                      <textarea :value="formData.detailedPlan.archExpansion?.notes" @input="setSingleOpt('archExpansion', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 11. Extraction -->
                <template v-else-if="activeCategory.id === 'extraction'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31]">Select the teeth that need to be extracted</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.extraction?.selectedTeeth || []" :compact="true" @toggle="(tooth) => toggleTooth('extraction', tooth)" />
                    </div>
                  </div>
                </template>

                <!-- 12. Interproximal reduction -->
                <template v-else-if="activeCategory.id === 'ipr'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <p class="text-xs text-[#063c31]/80 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        IPR creates space for better teeth alignment or helps reshape the contact area between neighboring teeth. Our technicians will add IPR based on what is best for the treatment, however you can add your input and choose the teeth you do not want IPR to be added and we can accommodate.
                      </p>
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31] mt-2">Select the teeth you dont want IPR on</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.ipr?.selectedTeeth || []" :compact="true" @toggle="(tooth) => toggleTooth('ipr', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-[#063c31]/60" dir="ltr">Do you have any notes regarding the Interproximal reduction?</label>
                      <textarea :value="formData.detailedPlan.ipr?.notes" @input="setSingleOpt('ipr', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 13. Eruption Space -->
                <template v-else-if="activeCategory.id === 'eruptionSpace'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <p class="text-xs text-[#063c31]/80 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        Eruption space will provide enough clearance between the aligner and the erupting canines, and/or premolars to accommodate their eruption path throughout the aligner's treatment.
                      </p>
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31] mt-2">Select eruption spaces for this case</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.eruptionSpace?.selectedTeeth || []" :compact="true" @toggle="(tooth) => toggleTooth('eruptionSpace', tooth)" />
                    </div>
                  </div>
                </template>

                <!-- 14. Teeth Movement Restrictions -->
                <template v-else-if="activeCategory.id === 'movementRestrictions'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <p class="text-xs text-[#063c31]/80 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        Some teeth cannot be moved by aligners, like implants and bridges, please indicate those teeth below.
                      </p>
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31] mt-2">Restrict the teeth that cant be moved</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.movementRestrictions?.selectedTeeth || []" :compact="true" @toggle="(tooth) => toggleTooth('movementRestrictions', tooth)" />
                    </div>
                  </div>
                </template>

                <!-- 15. Passive Aligner -->
                <template v-else-if="activeCategory.id === 'passiveAligner'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <p class="text-xs text-[#063c31]/80 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        Use passive aligners to maintain teeth position in one arch while the teeth in the opposing arch are still under treatment.
                      </p>
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31] mt-2">Passive Aligners Options (Add passive aligners)</h5>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label v-for="opt in passiveAlignerOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all" :class="formData.detailedPlan.passiveAligner?.option === opt ? 'border-brand-primary bg-brand-primary/5 text-[#063c31]' : 'border-slate-100 dark:border-slate-800 text-[#063c31]/80'" @click="setSingleOpt('passiveAligner', 'option', opt)">
                          <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="formData.detailedPlan.passiveAligner?.option === opt ? 'border-brand-primary' : 'border-slate-300'">
                            <div v-if="formData.detailedPlan.passiveAligner?.option === opt" class="w-2 h-2 rounded-full bg-brand-primary"></div>
                          </div>
                          <span class="text-xs font-black text-[#063c31] dark:text-slate-200">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300" dir="ltr">Do you have any notes regarding the Passive aligners?</label>
                      <textarea :value="formData.detailedPlan.passiveAligner?.notes" @input="setSingleOpt('passiveAligner', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 16. Overcorrection -->
                <template v-else-if="activeCategory.id === 'overcorrection'">
                  <div class="space-y-4">
                    <div class="space-y-4">
                      <p class="text-xs text-[#063c31] dark:text-slate-200 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        Use overcorrection to plan movements beyond the ideal teeth positions to compensate for a lag in tracking.
                      </p>
                      <h5 class="text-xs font-black uppercase tracking-widest text-[#063c31] mt-2">Select the tooth areas requiring overcorrection</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.overcorrection?.selectedTeeth || []" :compact="true" @toggle="(tooth) => toggleTooth('overcorrection', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-[#063c31]/70 dark:text-slate-300" dir="ltr">Do you have any notes regarding the overcorrection?</label>
                      <textarea :value="formData.detailedPlan.overcorrection?.notes" @input="setSingleOpt('overcorrection', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <div v-else class="min-h-[200px] flex items-center justify-center text-[#063c31]/60 italic">
                  Waiting for options for {{ activeCategory.label }}...
                </div>
              </div>

              <!-- Selected Options Summary -->
              <div v-if="hasSelection(activeCategory.id)" class="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h5 class="text-[10px] font-black uppercase tracking-widest text-[#063c31]/60 mb-3 px-1">Selected Options:</h5>
                <div class="flex flex-wrap gap-2">
                  <template v-for="(val, key) in formData.detailedPlan[activeCategory.id]" :key="key">
                    <template v-if="Array.isArray(val)">
                      <div v-for="item in val" :key="item" class="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/5 border border-brand-primary/10 rounded-full group/item">
                        <span class="text-[10px] font-bold text-[#063c31]">{{ key === 'selectedTeeth' ? 'Tooth ' + item : item }}</span>
                        <button @click="key === 'selectedTeeth' ? toggleTooth(activeCategory.id, item) : toggleOpt(activeCategory.id, key, item)" class="text-[#063c31]/40 hover:text-red-500 transition-colors">
                          <i class="fas fa-times text-[10px]"></i>
                        </button>
                      </div>
                    </template>
                    <template v-else-if="val && typeof val === 'string' && val !== '' && key !== 'notes'">
                      <div class="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/5 border border-brand-primary/10 rounded-full group/item">
                        <span class="text-[10px] font-bold text-[#063c31]">{{ val }}</span>
                        <button @click="setSingleOpt(activeCategory.id, key, null)" class="text-[#063c31]/40 hover:text-red-500 transition-colors">
                          <i class="fas fa-times text-[10px]"></i>
                        </button>
                      </div>
                    </template>
                    <template v-else-if="typeof val === 'boolean' && val === true">
                       <div class="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/5 border border-brand-primary/10 rounded-full group/item">
                        <span class="text-[10px] font-bold text-[#063c31]">{{ key }}</span>
                        <button @click="setSingleOpt(activeCategory.id, key, false)" class="text-[#063c31]/40 hover:text-red-500 transition-colors">
                          <i class="fas fa-times text-[10px]"></i>
                        </button>
                      </div>
                    </template>
                  </template>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 z-10">
                <button @click="activeCategory = null" class="px-6 py-3 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button @click="activeCategory = null" class="px-10 py-3 bg-[#063c31] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#063c31]/20 hover:scale-105 active:scale-95 transition-all">Save Details</button>
              </div>
           </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TeethSelector from './TeethSelector.vue'

const props = defineProps({
  formData: { type: Object, required: true }
})
const emit = defineEmits(['update', 'next', 'prev'])

const activeCategory = ref<any>(null)

const crowdingOpts = ['Resolve with Proclination', 'Resolve with Expansion', 'Resolve with IPR', 'Resolve with Distallisation']
const spacingOpts = ['Close all spaces', 'Partially close and follow with restorative or prosthodontic treatment', 'IPR in opposing arch']
const crossbiteOpts = ['Expansion of the upper arch', 'Constriction of the lower arch (may require IPR)', 'Combination of upper expansion and lower constriction (may require IPR)']
const scissorOpts = ['Constriction of the upper arch (may require IPR)', 'Expansion of the lower arch', 'Combination of both (may require IPR)']
const midlineOpts = ['Centered', 'Shifted Left', 'Shifted Right']
const openbiteOpts = ['Extrude anterior teeth only', 'Intrude posterior teeth only', 'Both']
const deepbiteOpts = ['Intrude upper anteriors (may require IPR)', 'Intrude lower anteriors (may require IPR)', 'Combination of upper and lower anteriors intrusion', 'Extrude posteriors']
const classIIOpts = ['Extraction of two upper bicuspids', 'Extraction of upper and lower bicuspids', 'Upper arch distalization', 'Lower arch mesialization', 'Leaving the molars in Class II and Performing posterior reproximation (IPR distal of canine to molar) as needed to improve the canine relationship', 'Maintain Class II with esthetic anterior alignment only']
const classIIIOpts = ['Advance uppers with aligners', 'Retract lowers with extraction']
const toothSizeOpts = ['Other', 'Apply IPR in the opposing arch', 'Leave space distal to the laterals', 'Leave space around the laterals']
const archExpansionGroups = ['Premolars And Molars Only', 'Canines and premolars only', 'Canines, Premolars And Molars only']
const passiveAlignerOpts = ['At The End Of The Treatment', 'At The Beginning Of The Treatment']

const biteRampGroups = ['Canines Only', 'Incisors and canines', 'Incisors Only']

const isOptSelected = (catId: string, subCatId: string, opt: string) => {
  const cat = props.formData.detailedPlan[catId]
  if (!cat || !cat[subCatId]) return false
  return Array.isArray(cat[subCatId]) ? cat[subCatId].includes(opt) : cat[subCatId] === opt
}

const toggleOpt = (catId: string, subCatId: string, opt: string) => {
  const plan = { ...props.formData.detailedPlan }
  if (!plan[catId]) plan[catId] = {}
  if (!plan[catId][subCatId]) plan[catId][subCatId] = []
  
  const index = plan[catId][subCatId].indexOf(opt)
  if (index > -1) {
    plan[catId][subCatId].splice(index, 1)
  } else {
    plan[catId][subCatId].push(opt)
  }
  emit('update', 'detailedPlan', plan)
}

const toggleTooth = (catId: string, tooth: number) => {
  const plan = { ...props.formData.detailedPlan }
  if (!plan[catId]) plan[catId] = {}
  if (!plan[catId].selectedTeeth) plan[catId].selectedTeeth = []
  
  const index = plan[catId].selectedTeeth.indexOf(tooth)
  if (index > -1) {
    plan[catId].selectedTeeth.splice(index, 1)
  } else {
    plan[catId].selectedTeeth.push(tooth)
  }
  emit('update', 'detailedPlan', plan)
}

const setBiteRampGroup = (group: string) => {
  const plan = { ...props.formData.detailedPlan }
  let selected: number[] = []
  
  if (group === 'Canines Only') selected = [13, 23, 33, 43]
  else if (group === 'Incisors and canines') selected = [13, 12, 11, 21, 22, 23, 33, 32, 31, 41, 42, 43]
  else if (group === 'Incisors Only') selected = [12, 11, 21, 22, 32, 31, 41, 42]
  
  // Update biteRamps
  if (!plan.biteRamps) plan.biteRamps = {}
  plan.biteRamps.group = group
  plan.biteRamps.selectedTeeth = selected

  // Propagate to others
  const categoriesToSync = ['elastics', 'pontics', 'attachments', 'archExpansion', 'extraction', 'ipr', 'overcorrection', 'movementRestrictions', 'eruptionSpace']
  categoriesToSync.forEach(cat => {
    if (!plan[cat]) plan[cat] = {}
    plan[cat].selectedTeeth = [...selected]
  })
  
  emit('update', 'detailedPlan', plan)
}

const setArchExpansionGroup = (group: string) => {
  const plan = { ...props.formData.detailedPlan }
  let selected: number[] = []
  
  if (group === 'Premolars And Molars Only') selected = [14, 15, 16, 17, 24, 25, 26, 27, 34, 35, 36, 37, 44, 45, 46, 47]
  else if (group === 'Canines and premolars only') selected = [13, 14, 15, 23, 24, 25, 33, 34, 35, 43, 44, 45]
  else if (group === 'Canines, Premolars And Molars only') selected = [13, 14, 15, 16, 17, 23, 24, 25, 26, 27, 33, 34, 35, 36, 37, 43, 44, 45, 46, 47]
  
  // Update archExpansion
  if (!plan.archExpansion) plan.archExpansion = {}
  plan.archExpansion.group = group
  plan.archExpansion.selectedTeeth = selected

  // Propagate to others
  const categoriesToSync = ['elastics', 'biteRamps', 'pontics', 'attachments', 'extraction', 'ipr', 'overcorrection', 'movementRestrictions', 'eruptionSpace']
  categoriesToSync.forEach(cat => {
    if (!plan[cat]) plan[cat] = {}
    plan[cat].selectedTeeth = [...selected]
  })
  
  emit('update', 'detailedPlan', plan)
}

const setSingleOpt = (catId: string, subCatId: string, value: any) => {
  const plan = { ...props.formData.detailedPlan }
  if (!plan[catId]) plan[catId] = {}
  plan[catId][subCatId] = value
  emit('update', 'detailedPlan', plan)
}

const openCategory = (cat: any) => {
  activeCategory.value = cat
}

const hasSelection = (catId: string) => {
  const data = props.formData.detailedPlan[catId]
  if (!data) return false
  return Object.values(data).some(val => {
    if (Array.isArray(val)) return val.length > 0
    if (typeof val === 'boolean') return val === true
    return !!val
  })
}

const clearCategory = (catId: string) => {
  const plan = { ...props.formData.detailedPlan }
  delete plan[catId]
  emit('update', 'detailedPlan', plan)
}

const categories = [
  { id: 'apDiscrepancy', label: 'A-P discrepancy', color: 'bg-blue-500' },
  { id: 'verticalDiscrepancy', label: 'Vertical discrepancy', color: 'bg-emerald-500' },
  { id: 'transverseDiscrepancy', label: 'Transverse discrepancy', color: 'bg-amber-500' },
  { id: 'crowdingSpacing', label: 'Crowding/spacing', color: 'bg-rose-500' },
  { id: 'elastics', label: 'Elastics', color: 'bg-indigo-500' },
  { id: 'biteRamps', label: 'Bite Ramps', color: 'bg-orange-500' },
  { id: 'pontics', label: 'Pontics', color: 'bg-cyan-500' },
  { id: 'attachments', label: 'Attachments', color: 'bg-purple-500' },
  { id: 'toothSizeDiscrepancy', label: 'Tooth size Discrepancy', color: 'bg-pink-500' },
  { id: 'archExpansion', label: 'Arch expansion', color: 'bg-sky-500' },
  { id: 'extraction', label: 'Extraction', color: 'bg-red-500' },
  { id: 'ipr', label: 'Interproximal reduction', color: 'bg-lime-500' },
  { id: 'eruptionSpace', label: 'Eruption Space', color: 'bg-teal-500' },
  { id: 'movementRestrictions', label: 'Teeth Movement Restrictions', color: 'bg-slate-500' },
  { id: 'passiveAligner', label: 'Passive Aligner', color: 'bg-violet-500' },
  { id: 'overcorrection', label: 'Overcorrection', color: 'bg-fuchsia-500' }
]

</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
