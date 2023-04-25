<script setup lang="ts">
import { fetchLocalMapBox } from '@/api/MapBox'
import { ref, watch, type Ref } from 'vue'

type Place = {
  label?: string
  value?: string
  position: number[]
}

const emit = defineEmits(['selectedOptionAddress'])

const places: Ref<Place[] | null> = ref([])
const selectedAddress: Ref<any> = ref('')
const loading: Ref<any> = ref(false)

async function onSearchAddress(txt: string,loading:any) {
  const response: any = await fetchLocalMapBox(txt)

  setPlaces(response)
}

function setPlaces(response: any) {
  places.value = response.features.map((item: any) => {
    return {
      label: item.place_name,
      value: item.place_name,
      position: [item.center[1], item.center[0]]
    }
  })
}

function clearSearchOnBlur(){
  return {
    clearSearchOnSelect:false,
    multiple:false
  }
}

watch(selectedAddress, () => {
  emit('selectedOptionAddress', selectedAddress.value.position)
})
</script>

<template>
  <div class="m-5">
    <h1 class="text-3xl mb-10 text-yellow-400">What address are you looking for?</h1>
    <v-select  :placeholder="'Seach an address to show in map below'" :clearSearchOnBlur="clearSearchOnBlur" :loading="loading" :filterable="false" v-model="selectedAddress" :options="places" @search="onSearchAddress">
    </v-select>
  </div>
</template>

<style>
@import 'vue-select/dist/vue-select.css';
</style>
