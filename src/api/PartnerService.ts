import type { MultiPolygon, Point } from "@turf/turf";
import axios from './config/config';
import { TYPE, useToast } from "vue-toastification";
import { notification } from "@/notifications/toast";


export interface Partner {
    id?: number,
    tradingName: string,
    ownerName: string,
    document: string,
    coverageArea: MultiPolygon,
    address: Point
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
    async updatePartner(partner: any) {
        try {
            await axios.put("/partner", partner)
            notification({ text: "Saved successfull", type: TYPE.SUCCESS })
            return true
        } catch (e: any) {
            notification({ text: e.response.data.message, type: TYPE.ERROR })
            return null;
        }

    }
}

export default PartnerService