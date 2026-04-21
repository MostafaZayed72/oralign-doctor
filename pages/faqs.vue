<template>
  <div>
    <Head><Title>{{ $t('faqs') }}</Title></Head>

    <PageHeader :title="$t('faqs')" />

    <section class="py-16 bg-white">
      <div class="page-container max-w-3xl mx-auto">
        <div v-if="data?.faqs?.length" class="space-y-4">
          <details
            v-for="faq in data.faqs"
            :key="faq.id"
            class="group border border-gray-200 rounded-xl overflow-hidden"
          >
            <summary class="flex items-center justify-between px-6 py-5 font-semibold text-gray-700 cursor-pointer list-none hover:bg-gray-50 transition">
              {{ faq.question }}
              <i class="fas fa-chevron-down text-xs text-primary transition-transform group-open:rotate-180 flex-shrink-0 ms-4" />
            </summary>
            <div class="px-6 py-5 text-gray-600 leading-relaxed border-t border-gray-100 text-sm">
              {{ faq.answer }}
            </div>
          </details>
        </div>
        <p v-else class="text-center text-gray-400 py-12">{{ $t('no_data') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { locale } = useI18n()

const { data } = await useFetch<any>(
  () => `${config.public.apiBase}/faqs?lang=${locale.value}`,
)
</script>
