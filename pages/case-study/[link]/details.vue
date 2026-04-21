<template>
  <div>
    <Head><Title>{{ data?.caseStudy?.title }}</Title></Head>

    <PageHeader v-if="data?.caseStudy" :title="data.caseStudy.title" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <div v-if="data?.caseStudy" class="max-w-4xl mx-auto">
          <img
            v-if="data.caseStudy.image"
            :src="data.caseStudy.image"
            :alt="data.caseStudy.title"
            class="w-full rounded-xl shadow-md object-cover aspect-video mb-8"
          >
          <div class="prose max-w-none text-gray-700 leading-relaxed" v-html="data.caseStudy.text" />
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

const { data } = await useFetch<any>(
  () => `${config.public.apiBase}/case-study/${route.params.link}/details?lang=${locale.value}`,
)
</script>
