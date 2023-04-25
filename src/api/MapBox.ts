import axios from './config/config';

const mapboxToken = import.meta.env.VITE_VUE_APP_ACCESS_TOKEN_MAP_BOX;

export async function fetchLocalMapBox(local: string):Promise<any> {
    const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${local}.json?access_token=${mapboxToken}
    `)
    return result.data
}