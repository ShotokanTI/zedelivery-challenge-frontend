<script setup lang="ts">
import PartnerService, { type Partner } from '@/api/PartnerService'
import { onMounted, ref, type Ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import StepsMap from '../layout/StepsMap.vue'
import type { FeatureCollection, Polygon } from 'geojson'
import type { LocationDetails } from '@/types/MapLeafletTypes'

import MapFlet from './MapFlet.vue'
import SelectAddress from '../SelectAddress.vue'

const service = new PartnerService()

const allMarkersPositions: Ref<LocationDetails[]> = ref([])
const allDemarcatedArea: Ref<FeatureCollection<Polygon>[][]> = ref([])
const allDataMerged: Ref<any> = ref([])
const selectedAddress: Ref<any> = ref(null)

async function fetchAllPartnes(): Promise<Array<Partner[] | null>> {
  const partner = await service.getAllPartnes()
  return partner
}

function markAllPartnesInMap(allPartnes: Partner[]) {
  allDataMerged.value = allPartnes
  allDemarcatedArea.value.push(
    allPartnes.map((partner) => {
      const coordinates: any = partner.coverageArea.coordinates[0]

      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: coordinates
            },
            properties: {
              code: '',
              nom: ''
            }
          }
        ]
      }
    })
  )

  allMarkersPositions.value.push(
    ...allPartnes.map((partner) => {
      return {
        tradingName: partner.tradingName,
        ownerName: partner.ownerName,
        document: partner.document,
        id: partner.id,
        locations: partner.address.coordinates
      }
    })
  )
}

onMounted(async () => {
  markAllPartnesInMap(await fetchAllPartnes())
})
</script>

<template>
    <steps-map></steps-map>
    <div class="container mx-auto my-20 shadow-2xl">
      <SelectAddress @selectedOptionAddress="(address) => selectedAddress = address"></SelectAddress>
      <MapFlet
        :all-demarcated-area="allDemarcatedArea"
        :all-markers-positions="allMarkersPositions"
        :allDataMerged="allDataMerged"
        :selected-address="selectedAddress ?? [0,0]"
      />
    </div>
</template>
