import type { MultiPolygon, Point } from "@turf/turf";
import axios from './config/config';
import { TYPE, useToast } from "vue-toastification";
import { notification } from "@/notifications/toast";

interface CoverageArea {
    type: String,
    coordinates: MultiPolygon
}

interface Address {
    type: string,
    coordinates: Point
}

export interface Partner {
    id?: number,
    tradingName: string|null,
    ownerName: string|null,
    document: string|null,
    coverageArea: CoverageArea,
    address: Address
}

const toast = useToast()


class PartnerService {
    async getPartnerById(id: number): Promise<Partner | null> {
        try {
            const partner = await axios.get(`/partner/${id}`)
            return partner.data
        } catch (e:any) {
            notification({ text: e.response.data.message, type: TYPE.ERROR })
            return null
        }
    }
    async getAllPartnes(): Promise<Array<Partner[] | null>> {
    try {
        const partners = await axios.get(`/partner`)
        return partners.data
    } catch (e:any) {
        notification({ text: e.response.data.message, type: TYPE.ERROR });
        return [null];
    }
}
    async savePartner(partner: any) {
        try {
            await axios.post("/partner", partner)
            notification({ text: "Saved successfull", type: TYPE.SUCCESS })
            return true
        } catch (e: any) {
            notification({ text: e.response.data.message, type: TYPE.ERROR })
            return null;
        }

    }
}

export default PartnerService