<template>
  <div>
    <Head><Title>{{ data?.page?.title }}</Title></Head>

    <PageHeader v-if="data?.page" :title="data.page.title" />

    <section class="py-16 bg-white">
      <div class="page-container max-w-4xl mx-auto">
        <div v-if="data?.page" class="prose max-w-none text-gray-700 leading-relaxed" v-html="data.page.text" />
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
  () => `${config.public.apiBase}/page/${route.params.link}?lang=${locale.value}`,
)
</script>
