import axios from 'axios'
import {cities} from './locations/cities'
export const getCitiesOption = () => {
  const data = cities.data
  return data.map(({name}: {name: string}) => ({value: name, label: name}))
}
export const getCitiesId = (name='') => {
  const data = cities.data
  return data.find((obj) => obj.name===name)?.id
}

export const getDistristOption = async (city: string) => {
  const id = getCitiesId(city)
  if (!id) {
    return []
  }
  const url = `${PATHS.DISTRICTS}/${id}.json`;
  const locations = (await axios.get(url)).data["data"];
  return [{ value: '', label: '' },...locations.map(({ name }: { name: string}) => ({ value: name, label: name }))];
}

export const getWardOption = async (city: string, district: string) => {
  const id = getCitiesId(city)
  if (!id) {
    return []
  }
  const url = `${PATHS.DISTRICTS}/${id}.json`;
  const locations = (await axios.get(url)).data["data"];
  const districtId = locations.find((obj: { name: string, id: string}) => obj.name === district)?.id
  if (!districtId) {
    return []
  }
  const url1 = `${PATHS.WARDS}/${districtId}.json`
  const location1 = (await axios.get(url1)).data["data"]
  return [{ value: '', label: '' }, ...location1.map(({ name }: { name: string}) => ({ value: name, label: name }))];
}

const PATHS = {
  CITIES:
    "https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/cities.json",
  DISTRICTS:
    "https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/districts",
  WARDS:
    "https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/wards",
  LOCATION:
    "https://raw.githubusercontent.com/nhidh99/codergamo/master/004-location-selects/locations/location.json"
};
