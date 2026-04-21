<template>
  <div>
    <Head><Title>{{ $t('case_studies') }}</Title></Head>

    <PageHeader :title="$t('case_studies')" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <!-- Category tabs -->
        <div v-if="data?.categories?.length" class="flex flex-wrap gap-3 mb-10 justify-center">
          <NuxtLink
            v-for="cat in data.categories"
            :key="cat.id"
            :to="localePath(`/case-studies/${cat.link}`)"
            class="px-5 py-2 rounded-full border text-sm font-medium transition"
            :class="cat.link === route.params.link
              ? 'bg-primary text-white border-primary'
              : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'"
          >
            {{ cat.name }}
          </NuxtLink>
        </div>

        <!-- Case studies grid -->
        <div v-if="data?.caseStudies?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="cs in data.caseStudies"
            :key="cs.id"
            :to="localePath(`/case-study/${cs.link}/details`)"
            class="group block card-hover rounded-xl overflow-hidden shadow-sm border border-gray-100"
          >
            <div class="aspect-video overflow-hidden bg-gray-100">
              <img
                v-if="cs.image"
                :src="cs.image"
                :alt="cs.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              >
            </div>
            <div class="p-5">
              <h3 class="font-bold text-gray-800 group-hover:text-primary transition">{{ cs.title }}</h3>
            </div>
          </NuxtLink>
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

const { data } = await useFetch<any>(
  () => `${config.public.apiBase}/case-studies/${route.params.link}?lang=${locale.value}`,
)
</script>
