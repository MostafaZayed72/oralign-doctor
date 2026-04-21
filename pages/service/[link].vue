<template>
  <div>
    <Head><Title>{{ data?.service?.name }}</Title></Head>

    <PageHeader v-if="data?.service" :title="data.service.name" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <div v-if="data?.service" class="flex flex-col lg:flex-row gap-12">
          <!-- Main content -->
          <div class="lg:w-2/3">
            <img
              v-if="data.service.img"
              :src="data.service.img"
              :alt="data.service.alt_image || data.service.name"
              class="w-full rounded-xl shadow-md object-cover aspect-video mb-8"
            >
            <div class="prose max-w-none text-gray-600 leading-relaxed" v-html="data.service.text" />

            <!-- Sub-services -->
            <div v-if="data.subServices?.length" class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="sub in data.subServices"
                :key="sub.id"
                class="border border-gray-100 rounded-xl p-5 shadow-sm card-hover"
              >
                <img v-if="sub.img" :src="sub.img" :alt="sub.name" class="w-full aspect-video object-cover rounded-lg mb-4">
                <h3 class="font-bold text-gray-800 mb-2">{{ sub.name }}</h3>
                <p class="text-gray-500 text-sm leading-relaxed">{{ sub.short_text }}</p>
              </div>
            </div>

            <!-- FAQs -->
            <div v-if="data.faqs?.length" class="mt-12">
              <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('faqs') }}</h2>
              <div class="space-y-4">
                <details
                  v-for="faq in data.faqs"
                  :key="faq.id"
                  class="group border border-gray-200 rounded-xl overflow-hidden"
                >
                  <summary class="flex items-center justify-between px-5 py-4 font-semibold text-gray-700 cursor-pointer list-none hover:bg-gray-50">
                    {{ faq.question }}
                    <i class="fas fa-chevron-down text-xs text-gray-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div class="px-5 py-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    {{ faq.answer }}
                  </div>
                </details>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="lg:w-1/3">
            <div class="bg-gray-50 rounded-xl p-6 sticky top-24">
              <h3 class="font-bold text-gray-800 mb-4">{{ $t('services') }}</h3>
              <ul class="space-y-2">
                <li v-for="srv in data.services" :key="srv.id">
                  <NuxtLink
                    :to="localePath(`/service/${srv.link}`)"
                    class="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition py-1"
                    :class="{ 'text-primary font-semibold': srv.link === route.params.link }"
                  >
                    <i :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'" class="fas text-xs text-primary" />
                    {{ srv.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </aside>
        </div>
        <p v-else class="text-center text-gray-400 py-12">{{ $t('no_data') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { locale } = useI18n()
const localePath = useLocalePath()
const isRtl = computed(() => locale.value === 'ar')

const { data } = await useFetch<any>(
  () => `${config.public.apiBase}/service/${route.params.link}?lang=${locale.value}`,
)
</script>
