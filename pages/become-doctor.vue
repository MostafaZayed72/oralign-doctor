<template>
  <div>
    <Head><Title>{{ $t('become_doctor') }}</Title></Head>

    <PageHeader :title="$t('become_doctor')" />

    <section class="py-16 bg-white">
      <div class="page-container max-w-2xl mx-auto">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <!-- Success message -->
          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 rounded-xl p-6 text-center">
            <i class="fas fa-check-circle text-3xl mb-3" />
            <p class="font-semibold">{{ $t('registration_success') }}</p>
          </div>

          <!-- Form -->
          <form v-else class="space-y-5" @submit.prevent="submit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="form-label">{{ $t('first_name') }} *</label>
                <input v-model="form.f_name" type="text" class="form-input" required>
              </div>
              <div>
                <label class="form-label">{{ $t('last_name') }} *</label>
                <input v-model="form.l_name" type="text" class="form-input" required>
              </div>
            </div>

            <div>
              <label class="form-label">{{ $t('email') }} *</label>
              <input v-model="form.email" type="email" class="form-input" required>
            </div>

            <div>
              <label class="form-label">{{ $t('phone') }} *</label>
              <input v-model="form.phone" type="tel" class="form-input" required>
            </div>

            <!-- Country -->
            <div>
              <label class="form-label">{{ $t('country') }}</label>
              <select v-model="form.country_id" class="form-input" @change="onCountryChange">
                <option value="">{{ $t('select_country') }}</option>
                <option v-for="c in data?.countries" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <!-- Region -->
            <div v-if="regions.length">
              <label class="form-label">{{ $t('region') }}</label>
              <select v-model="form.region_id" class="form-input" @change="onRegionChange">
                <option value="">{{ $t('select_region') }}</option>
                <option v-for="r in regions" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>

            <!-- Area -->
            <div v-if="areas.length">
              <label class="form-label">{{ $t('area') }}</label>
              <select v-model="form.area_id" class="form-input">
                <option value="">{{ $t('select_area') }}</option>
                <option v-for="a in areas" :key="a.id" :value="a.id">{{ a.name }}</option>
              </select>
            </div>

            <!-- Errors -->
            <div v-if="errors.length" class="bg-red-50 border border-red-200 rounded-xl p-4">
              <ul class="text-red-600 text-sm space-y-1 list-disc list-inside">
                <li v-for="(err, i) in errors" :key="i">{{ err }}</li>
              </ul>
            </div>

            <button type="submit" :disabled="loading" class="btn-primary w-full text-center disabled:opacity-60">
              <i v-if="loading" class="fas fa-spinner fa-spin me-2" />
              {{ $t('submit') }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { locale } = useI18n()

const { data } = await useFetch<any>(
  () => `${config.public.apiBase}/become-doctor?lang=${locale.value}`,
)

const form = reactive({
  f_name: '',
  l_name: '',
  email: '',
  phone: '',
  country_id: '' as string | number,
  region_id: '' as string | number,
  area_id: '' as string | number,
})

const regions = ref<Array<{ id: number; name: string }>>([])
const areas = ref<Array<{ id: number; name: string }>>([])
const loading = ref(false)
const success = ref(false)
const errors = ref<string[]>([])

const onCountryChange = async () => {
  form.region_id = ''
  form.area_id = ''
  regions.value = []
  areas.value = []
  if (!form.country_id) return
  regions.value = await $fetch<any[]>(`${config.public.apiBase}/regions`, {
    method: 'POST',
    body: { id: form.country_id, lang: locale.value },
  })
}

const onRegionChange = async () => {
  form.area_id = ''
  areas.value = []
  if (!form.region_id) return
  areas.value = await $fetch<any[]>(`${config.public.apiBase}/areas`, {
    method: 'POST',
    body: { id: form.region_id, lang: locale.value },
  })
}

const submit = async () => {
  errors.value = []
  loading.value = true
  try {
    await $fetch(`${config.public.apiBase}/become-doctor`, {
      method: 'POST',
      body: { ...form, lang: locale.value },
    })
    success.value = true
  }
  catch (err: any) {
    const data = err?.data
    if (data?.errors) {
      errors.value = Object.values(data.errors).flat() as string[]
    }
    else if (data?.message) {
      errors.value = [data.message]
    }
    else {
      errors.value = ['Something went wrong. Please try again.']
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.form-input {
  @apply w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition;
}
</style>
