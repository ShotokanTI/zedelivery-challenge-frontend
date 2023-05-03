<script setup lang="ts">
import L, { LatLng, type LatLngTuple } from 'leaflet'
import {
  createApp,
  h,
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue'
import type { LocationDetails } from '@/types/MapLeafletTypes'
import type { FeatureCollection, Polygon } from 'geojson'
import { options } from './utils/GeneralOptions'
import FormPartnerInformation from './FormPartnerInformation.vue'

const drawQuantity = ref(0)
const coverageAreaRef: any = ref([])
const addressRef: any = ref([])
const refsChildrenComponents: any = ref([])
const currentLayerToDelete: any = ref(null)


const props = defineProps<{
  allMarkersPositions: LocationDetails[]
  allDemarcatedArea: FeatureCollection<Polygon>[][]
  allDataMerged: []
  selectedAddress: LatLngTuple
}>()

function renderChildComponent(idParent: number) {
  refsChildrenComponents.value.push({ ['ref' + idParent]: ref() })

  //render the child and set the props
  return h(FormPartnerInformation as any, {
    idLayer: idParent,
    ref: 'ref' + idParent,
    ...toRefs({ coverageArea: coverageAreaRef, address: addressRef,triggerDrawDelete:currentLayerToDelete })
  })
}

function renderWhenApiHasData(
  { id, tradingName, ownerName, document, idParent } = {
    id: Number,
    tradingName: String,
    ownerName: String,
    document: String,
    idParent: Number
  }
) {
  refsChildrenComponents.value.push({ ['ref' + idParent]: ref(null) })

  const re = refsChildrenComponents.value.find((item) =>
    Object.keys(item).includes('ref' + idParent)
  )

  //render the child and set the props
  return h(FormPartnerInformation as any, {
    ref: 'ref' + idParent,
    idLayer: idParent,
    id: id,
    tradingName: tradingName,
    ownerName: ownerName,
    documentPartner: document,
    ...toRefs({
      coverageArea: coverageAreaRef,
      address: addressRef,
      triggerDrawDelete:currentLayerToDelete
    })
  })
}

function formatedLatLngType(latLngs: LatLng[] | LatLng[][] | LatLng[][][]) {
  return [
    latLngs.map((item: any) => {
      // Map each item in the LatLngs array to an array of values
      return item.map((data: any) => {
        const x = Object.values(data)[0]
        const y = Object.values(data)[1]
        // coverageAreaRef.value
        // removed properties lat and lng
        return [y, x]
      })
    })
  ]
}

function editCurrentLayer(layer: any) {
  const searchCurrentEditedLayerToUpdate = (item: any) => item.idParent === layer.idParent
  if (layer instanceof L.Polygon) {
    let currentCoverageArea = coverageAreaRef.value.find(searchCurrentEditedLayerToUpdate)
    let polygonLatlng = layer.getLatLngs()
    currentCoverageArea.coordinates = formatedLatLngType(polygonLatlng)
  } else if (layer instanceof L.Marker) {
    let currentAddressRef = addressRef.value.find(searchCurrentEditedLayerToUpdate)
    let markerLatlng = layer.getLatLng()
    currentAddressRef.coordinates = Object.values(markerLatlng)
  }
}

function createDraws(layer: any, map: L.Map) {
  drawQuantity.value += 1
  const latLngs = layer.getLatLngs()
  const featureLayer = L.featureGroup([layer]).addTo(map)

  const idParent = L.Util.stamp(featureLayer)

  coverageAreaRef.value.push({
    idParent,
    type: 'MultiPolygon',
    coordinates: formatedLatLngType(latLngs)
  })
  const actualAddress = coverageAreaRef.value.find((item: any) => item.idParent === idParent)
  addressRef.value.push({
    idParent,
    type: 'Point',
    coordinates: [actualAddress.coordinates.flat(3)[1], actualAddress.coordinates.flat(3)[0]]
  })

  const appcreated = createApp(renderChildComponent(idParent))

  // Map the LatLngs to an array of values

  featureLayer.bindTooltip('Click to open form to save partner informations.')

  const element = document.createElement('div')
  element.id = 'element' + drawQuantity.value
  const container = document.getElementById('container-ref')
  if (container) {
    container.appendChild(element)
  }

  appcreated.mount(document.querySelector('#' + element.id) as HTMLElement)

  featureLayer.bindPopup(document.querySelector('#' + element.id) as HTMLElement)

  console.log(addressRef.value.at(-1))

  let marker: any = L.marker(addressRef.value.at(-1).coordinates)

  layer.idParent = idParent
  marker.idParent = idParent

  marker.addTo(featureLayer)

  return featureLayer
}

function addNonGroupLayers(sourceLayer, targetGroup) {
  if (sourceLayer instanceof L.LayerGroup) {
    sourceLayer.eachLayer(function (layer) {
      addNonGroupLayers(layer, targetGroup)
    })
  } else {
    targetGroup.addLayer(sourceLayer)
  }
}

function initMap() {
  const map = L.map('map').setView(props.selectedAddress, 4)
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
  let LayerGroups: L.FeatureGroup[] = []
  const featureGroup = options.edit.featureGroup

  map.addLayer(featureGroup)

  let drawControl = new L.Control.Draw(options)
  map.addControl(drawControl)

  map.on('draw:created', function (e: L.LeafletEvent) {
    LayerGroups.push(createDraws(e.layer, map))

    LayerGroups.forEach((group) => {
      group.eachLayer((layer) => {
        featureGroup.addLayer(layer)
      })
    })
  })

  map.on('draw:edited', function (e: L.LeafletEvent) {
    e.layers.eachLayer(function (layer: any) {
      console.log(layer)
      editCurrentLayer(layer)
    })
  })

  map.on('draw:deleted', (e: L.LeafletEvent) => {
    e.layers.eachLayer(function (layer: any) {
      currentLayerToDelete.value  = layer.idParent
    })
  })

  watch(
    () => props.selectedAddress,
    () => {
      map.setView(props.selectedAddress, 5)
      const markerLayer = L.marker(props.selectedAddress).addTo(map)
      map.on('zoom', () => {
        map.removeLayer(markerLayer)
      })
    }
  )

  watch(
    [props.allDemarcatedArea, props.allMarkersPositions],
    () => {
      const GeoJson: any = props.allDemarcatedArea.map((item) => {
        const layer = L.geoJson(item)
        addNonGroupLayers(layer, featureGroup)
        return layer
      })

      const allDemarcatedArea: any = Object.values(GeoJson[0]._layers)

      props.allMarkersPositions.forEach((marker, i) => {
        const markerLocations: any = L.marker(marker.locations as LatLngTuple).addTo(map)
        markerLocations.idParent = L.Util.stamp(allDemarcatedArea[i])
        featureGroup.addLayer(markerLocations)
      })

      props.allDataMerged.forEach((item: any, i) => {
        drawQuantity.value += 1
        const idParent = L.Util.stamp(allDemarcatedArea[i])

        item.coverageArea.idParent = idParent
        item.address.idParent = idParent
        item.idParent = idParent

        coverageAreaRef.value.push(item.coverageArea)
        addressRef.value.push(item.address)

        const appcreated = createApp(renderWhenApiHasData(item))
        allDemarcatedArea[i].bindTooltip('Click to open form to save partner informations.')

        const element = document.createElement('div')
        element.id = 'element' + drawQuantity.value
        element.setAttribute('ref', 'ref' + idParent)
        const container = document.getElementById('container-ref')
        if (container) {
          container.appendChild(element)
        }
        appcreated.mount(document.querySelector('#' + element.id) as HTMLElement)

        allDemarcatedArea[i]
          .bindPopup(document.querySelector('#' + element.id) as HTMLElement)
          .addTo(featureGroup)

        allDemarcatedArea[i].idParent = idParent
      })

      // Map the LatLngs to an array of values
    },
    { deep: true }
  )
}

onMounted(() => {
  initMap()
  console.log()
})

</script>

<template>
  <div id="map" style="height: calc(100vh - 240px)"></div>
  <div id="container-ref" v-show="false"></div>
</template>
