<script setup lang="ts">
import {
  computed,
  defineProps,
  ref,
  type Ref,
  onMounted,
  onBeforeUnmount,
watch
} from 'vue'
import type { CoverageArea, Address, Partner } from '@/api/PartnerService'
import PartnerService from '@/api/PartnerService'

const service = new PartnerService()

const tradingNameRef: Ref<String> = ref('')
const ownerNameRef: Ref<String> = ref('')
const documentPartnerRef: Ref<String> = ref('')
const CoverageArea: Ref<CoverageArea> = ref('')
const Address: Ref<Address> = ref('')


const props = defineProps<{
  idLayer: {
    type: Number
    required: true
  }
  id: {
    type: Number
  }
  tradingName: {
    type?: String
  }
  ownerName: {
    type?: String
  }
  documentPartner: {
    type?: String
  }
  coverageArea: {
    type?: CoverageArea
  }
  address: {
    type?: Address
  },
  triggerDrawDelete:{
    type?: Number,
    required:false
  }
}>()


watch(props.triggerDrawDelete,() => {
  if(props.triggerDrawDelete){
    service.deletePartner(props.id)
  }
})


const partner = computed<Partner>(() => {
  const searchCurrentEditedLayerToUpdate = (item) => item.idParent == props.idLayer
  return {
    tradingName: tradingNameRef.value,
    ownerName: ownerNameRef.value,
    document: documentPartnerRef.value,
    id: props.id,
    coverageArea: CoverageArea.value._value.find(searchCurrentEditedLayerToUpdate),
    address: Address.value._value.find(searchCurrentEditedLayerToUpdate)
  }
})

onMounted(() => {
  tradingNameRef.value = props.tradingName
  ownerNameRef.value = props.ownerName
  documentPartnerRef.value = props.documentPartner
  CoverageArea.value = props.coverageArea
  Address.value = props.address
})

async function savePartner() {
  try {
    if (props.id) {
      const result = await service.updatePartner(partner.value)
    } else {
      const result = await service.savePartner(partner.value)
    }
  } catch (e) {
    console.log(e)
  }
}
async function updatePartner() {
  try {
    const result = await service.updatePartner(partner.value)
  } catch (e) {
    console.log(e)
  }
}
  
</script>

<template>
  <div class="flex flex-col mt-2">
    <label class="mb-1" for="">TradingName</label>
    <input v-model="tradingNameRef" class="border-2" type="text" />
    <label class="mb-1" for="">OwnerName</label>
    <input v-model="ownerNameRef" class="border-2" type="text" />
    <label class="mb-1" for="">Document</label>
    <input v-model="documentPartnerRef" class="border-2" type="text" />
    <button @click="savePartner" type="button" class="bg-amber-300 rounded-lg mt-2">Save</button>
  </div>
</template>
