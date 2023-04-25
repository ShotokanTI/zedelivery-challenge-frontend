
interface Geometry {
    type: string,
    coordinates: Array<Array<Array<number>>>
}

interface Properties {
    code: string,
    nom: string
}

interface Features {
    type: string,
    geometry: Geometry
    properties: Properties
}

export interface GeoJsonType {
    type?: string,
    features: Array<Features>
}


export interface LocationDetails {
    tradingName: string|null,
    ownerName: string|null,
    document: string|null,
    locations: number[]
}