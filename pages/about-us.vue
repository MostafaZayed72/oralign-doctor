<template>
  <div>
    <Head><Title>{{ $t('about_us') }}</Title></Head>

    <PageHeader :title="$t('about_us')" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <!-- Main about content -->
        <div v-if="data?.about" class="flex flex-col md:flex-row gap-12 mb-16 items-center">
          <div class="md:w-1/2">
            <p class="section-subtitle">{{ data.about.title }}</p>
            <div class="prose max-w-none text-gray-600 leading-relaxed" v-html="data.about.text" />
            <NuxtLink :to="localePath('/become-doctor')" class="btn-primary mt-6 inline-block">
              {{ $t('become_doctor') }}
            </NuxtLink>
          </div>
          <div class="md:w-1/2">
            <img
              v-if="data.about.image"
              :src="data.about.image"
              :alt="data.about.alt_img || $t('about_us')"
              class="w-full rounded-xl shadow-md object-cover"
            >
          </div>
        </div>

        <!-- About Strucs -->
        <div v-if="data?.aboutStrucs?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="item in data.aboutStrucs"
            :key="item.id"
            class="text-center p-6 rounded-xl border border-gray-100 shadow-sm card-hover"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="w-16 h-16 object-cover rounded-full mx-auto mb-4"
            >
            <h3 class="font-bold text-lg text-gray-800 mb-2">{{ item.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { locale } = useI18n()
const localePath = useLocalePath()

const { data } = await useFetch<any>(
  () => `${config.public.apiBase}/about-us?lang=${locale.value}`,
)
</script>
