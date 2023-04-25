<script setup lang="ts">
import PartnerService, { type Partner } from '@/api/PartnerService'
import LFreeDraw from 'vue2-leaflet-freedraw';
import { NONE, ALL } from 'leaflet-freedraw';
import { computed, onMounted, ref, type Ref, reactive, onBeforeMount } from 'vue'
import 'leaflet/dist/leaflet.css'
import SelectAddress from './SelectAddress.vue'
import StepsMap from './layout/StepsMap.vue'
import {
  LMap,
  LTileLayer,
  LMarker,
  LGeoJson,
  LIcon,
  LPopup,
  LPolyline,
  LControl,
  LTooltip
} from '@vue-leaflet/vue-leaflet'
import type { FeatureCollection, Polygon } from 'geojson'
import type { LocationDetails } from '@/types/MapLeafletTypes'
import type { LatLng, LatLngExpression, PointExpression } from 'leaflet'

const service = new PartnerService()

const Partnes = reactive({
  tradingName: null,
  ownerName: null,
  document: null,
  zoom: 3 as number,
  allExactLocationPartner: [] as LocationDetails[],
  allDemarcatedArea: [] as FeatureCollection<Polygon>[][]
})

let markersCreated = ref([])
const markeExactPointAdress: Ref<number[]> = ref([])
let addressSearched: Ref<LatLng> = ref({ lat: 0, lng: 0 } as LatLng)


let markerWithCurrentLatLng: Ref<LatLng> = ref({ lat: 0, lng: 0 } as LatLng)

const travels = computed(() => {
  return markersCreated.value.map((item: any) => item.travel)
})

const styleFunction = computed(() => {
  return () => {
    return {
      weight: 2,
      color: '#ECEFF1',
      opacity: 0.4,
      fillColor: '#e4ce7f',
      fillOpacity: 0.4
    }
  }
})

function clearAllMarkes() {
  markersCreated.value = []
  markeExactPointAdress.value = []
  addressSearched.value = { lat: 0, lng: 0 } as LatLng
  Partnes.zoom = 3
}

function addMarkeExactPointAdress() {
  markeExactPointAdress.value = markerWithCurrentLatLng.value
}

function addMarker() {
  const newMarker = {
    position: markerWithCurrentLatLng.value,
    draggable: true,
    visible: true,
    travel: [] as any
  }

  newMarker.travel.push(...Object.values(newMarker.position))

  markersCreated.value.push(newMarker)
}

async function savePartner() {
  const partner: Partner = {
    tradingName: Partnes.tradingName,
    ownerName: Partnes.ownerName,
    document: Partnes.document,
    coverageArea: {
      type: 'MultiPolygon',
      coordinates: [[travels.value]] as any
    },
    address: {
      type: 'Point',
      coordinates: [...Object.values(markeExactPointAdress.value)] as any
    }
  }

  try {
    const result = await service.savePartner(partner)

    if (result) {
      const partnerData = await fetchAllPartnes()
      markAllPartnesInMap(partnerData)
      clearAllMarkes()
    }
  } catch (e) {
    console.log(e)
  }
}

async function fetchPartnerById(id: number): Promise<Partner | null> {
  const partner = await service.getPartnerById(id)
  return partner
}

async function fetchAllPartnes(): Promise<Array<Partner[] | null>> {
  const partner = await service.getAllPartnes()
  return partner
}

function markAllPartnesInMap(allPartnes: Partner[]) {
  Partnes.allDemarcatedArea.push(
    allPartnes.map((partner) => {
      const coordinates: any = partner.coverageArea.coordinates.coordinates[0]
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

  Partnes.allExactLocationPartner.push(
    ...allPartnes.map((partner) => {
      return {
        tradingName: partner.tradingName,
        ownerName: partner.ownerName,
        document: partner.document,
        locations: partner.address.coordinates.coordinates
      }
    })
  )
}

function updateLatLng(marker, newLatLng) {
  marker.position = newLatLng

  marker.travel = Object.values(newLatLng)
}

onBeforeMount(async () => {
  const partnerData = await fetchAllPartnes()
  markAllPartnesInMap(partnerData)
})
</script>

<template>
  <steps-map></steps-map>
  <div class="flex flex-col justify-center w-full bg-zinc-100" style="height: calc(100vh - 120px)">
    <div
      class="container bg-white mx-auto rounded-3xl w-100 h-4/6 shadow-2xl relative flex flex-col justify-end"
    >
      <select-address
        @selected-option-address="
          (value) => {
            addressSearched = value
          }
        "
        class="p-10"
      ></select-address>
      <l-map
        class="rounded-3xl"
        style="height: 86%"
        :use-global-leaflet="false"
        ref="map"
        v-model:zoom="Partnes.zoom"
        @update:center="(v) => markerWithCurrentLatLng = v "
        :center="addressSearched"
      >

      <l-control position="topleft">
    
  </l-control>
  <l-freedraw :mode="1" />
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>

        <l-polyline :lat-lngs="travels" />

        <l-marker
          v-if="addressSearched.lat !== 0 && addressSearched.lng !== 0"
          :lat-lng="addressSearched"
        >
        </l-marker>

        <l-marker
          v-if="Object.keys(markeExactPointAdress).length"
          :draggable="true"
          @update:latLng="(updated) => (markeExactPointAdress = updated)"
          :lat-lng="markeExactPointAdress"
        ></l-marker>

        <l-marker
          v-for="marker in markersCreated"
          :key="marker.id"
          :visible="marker.visible"
          :draggable="marker.draggable"
          :lat-lng.sync="marker.position"
          @update:latLng="(updated) => updateLatLng(marker, updated)"
        >
          <l-popup>
            <div class="flex flex-col mt-2">
              <label class="mb-1" for="">TradingName</label>
              <input v-model="Partnes.tradingName" class="border-2" type="text" />
              <label class="mb-1" for="">OwnerName</label>
              <input v-model="Partnes.ownerName" class="border-2" type="text" />
              <label class="mb-1" for="">Document</label>
              <input v-model="Partnes.document" class="border-2" type="text" />
              <button @click="savePartner" type="button" class="bg-amber-300 rounded-lg mt-2">
                Save
              </button>
            </div>
          </l-popup>
          <l-tooltip>Click for save Partnes</l-tooltip>
        </l-marker>

        <l-marker @click.native="addressSearched = marker.locations;Partnes.zoom = 11" v-for="marker in Partnes.allExactLocationPartner" :lat-lng="marker.locations">
          <l-icon :icon-size="[26, 30]" icon-url="./src/assets/icons/quisque.png"></l-icon>
          <l-tooltip>
            <div class="flex flex-col justify-center">
              <div class="flex">
                <p class="text-xl">TradingName: {{ marker.tradingName }}</p>
              </div>
              <div class="flex">
                <p class="text-xl">OwnerName: {{ marker.ownerName }}</p>
              </div>
              <div class="flex">
                <p class="text-xl">Document: {{ marker.document }}</p>
              </div>
              <div class="flex">
                <p class="text-xl">Locations: {{ marker.locations }}</p>
              </div>
            </div>
          </l-tooltip>
        </l-marker>

        <l-geo-json
          v-for="geojson in Partnes.allDemarcatedArea"
          :geojson="geojson"
          :options-style="styleFunction"
        />
        <l-control position="bottomleft">
          <button type="button" class="bg-amber-300 rounded-lg px-4 py-2 my-0 m-4 text-white" @click="addMarker">
            Add a marker
          </button>
        </l-control>
        <l-control position="bottomleft">
          <button type="button" class="bg-red-400 rounded-lg text-sm px-3 py-2 m-4 my-0 text-white" @click="clearAllMarkes">
            Clear All Markers
          </button>
        </l-control>
        <l-control v-if="markersCreated.length >= 4" position="bottomleft">
          <button
            type="button"
            class="bg-amber-300 rounded-lg p-2 m-3 text-sm"
            @click="addMarkeExactPointAdress"
          >
            Add exact point address
          </button>
        </l-control>
      </l-map>
    </div>
  </div>
</template>
