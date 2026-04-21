<template>
  <div>
    <Head><Title>{{ $t('packages') }}</Title></Head>

    <PageHeader :title="$t('packages')" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <div v-if="data?.packages?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="pkg in data.packages"
            :key="pkg.id"
            class="rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover flex flex-col"
          >
            <div class="aspect-video overflow-hidden bg-gray-100">
              <img
                v-if="pkg.image"
                :src="pkg.image"
                :alt="pkg.name"
                class="w-full h-full object-cover"
              >
            </div>
            <div class="p-6 flex flex-col flex-1">
              <h3 class="text-xl font-bold text-gray-800 mb-3">{{ pkg.name }}</h3>
              <div class="prose max-w-none text-gray-500 text-sm leading-relaxed flex-1" v-html="pkg.text" />
              <div v-if="pkg.price" class="mt-4 pt-4 border-t border-gray-100">
                <span class="text-2xl font-bold text-primary">{{ pkg.price }}</span>
              </div>
              <NuxtLink :to="localePath('/become-doctor')" class="btn-primary mt-4 text-center">
                {{ $t('become_doctor') }}
              </NuxtLink>
            </div>
          </div>
        </div>
        <p v-else class="text-center text-gray-400 py-12">{{ $t('no_data') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { locale } = useI18n()
const localePath = useLocalePath()

const { data } = await useFetch<any>(
  () => `${config.public.apiProxyBase}/packages?lang=${locale.value}`,
)
</script>
