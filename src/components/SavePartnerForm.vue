<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { LPopup, LTooltip } from '@vue-leaflet/vue-leaflet'

const tradingName: Ref<string> = ref('')
const ownerName: Ref<string> = ref('')
const document: Ref<string> = ref('')
</script>

<template>
  <l-popup>
    <div class="flex flex-col mt-2">
      <label class="mb-1" for="">tradingName</label>
      <input v-model="tradingName" class="border-2" type="text" />
      <label class="mb-1" for="">ownerName</label>
      <input v-model="ownerName" class="border-2" type="text" />
      <label class="mb-1" for="">document</label>
      <input v-model="document" class="border-2" type="text" />
      <button type="button" class="bg-amber-300 rounded-lg mt-2">Save</button>
    </div>
  </l-popup>
  <l-tooltip>Click for save informations</l-tooltip>
</template>
