<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Header -->
    <div class="border-b border-slate-100 dark:border-slate-800 pb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <i class="fas fa-tooth text-brand-primary"></i> Detailed Plan (optional)
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Click on each category to specify clinical details and treatment goals.</p>
        </div>
        <div class="hidden md:block">
           <span class="px-4 py-2 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest border border-brand-primary/10">
             Step 5 of 6
           </span>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="openCategory(cat)"
        class="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 hover:border-brand-primary hover:scale-[1.02] active:scale-95 transition-all duration-300 text-center space-y-3 overflow-hidden"
      >
        <div class="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto group-hover:bg-brand-primary/10 transition-colors">
          <i :class="cat.icon" class="text-xl text-slate-400 group-hover:text-brand-primary transition-colors"></i>
        </div>
        <h4 class="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight group-hover:text-brand-primary transition-colors">{{ cat.label }}</h4>
        
        <!-- Status Indicator -->
        <div v-if="formData.detailedPlan[cat.id]" class="absolute top-3 right-3">
           <div class="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
        </div>

        <!-- Decorative element -->
        <div class="absolute -bottom-4 -right-4 w-12 h-12 bg-brand-primary/5 rounded-full blur-xl group-hover:bg-brand-primary/20 transition-all"></div>
      </button>
    </div>

    <!-- Additional Instructions -->
    <div class="pt-8">
      <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Additional Instructions</label>
      <textarea 
        :value="formData.additionalInstructions"
        @input="$emit('update', 'additionalInstructions', $event.target.value)"
        rows="4"
        class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[2rem] px-8 py-6 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none shadow-inner"
        placeholder="Any other specific instructions for the dental technicians..."
      ></textarea>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between items-center pt-10 mt-10 border-t border-slate-100 dark:border-slate-800">
      <button 
        @click="$emit('prev')"
        class="group px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-all"
      >
        <i class="fas fa-chevron-left transition-transform group-hover:-translate-x-1"></i>
        Previous
      </button>
      
      <button 
        @click="$emit('next')"
        class="group relative px-10 py-4 bg-[#063c31] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#063c31]/20 hover:scale-105 hover:shadow-[#063c31]/40 active:scale-95 transition-all duration-300 flex items-center gap-3 overflow-hidden"
      >
        <span>Next Step</span>
        <i class="fas fa-chevron-right transition-transform group-hover:translate-x-1"></i>
        <div class="absolute inset-0 w-1/2 h-full bg-white/10 -skew-x-[45deg] -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
      </button>
    </div>

    <!-- Category Modal -->
    <Transition name="modal">
      <div v-if="activeCategory" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="activeCategory = null"></div>
        <div class="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
           
           <div class="p-8 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <!-- Modal Header -->
              <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h4 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <i :class="activeCategory.icon" class="text-brand-primary"></i> {{ activeCategory.label }}
                </h4>
                <button @click="activeCategory = null" class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <!-- Modal Content -->
              <div class="space-y-8 py-4">
                <p class="text-sm text-slate-500 italic">Let us know how you would like to treat the {{ activeCategory.label.toLowerCase() }} in this case</p>
                
                <!-- 1. Crowding/Spacing -->
                <template v-if="activeCategory.id === 'crowdingSpacing'">
                  <div class="space-y-6">
                    <!-- Crowding -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Crowding Treatment options</h5>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label v-for="opt in crowdingOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-colors">
                          <input type="checkbox" :checked="isOptSelected('crowdingSpacing', 'crowding', opt)" @change="toggleOpt('crowdingSpacing', 'crowding', opt)" class="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                          <span class="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <!-- Spacing -->
                    <div class="space-y-4 pt-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Spacing Treatment options</h5>
                      <div class="grid grid-cols-1 gap-3">
                        <label v-for="opt in spacingOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-colors">
                          <input type="checkbox" :checked="isOptSelected('crowdingSpacing', 'spacing', opt)" @change="toggleOpt('crowdingSpacing', 'spacing', opt)" class="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                          <span class="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- 2. Transverse discrepancy -->
                <template v-else-if="activeCategory.id === 'transverseDiscrepancy'">
                  <div class="space-y-8">
                    <!-- Crossbite -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Crossbite Treatment options</h5>
                      <div class="space-y-2">
                        <label v-for="opt in crossbiteOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                          <input type="radio" :checked="formData.detailedPlan.transverseDiscrepancy?.crossbite === opt" @change="setSingleOpt('transverseDiscrepancy', 'crossbite', opt)" class="w-4 h-4 border-slate-300 text-brand-primary focus:ring-brand-primary" name="crossbite" />
                          <span class="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <!-- Scissor bite -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Scissor Treatment options</h5>
                      <div class="space-y-2">
                        <label v-for="opt in scissorOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                          <input type="radio" :checked="formData.detailedPlan.transverseDiscrepancy?.scissor === opt" @change="setSingleOpt('transverseDiscrepancy', 'scissor', opt)" class="w-4 h-4 border-slate-300 text-brand-primary focus:ring-brand-primary" name="scissor" />
                          <span class="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <!-- Midline -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Upper Midline</h5>
                      <div class="flex gap-4">
                        <label v-for="opt in midlineOpts" :key="opt" class="flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all" :class="formData.detailedPlan.transverseDiscrepancy?.midline === opt ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-slate-100 dark:border-slate-800 text-slate-500'" @click="setSingleOpt('transverseDiscrepancy', 'midline', opt)">
                          <span class="text-xs font-bold">{{ opt }}</span>
                        </label>
                      </div>
                      <label class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                        <input type="checkbox" :checked="formData.detailedPlan.transverseDiscrepancy?.acceptMidline" @change="setSingleOpt('transverseDiscrepancy', 'acceptMidline', $event.target.checked)" class="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                        <span class="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Accept resulting midline</span>
                      </label>
                    </div>
                  </div>
                </template>

                <!-- 3. Vertical discrepancy -->
                <template v-else-if="activeCategory.id === 'verticalDiscrepancy'">
                  <div class="space-y-8">
                    <!-- Openbite -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Openbite Treatment options</h5>
                      <div class="space-y-2">
                        <label v-for="opt in openbiteOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                          <input type="radio" :checked="formData.detailedPlan.verticalDiscrepancy?.openbite === opt" @change="setSingleOpt('verticalDiscrepancy', 'openbite', opt)" class="w-4 h-4 border-slate-300 text-brand-primary focus:ring-brand-primary" name="openbite" />
                          <span class="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <!-- Deepbite -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Deepbite Treatment options</h5>
                      <div class="grid grid-cols-1 gap-3">
                        <label v-for="opt in deepbiteOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                          <input type="checkbox" :checked="isOptSelected('verticalDiscrepancy', 'deepbite', opt)" @change="toggleOpt('verticalDiscrepancy', 'deepbite', opt)" class="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                          <span class="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- 4. A-P discrepancy -->
                <template v-else-if="activeCategory.id === 'apDiscrepancy'">
                  <div class="space-y-8">
                    <!-- Class II -->
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Class II Treatment options</h5>
                      <div class="grid grid-cols-1 gap-3">
                        <label v-for="opt in classIIOpts" :key="opt" class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-colors">
                          <input type="checkbox" :checked="isOptSelected('apDiscrepancy', 'classII', opt)" @change="toggleOpt('apDiscrepancy', 'classII', opt)" class="w-4 h-4 mt-0.5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                          <span class="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-relaxed">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <!-- Class III -->
                    <div class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Class III Treatment options</h5>
                      <div class="grid grid-cols-1 gap-3">
                        <label v-for="opt in classIIIOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group">
                          <input type="checkbox" :checked="isOptSelected('apDiscrepancy', 'classIII', opt)" @change="toggleOpt('apDiscrepancy', 'classIII', opt)" class="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                          <span class="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- 5. Elastics -->
                <template v-else-if="activeCategory.id === 'elastics'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Select the teeth requiring buttons and precision cuts placement (cutouts)</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.elastics?.selectedTeeth || []" @toggle="(tooth) => toggleTooth('elastics', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">? Do you have any notes regarding the elastics</label>
                      <textarea :value="formData.detailedPlan.elastics?.notes" @input="setSingleOpt('elastics', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 6. Bite Ramps -->
                <template v-else-if="activeCategory.id === 'biteRamps'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Select the teeth group on which you want to place bite ramps</h5>
                      <div class="flex gap-4 mb-6">
                        <label v-for="grp in biteRampGroups" :key="grp" class="flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all" :class="formData.detailedPlan.biteRamps?.group === grp ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-slate-100 dark:border-slate-800 text-slate-500'" @click="setBiteRampGroup(grp)">
                          <span class="text-xs font-bold">{{ grp }}</span>
                        </label>
                      </div>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.biteRamps?.selectedTeeth || []" @toggle="(tooth) => toggleTooth('biteRamps', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">? Do you have any notes regarding the Bite ramps</label>
                      <textarea :value="formData.detailedPlan.biteRamps?.notes" @input="setSingleOpt('biteRamps', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 7. Pontics -->
                <template v-else-if="activeCategory.id === 'pontics'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Select the teeth requiring pontic placement</h5>
                      <p class="text-[10px] text-slate-400 italic">The pontics will be painted based on the patients teeth color (painting of pontics will only be applied to the anterior 8 teeth)</p>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.pontics?.selectedTeeth || []" @toggle="(tooth) => toggleTooth('pontics', tooth)" />
                    </div>
                  </div>
                </template>

                <!-- 8. Attachments -->
                <template v-else-if="activeCategory.id === 'attachments'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Select the teeth where you dont want to place attachments</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.attachments?.selectedTeeth || []" @toggle="(tooth) => toggleTooth('attachments', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Perform attachments before</label>
                      <input :value="formData.detailedPlan.attachments?.beforeStep" @input="setSingleOpt('attachments', 'beforeStep', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Write Step Numbers Separated by..." />
                    </div>
                  </div>
                </template>

                <!-- 9. Tooth size Discrepancy -->
                <template v-else-if="activeCategory.id === 'toothSizeDiscrepancy'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Increasing the arch width between</h5>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label v-for="opt in toothSizeOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all" :class="formData.detailedPlan.toothSizeDiscrepancy?.option === opt ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-slate-100 dark:border-slate-800 text-slate-500'" @click="setSingleOpt('toothSizeDiscrepancy', 'option', opt)">
                          <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="formData.detailedPlan.toothSizeDiscrepancy?.option === opt ? 'border-brand-primary' : 'border-slate-300'">
                            <div v-if="formData.detailedPlan.toothSizeDiscrepancy?.option === opt" class="w-2 h-2 rounded-full bg-brand-primary"></div>
                          </div>
                          <span class="text-xs font-bold">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">? Do you have any notes regarding the Tooth Size Discrepancy</label>
                      <textarea :value="formData.detailedPlan.toothSizeDiscrepancy?.notes" @input="setSingleOpt('toothSizeDiscrepancy', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 10. Arch expansion -->
                <template v-else-if="activeCategory.id === 'archExpansion'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Increasing the arch width between</h5>
                      <div class="flex flex-wrap gap-4 mb-6">
                        <label v-for="grp in archExpansionGroups" :key="grp" class="flex-1 min-w-[200px] flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all" :class="formData.detailedPlan.archExpansion?.group === grp ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-slate-100 dark:border-slate-800 text-slate-500'" @click="setArchExpansionGroup(grp)">
                          <span class="text-xs font-bold">{{ grp }}</span>
                        </label>
                      </div>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.archExpansion?.selectedTeeth || []" @toggle="(tooth) => toggleTooth('archExpansion', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">? Do you have any notes regarding the Arch Expansion</label>
                      <textarea :value="formData.detailedPlan.archExpansion?.notes" @input="setSingleOpt('archExpansion', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 11. Extraction -->
                <template v-else-if="activeCategory.id === 'extraction'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary">Select the teeth that need to be extracted</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.extraction?.selectedTeeth || []" @toggle="(tooth) => toggleTooth('extraction', tooth)" />
                    </div>
                  </div>
                </template>

                <!-- 12. Interproximal reduction -->
                <template v-else-if="activeCategory.id === 'ipr'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <p class="text-xs text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        IPR creates space for better teeth alignment or helps reshape the contact area between neighboring teeth. Our technicians will add IPR based on what is best for the treatment, however you can add your input and choose the teeth you do not want IPR to be added and we can accommodate.
                      </p>
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary mt-6">Select the teeth you dont want IPR on</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.ipr?.selectedTeeth || []" @toggle="(tooth) => toggleTooth('ipr', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">? Do you have any notes regarding the Interproximal reduction</label>
                      <textarea :value="formData.detailedPlan.ipr?.notes" @input="setSingleOpt('ipr', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 13. Eruption Space -->
                <template v-else-if="activeCategory.id === 'eruptionSpace'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <p class="text-xs text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        Eruption space will provide enough clearance between the aligner and the erupting canines, and/or premolars to accommodate their eruption path throughout the aligner's treatment.
                      </p>
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary mt-6">Select eruption spaces for this case</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.eruptionSpace?.selectedTeeth || []" @toggle="(tooth) => toggleTooth('eruptionSpace', tooth)" />
                    </div>
                  </div>
                </template>

                <!-- 14. Teeth Movement Restrictions -->
                <template v-else-if="activeCategory.id === 'movementRestrictions'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <p class="text-xs text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        Some teeth cannot be moved by aligners, like implants and bridges, please indicate those teeth below.
                      </p>
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary mt-6">Restrict the teeth that cant be moved</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.movementRestrictions?.selectedTeeth || []" @toggle="(tooth) => toggleTooth('movementRestrictions', tooth)" />
                    </div>
                  </div>
                </template>

                <!-- 15. Passive Aligner -->
                <template v-else-if="activeCategory.id === 'passiveAligner'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <p class="text-xs text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        Use passive aligners to maintain teeth position in one arch while the teeth in the opposing arch are still under treatment.
                      </p>
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary mt-6">Passive Aligners Options (Add passive aligners)</h5>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label v-for="opt in passiveAlignerOpts" :key="opt" class="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all" :class="formData.detailedPlan.passiveAligner?.option === opt ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-slate-100 dark:border-slate-800 text-slate-500'" @click="setSingleOpt('passiveAligner', 'option', opt)">
                          <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="formData.detailedPlan.passiveAligner?.option === opt ? 'border-brand-primary' : 'border-slate-300'">
                            <div v-if="formData.detailedPlan.passiveAligner?.option === opt" class="w-2 h-2 rounded-full bg-brand-primary"></div>
                          </div>
                          <span class="text-xs font-bold">{{ opt }}</span>
                        </label>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">? Do you have any notes regarding the Passive aligners</label>
                      <textarea :value="formData.detailedPlan.passiveAligner?.notes" @input="setSingleOpt('passiveAligner', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <!-- 16. Overcorrection -->
                <template v-else-if="activeCategory.id === 'overcorrection'">
                  <div class="space-y-8">
                    <div class="space-y-4">
                      <p class="text-xs text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        Use overcorrection to plan movements beyond the ideal teeth positions to compensate for a lag in tracking.
                      </p>
                      <h5 class="text-xs font-black uppercase tracking-widest text-brand-primary mt-6">Select the tooth areas requiring overcorrection</h5>
                      <TeethSelector :selectedTeeth="formData.detailedPlan.overcorrection?.selectedTeeth || []" @toggle="(tooth) => toggleTooth('overcorrection', tooth)" />
                    </div>
                    <div class="space-y-4">
                      <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">? Do you have any notes regarding the overcorrection</label>
                      <textarea :value="formData.detailedPlan.overcorrection?.notes" @input="setSingleOpt('overcorrection', 'notes', $event.target.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm" placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </template>

                <div v-else class="min-h-[200px] flex items-center justify-center text-slate-400 italic">
                  Waiting for options for {{ activeCategory.label }}...
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 z-10">
                <button @click="activeCategory = null" class="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
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

const categories = [
  { id: 'apDiscrepancy', label: 'A-P discrepancy', icon: 'fas fa-arrows-alt-h' },
  { id: 'verticalDiscrepancy', label: 'Vertical discrepancy', icon: 'fas fa-arrows-alt-v' },
  { id: 'transverseDiscrepancy', label: 'Transverse discrepancy', icon: 'fas fa-exchange-alt' },
  { id: 'crowdingSpacing', label: 'Crowding/spacing', icon: 'fas fa-compress-arrows-alt' },
  { id: 'elastics', label: 'Elastics', icon: 'fas fa-band-aid' },
  { id: 'biteRamps', label: 'Bite Ramps', icon: 'fas fa-mountain' },
  { id: 'pontics', label: 'Pontics', icon: 'fas fa-tooth' },
  { id: 'attachments', label: 'Attachments', icon: 'fas fa-plus-square' },
  { id: 'toothSizeDiscrepancy', label: 'Tooth size Discrepancy', icon: 'fas fa-ruler-horizontal' },
  { id: 'archExpansion', label: 'Arch expansion', icon: 'fas fa-expand-alt' },
  { id: 'extraction', label: 'Extraction', icon: 'fas fa-minus-circle' },
  { id: 'ipr', label: 'Interproximal reduction', icon: 'fas fa-file-alt' },
  { id: 'eruptionSpace', label: 'Eruption Space', icon: 'fas fa-star' },
  { id: 'movementRestrictions', label: 'Teeth Movement Restrictions', icon: 'fas fa-lock' },
  { id: 'passiveAligner', label: 'Passive Aligner', icon: 'fas fa-shield-alt' },
  { id: 'overcorrection', label: 'Overcorrection', icon: 'fas fa-check-double' }
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
